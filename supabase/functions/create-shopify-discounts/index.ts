import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Authentication helper - verifies JWT and returns user
async function verifyAuth(req: Request): Promise<{ user: { id: string; email?: string } } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getClaims(token);
  
  if (error || !data?.claims) {
    return null;
  }

  return { user: { id: data.claims.sub as string, email: data.claims.email as string } };
}

// ============================================================================
// OAUTH TOKEN MANAGEMENT (Client Credentials Grant)
// ============================================================================

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
  scope: string;
}

// In-memory token cache (per edge function instance)
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
  
  console.log(`[oauth] Requesting new access token for ${shopDomain}`);
  
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
    console.error(`[oauth] Token request failed: ${response.status} - ${errorText}`);
    throw new Error(`Token request failed: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.access_token) {
    console.error('[oauth] Invalid token response - missing access_token');
    throw new Error('Invalid token response from Shopify');
  }
  
  // Calculate expiry time (expires_in is in seconds)
  const expiresInMs = (data.expires_in || 3600) * 1000;
  const expiresAt = Date.now() + expiresInMs;
  
  const tokenData: TokenCache = {
    accessToken: data.access_token,
    expiresAt,
    scope: data.scope || '',
  };
  
  console.log(`[oauth] Token acquired, expires at ${new Date(expiresAt).toISOString()}`);
  
  return tokenData;
}

async function getAdminAccessToken(shopDomain: string): Promise<{ token: string; expiresAt: number }> {
  const cached = tokenCache.get(shopDomain);
  const now = Date.now();
  
  // Check if we have a valid cached token (with buffer for refresh)
  if (cached && cached.expiresAt > now + REFRESH_BUFFER_MS) {
    console.log(`[oauth] Using cached token for ${shopDomain}, expires in ${Math.round((cached.expiresAt - now) / 1000)}s`);
    return {
      token: cached.accessToken,
      expiresAt: cached.expiresAt,
    };
  }
  
  // Need to refresh or get new token
  if (cached) {
    console.log(`[oauth] Token expiring soon or expired, refreshing for ${shopDomain}`);
  } else {
    console.log(`[oauth] No cached token, requesting new one for ${shopDomain}`);
  }
  
  const newToken = await requestAccessToken(shopDomain);
  tokenCache.set(shopDomain, newToken);
  
  return {
    token: newToken.accessToken,
    expiresAt: newToken.expiresAt,
  };
}

// ============================================================================
// DISCOUNT CREATION LOGIC
// ============================================================================

const SHOPIFY_STORE_DOMAIN = 'battiwear.myshopify.com';
const SHOPIFY_API_VERSION = '2025-01';

async function createDiscounts(adminToken: string) {
  const adminApiUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;

  // Create Buy 2, Get 10% Off automatic discount
  const buy2Discount = `
    mutation {
      discountAutomaticBasicCreate(
        automaticBasicDiscount: {
          title: "Buy 2, Get 10% Off"
          startsAt: "${new Date().toISOString()}"
          minimumRequirement: {
            quantity: {
              greaterThanOrEqualToQuantity: "2"
            }
          }
          customerGets: {
            value: {
              percentage: 0.10
            }
            items: {
              all: true
            }
          }
        }
      ) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBasic {
              title
              startsAt
              status
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const buy2Response = await fetch(adminApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query: buy2Discount }),
  });

  const buy2Data = await buy2Response.json();
  console.log('Buy 2 discount result:', JSON.stringify(buy2Data, null, 2));

  // Create Buy 3+, Get 15% Off automatic discount
  const buy3Discount = `
    mutation {
      discountAutomaticBasicCreate(
        automaticBasicDiscount: {
          title: "Buy 3+, Get 15% Off"
          startsAt: "${new Date().toISOString()}"
          minimumRequirement: {
            quantity: {
              greaterThanOrEqualToQuantity: "3"
            }
          }
          customerGets: {
            value: {
              percentage: 0.15
            }
            items: {
              all: true
            }
          }
        }
      ) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBasic {
              title
              startsAt
              status
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const buy3Response = await fetch(adminApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query: buy3Discount }),
  });

  const buy3Data = await buy3Response.json();
  console.log('Buy 3+ discount result:', JSON.stringify(buy3Data, null, 2));

  // Create Free Shipping discount for orders $120+
  const freeShippingMutation = `
    mutation {
      discountAutomaticFreeShippingCreate(
        freeShippingAutomaticDiscount: {
          title: "Free Shipping on Orders $120+"
          startsAt: "${new Date().toISOString()}"
          minimumRequirement: {
            subtotal: {
              greaterThanOrEqualToSubtotal: "120.00"
            }
          }
          destination: {
            all: true
          }
        }
      ) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticFreeShipping {
              title
              startsAt
              status
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const freeShippingResponse = await fetch(adminApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminToken,
    },
    body: JSON.stringify({ query: freeShippingMutation }),
  });

  const freeShippingData = await freeShippingResponse.json();
  console.log('Free shipping discount result:', JSON.stringify(freeShippingData, null, 2));

  return {
    buy2Discount: buy2Data,
    buy3Discount: buy3Data,
    freeShippingDiscount: freeShippingData,
  };
}

