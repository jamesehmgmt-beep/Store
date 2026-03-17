import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
const footerLinks = {
  information: {
    title: "Information",
    links: [{
      label: "My Account",
      href: "/account"
    }, {
      label: "Track My Order",
      href: "/track-order"
    }, {
      label: "Rewards",
      href: "/rewards"
    }, {
      label: "Delivery Information",
      href: "/delivery"
    }, {
      label: "Size Guide",
      href: "/size-guide"
    }, {
      label: "Returns",
      href: "/returns"
    }, {
      label: "Gift Cards",
      href: "/gift-cards"
    }]
  },
  about: {
    title: "About",
    links: [{
      label: "About Us",
      href: "/about"
    }, {
      label: "Careers",
      href: "/careers"
    }, {
      label: "Sustainability",
      href: "/sustainability"
    }, {
      label: "Social",
      href: "/social"
    }, {
      label: "Press",
      href: "/press"
    }, {
      label: "Stores",
      href: "/stores"
    }]
  },
  help: {
    title: "FAQs",
    links: [{
      label: "Track My Order",
      href: "/track-order"
    }, {
      label: "Our Team",
      href: "/team"
    }, {
      label: "Privacy Policy",
      href: "/privacy"
    }, {
      label: "Returns",
      href: "/returns"
    }, {
      label: "Delivery Info",
      href: "/delivery"
    }, {
      label: "Contact Us",
      href: "/contact"
    }]
  }
};
export const Footer = () => {
  return <footer className="bg-foreground text-background">
      {/* Social follow section */}
      <div className="py-8 border-b border-background/20">
        <p className="text-center text-xs tracking-widest uppercase mb-4">FOLLOW US ON INSTAGRAM @MUSLIMEEMAPPAREL</p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Main footer content */}
      <div className="section-padding py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Link columns */}
          {Object.values(footerLinks).map((section, index) => <div key={index}>
              <h3 className="font-serif text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => <li key={linkIndex}>
                    <Link to={link.href} className="text-xs text-background/70 hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  </li>)}
              </ul>
            </div>)}

          {/* Newsletter signup */}
          <div>
            <h3 className="font-serif text-sm mb-4">Newsletter</h3>
            <p className="text-xs text-background/70 mb-4">
              Be the first to hear about new arrivals, offers, and more. Sign up to get early access.
            </p>
            <form className="space-y-3">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 bg-transparent border border-background/30 text-sm placeholder:text-background/50 focus:outline-none focus:border-background" />
              <button type="submit" className="w-full py-3 bg-background text-foreground text-xs tracking-widest uppercase hover:bg-background/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      
    </footer>;
};