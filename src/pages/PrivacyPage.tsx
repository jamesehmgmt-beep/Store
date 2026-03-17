import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-foreground" />
            <h1 className="text-3xl font-serif mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, sign up for our newsletter, or contact us for support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect to process transactions, send you order confirmations, respond to your comments and questions, and send you marketing communications (with your consent).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required to provide our services or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Cookies</h2>
              <p>
                We use cookies to enhance your experience on our site. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. Contact us at privacy@muslimeem.com to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at privacy@muslimeem.com.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;