import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "ok" | "err" | null
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setStatus(null);

      // If you later add a backend endpoint, uncomment and adjust:
      // await fetch("http://localhost:8080/api/v1/newsletter/subscribe", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      // Simulate success UX:
      await new Promise((r) => setTimeout(r, 600));
      setStatus("ok");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative overflow-hidden text-[#F9FAFB] bg-[#0D1B2A]">
      {/* Floating gradient blobs (animated but subtle) */}
      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#00E5A0]/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#00C4CC]/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />

      {/* Divider Glow */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00E5A0]/40 to-transparent" />

      <div className="relative container mx-auto px-6 py-10">
        {/* Top row: brand + quick columns + legal + subscribe (4 cols on md, 5 with subscribe on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-3">
              <div className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg mr-2 shadow-md transform transition-transform hover:scale-110 hover:rotate-6">
                L
              </div>
              <h3 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                LumiAI
              </h3>
            </div>
            <p className="text-sm text-[#F3F4F6]/70 leading-relaxed">
              Generate magical AI artwork with calming, Ghibli-inspired vibes. Your imagination, brought to life ✨
            </p>
          </div>

          {/* Links */}
          <FooterColumn title="Links">
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/create">Create</FooterLink>
            <FooterLink to="/features">Features</FooterLink>
            <FooterLink to="/gallery">Gallery</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
          </FooterColumn>

          {/* Features */}
          <FooterColumn title="Features">
            <PlainLink>Photo to Art</PlainLink>
            <PlainLink>Text to Art</PlainLink>
            <PlainLink>Character Generator</PlainLink>
            <PlainLink>Background Generator</PlainLink>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal">
            <PlainLink>Terms of Service</PlainLink>
            <PlainLink>Privacy Policy</PlainLink>
          </FooterColumn>

          {/* Subscribe (shows on lg up; stacks below on smaller) */}
          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="font-semibold mb-3 text-white">Subscribe</h4>
            <p className="text-xs text-[#F3F4F6]/70 mb-3">
              Get tips, updates & new styles. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubscribe} className="group relative">
              <div className="relative flex items-stretch rounded-xl overflow-hidden border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-[#00C4CC]/40">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                  className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-[#F3F4F6]/50 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 px-3 py-2 text-sm font-semibold rounded-l-none bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Joining…" : "Join"}
                </button>
              </div>

              {/* tiny status chip */}
              {status === "ok" && (
                <div className="mt-2 text-xs text-[#00E5A0]">🎉 Subscribed! Check your inbox.</div>
              )}
              {status === "err" && (
                <div className="mt-2 text-xs text-red-300">⚠️ Something went wrong. Try again.</div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#F3F4F6]/70">
          <p>© {new Date().getFullYear()} LumiAI. All rights reserved.</p>

          <div className="flex gap-3">
            <IconButton ariaLabel="Twitter" href="#">
              <Twitter size={18} />
            </IconButton>
            <IconButton ariaLabel="Instagram" href="#">
              <Instagram size={18} />
            </IconButton>
            <IconButton ariaLabel="Facebook" href="#">
              <Facebook size={18} />
            </IconButton>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ---------- Helpers ---------- */
const FooterColumn = ({ title, children }) => (
  <div>
    <h4 className="font-semibold mb-3 text-white">{title}</h4>
    <ul className="space-y-2">{children}</ul>
  </div>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="group inline-block text-[#F3F4F6]/70 hover:text-white transition-colors"
    >
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  </li>
);

const PlainLink = ({ children }) => (
  <li className="group inline-block text-[#F3F4F6]/70 hover:text-white transition-colors cursor-pointer">
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] transition-all duration-300 group-hover:w-full" />
    </span>
  </li>
);

const IconButton = ({ href, ariaLabel, children }) => (
  <a
    href={href}
    aria-label={ariaLabel}
    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg白/10 border border-white/10 hover:border-white/20 transition-all hover:scale-110 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00C4CC]/40"
  >
    {children}
  </a>
);

export default Footer;
