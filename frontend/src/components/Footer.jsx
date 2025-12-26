import { Heart, Mail, Twitter, Github, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0D1B2A] via-[#1E293B] to-[#0F172A] text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5A0] via-[#00D4AA] to-[#00C4CC] text-white grid place-items-center font-black shadow-lg">
                  <span className="text-xl">L</span>
                </div>
                <span className="pointer-events-none absolute inset-0 rounded-2xl blur-xl bg-gradient-to-br from-[#00E5A0]/30 to-[#00C4CC]/30 -z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                  LumiAI
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  AI Art Studio
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Transform your imagination into stunning Ghibli-inspired artwork with the power of AI. 
              Create magical art in seconds, not hours.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4 text-[#00E5A0]" />
              <span>Trusted by 15,000+ creators worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Create Art
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@lumiai.com" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="mailto:contact@lumiai.com" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-[#00E5A0] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© 2024 LumiAI. Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>by Vairag</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="mailto:vairag@lumiai.com" 
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-[#00E5A0] transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/lumiai" 
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-[#00E5A0] transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/lumiai" 
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-[#00E5A0] transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