// ============================================================================
// MAIN REQUEST HANDLER
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Support action from query param OR POST body
    let action = url.searchParams.get('action');
    let shopDomain = url.searchParams.get('shop') || SHOPIFY_STORE_DOMAIN;
    
    if (!action && req.method === 'POST') {
      try {
        const body = await req.json();
        action = body.action || 'discounts';
        shopDomain = body.shop || shopDomain;
      } catch {
        action = 'discounts';
      }
    }
    action = action || 'discounts';

    // Health check is allowed without authentication
    if (action !== 'health') {
      // For get-token, require service role key (strict check)
      if (action === 'get-token') {
        const authHeader = req.headers.get('Authorization');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
          console.warn('[oauth] get-token called without valid service role auth');
          return new Response(
            JSON.stringify({ error: 'Service role authorization required' }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        // For discounts and other actions, require authenticated user
        const auth = await verifyAuth(req);
        if (!auth) {
          return new Response(
            JSON.stringify({ error: 'Authentication required' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log(`[auth] Authenticated user: ${auth.user.email || auth.user.id}`);
      }
    }

    // ========================================================================
    // ACTION: health - Token health check (no secrets returned)
    // ========================================================================
    if (action === 'health') {
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
        console.error('[oauth] Health check failed:', error);
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

    // ========================================================================
    // ACTION: get-token - Internal token retrieval (for other edge functions)
    // Already protected by service role check above
    // ========================================================================
    if (action === 'get-token') {      
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

    // ========================================================================
    // ACTION: discounts (default) - Create discounts using OAuth token
    // ========================================================================
    if (action === 'discounts') {
      // First, try to get OAuth token
      let adminToken: string;
      
      try {
        const tokenResult = await getAdminAccessToken(shopDomain);
        adminToken = tokenResult.token;
        console.log('[discounts] Using OAuth token');
      } catch (oauthError) {
        // Fall back to legacy tokens if OAuth fails
        console.warn('[discounts] OAuth failed, trying legacy tokens:', oauthError);
        adminToken = Deno.env.get('SHOPIFY_ADMIN_API_TOKEN') || Deno.env.get('SHOPIFY_ACCESS_TOKEN') || '';
        if (!adminToken) {
          throw new Error('No Shopify admin token available (OAuth failed and no legacy token)');
        }
        console.log('[discounts] Using legacy token');
      }
      
      console.log('Using token starting with:', adminToken.substring(0, 10) + '...');

      const results = await createDiscounts(adminToken);

      return new Response(
        JSON.stringify({
          success: true,
          ...results,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use ?action=health, ?action=get-token, or ?action=discounts' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
