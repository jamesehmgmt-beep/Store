import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory token cache (per edge function instance)
// For production, consider using Supabase table or KV store
interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
  scope: string;
}

const tokenCache: Map<string, TokenCache> = new Map();

// Refresh buffer: refresh token 5 minutes before expiry
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

async function requestAccessToken(shopDomain: string): Promise<TokenCache> {
  const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
  const clientSecret = Deno.env.get('SHOPIFY_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET');
  }
  
  const tokenUrl = `https://${shopDomain}/admin/oauth/access_token`;
  
  console.log(`[shopify-token] Requesting new access token for ${shopDomain}`);
  
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[shopify-token] Token request failed: ${response.status} - ${errorText}`);
    throw new Error(`Token request failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Validate response has required fields
  if (!data.access_token) {
    console.error('[shopify-token] Invalid token response - missing access_token');
    throw new Error('Invalid token response from Shopify');
  }
  
  // Calculate expiry time
  // expires_in is in seconds, convert to ms and subtract buffer
  const expiresInMs = (data.expires_in || 3600) * 1000; // Default to 1 hour if not provided
  const expiresAt = Date.now() + expiresInMs;
  
  const tokenData: TokenCache = {
    accessToken: data.access_token,
    expiresAt,
    scope: data.scope || '',
  };
  
  console.log(`[shopify-token] Token acquired, expires at ${new Date(expiresAt).toISOString()}`);
  
  return tokenData;
}

async function getAdminAccessToken(shopDomain: string): Promise<{ token: string; expiresAt: number }> {
  const cached = tokenCache.get(shopDomain);
  const now = Date.now();
  
  // Check if we have a valid cached token (with buffer for refresh)
  if (cached && cached.expiresAt > now + REFRESH_BUFFER_MS) {
    console.log(`[shopify-token] Using cached token for ${shopDomain}, expires in ${Math.round((cached.expiresAt - now) / 1000)}s`);
    return {
      token: cached.accessToken,
      expiresAt: cached.expiresAt,
    };
  }
  
  // Need to refresh or get new token
  if (cached) {
    console.log(`[shopify-token] Token expiring soon or expired, refreshing for ${shopDomain}`);
  } else {
    console.log(`[shopify-token] No cached token, requesting new one for ${shopDomain}`);
  }
  
  const newToken = await requestAccessToken(shopDomain);
  tokenCache.set(shopDomain, newToken);
  
  return {
    token: newToken.accessToken,
    expiresAt: newToken.expiresAt,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'health';
    
    // Default shop domain from environment or parameter
    const shopDomain = url.searchParams.get('shop') || 'battiwear.myshopify.com';
    
    if (action === 'health') {
      // Health check endpoint - verifies token can be acquired
      // Does NOT return any secrets
      try {
        const { expiresAt } = await getAdminAccessToken(shopDomain);
        
        return new Response(
          JSON.stringify({
            success: true,
            shopDomain,
            tokenStatus: 'valid',
            expiresAt: new Date(expiresAt).toISOString(),
            expiresInSeconds: Math.round((expiresAt - Date.now()) / 1000),
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('[shopify-token] Health check failed:', error);
        return new Response(
          JSON.stringify({
            success: false,
            shopDomain,
            tokenStatus: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }
    
    if (action === 'get-token') {
      // Internal action to get token for other edge functions
      // This should only be called from other edge functions, not from frontend
      // Verify this is an internal call by checking for service role key (strict check)
      const authHeader = req.headers.get('Authorization');
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      // Strict verification - exact match required
      if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
        console.warn('[shopify-token] get-token called without valid service role auth');
        return new Response(
          JSON.stringify({ error: 'Service role authorization required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { token, expiresAt } = await getAdminAccessToken(shopDomain);
      
      return new Response(
        JSON.stringify({
          success: true,
          accessToken: token,
          expiresAt,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action. Use ?action=health or ?action=get-token' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('[shopify-token] Unhandled error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
