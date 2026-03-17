import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

const AccountPage = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setFirstName(data.first_name || "");
      setLastName(data.last_name || "");
      setPhone(data.phone || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      setProfile({ first_name: firstName, last_name: lastName, phone });
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-serif mb-2">My Account</h1>
          <p className="text-muted-foreground mb-8">
            Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}!
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              <Link to="/account" className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-foreground text-left">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <Link to="/account/orders" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Orders</span>
              </Link>
              <Link to="/account/wishlist" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Wishlist</span>
              </Link>
              <Link to="/account/settings" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm underline hover:no-underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-border bg-muted text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFirstName(profile?.first_name || "");
                          setLastName(profile?.last_name || "");
                          setPhone(profile?.phone || "");
                        }}
                        className="px-6 py-3 border border-foreground text-foreground text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">First Name</p>
                        <p className="font-medium">{profile?.first_name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Name</p>
                        <p className="font-medium">{profile?.last_name || "Not set"}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile?.phone || "Not set"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountPage;
