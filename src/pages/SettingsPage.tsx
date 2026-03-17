import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { User, Package, Heart, Settings, LogOut, Bell, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully");
        setPasswordDialogOpen(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
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
          <h1 className="text-3xl font-serif mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account preferences</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-2">
              <Link to="/account" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 text-foreground text-left transition-colors">
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
              <Link to="/account/settings" className="w-full flex items-center gap-3 px-4 py-3 bg-secondary text-foreground text-left">
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
            <div className="md:col-span-2 space-y-6">
              {/* Notifications */}
              <div className="border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">Order Updates</p>
                      <p className="text-sm text-muted-foreground">Receive notifications about your orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-5 h-5"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotions and special offers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                      className="w-5 h-5"
                    />
                  </label>
                </div>
              </div>

              {/* Security */}
              <div className="border border-border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5" />
                  <h2 className="text-xl font-medium">Security</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => setPasswordDialogOpen(true)}
                    className="text-sm underline hover:no-underline"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-foreground text-background text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="w-full"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SettingsPage;
