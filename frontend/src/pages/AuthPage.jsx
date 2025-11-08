import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Sparkles } from "lucide-react";

const AuthPage = () => {
  const { login, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const googleBtnRef = useRef(null);

  // ✅ Initialize Google Sign-In button
  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // 🔑 from .env
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  // ✅ Handle Google ID Token from One Tap / Button
  const handleGoogleResponse = async (response) => {
    try {
      const googleIdToken = response.credential;
      const res = await fetch("http://localhost:8080/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleIdToken }),
      });
      if (!res.ok) throw new Error("Google login failed");
      const data = await res.json();
      login(null, null, data.token); // reuse existing flow
      alert(`✅ Logged in with Google as ${data.email}`);
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed");
    }
  };

  // ✅ Email/password form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });
        if (!res.ok) throw new Error("Signup failed");
        alert("Signup successful! Please login.");
        setIsLogin(true);
      } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div className="relative min-h-[85vh] overflow-hidden">
      {/* Floating mint blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#00E5A0]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#00C4CC]/20 blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />

      {/* Top gradient header band */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#00E5A0]/15 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-6 pt-12">
        {/* Title block */}
        <div className="text-center mb-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
            <Sparkles size={14} className="text-[#00C4CC]" />
            Welcome to LumiAI
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-[#0D1B2A]">
            {isLogin ? "Login to LumiAI" : "Create your LumiAI Account"}
          </h1>
          <p className="mt-2 text-[#0D1B2A]/70">
            Continue with email or sign in securely with Google.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto max-w-md">
          <div className="relative rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-xl p-6 md:p-8 transition hover:shadow-2xl">
            {/* subtle corner glow */}
            <span className="pointer-events-none absolute -z-10 -right-6 -bottom-6 h-28 w-28 rounded-full bg-[#00C4CC]/20 blur-2xl" />

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="group">
                <label className="block text-sm font-medium text-[#0D1B2A]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#0D1B2A] outline-none ring-0 transition
                             focus:border-transparent focus:shadow-[0_0_0_3px_rgba(0,229,160,0.35)]"
                  required
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-sm font-medium text-[#0D1B2A]">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#0D1B2A] outline-none ring-0 transition
                             focus:border-transparent focus:shadow-[0_0_0_3px_rgba(0,229,160,0.35)]"
                  required
                  placeholder="••••••••"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="relative w-full rounded-xl bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] py-3 font-bold text-white shadow-md
                           transition hover:shadow-lg active:scale-[0.98]"
              >
                {isLogin ? "Login" : "Sign Up"}
                {/* shimmer */}
                <span className="pointer-events-none absolute inset-0 rounded-xl [mask-image:linear-gradient(60deg,transparent,black,transparent)] 
                                 bg-white/20 -translate-x-1/2 blur-[2px] animate-[shimmer_2.2s_infinite]" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px w-full bg-gray-200" />
              <span className="text-xs text-gray-500">or</span>
              <span className="h-px w-full bg-gray-200" />
            </div>

            {/* Google Button */}
            <div ref={googleBtnRef} className="w-full flex justify-center" />

            {/* Toggle */}
            <p className="mt-6 text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#00C4CC] font-semibold hover:underline underline-offset-2"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#00C4CC] font-semibold hover:underline underline-offset-2"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-60%); opacity: .0; }
          40% { opacity: .7; }
          100% { transform: translateX(160%); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: .7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
