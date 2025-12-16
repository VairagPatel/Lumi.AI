import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import { useDebounce, animationOptimization } from "../utils/performance.jsx";

const AuthPage = () => {
  const { login, googleLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const googleBtnRef = useRef(null);

  // ✅ Initialize Google Sign-In button
  useEffect(() => {
    const initGoogleSignIn = () => {
      if (window.google && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // 🔑 from .env
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "outline",
            size: "large",
            width: 400,
          });
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
          // Hide Google button if there's an error
          if (googleBtnRef.current) {
            googleBtnRef.current.style.display = 'none';
          }
        }
      } else {
        // Retry after a delay if Google script not loaded yet
        setTimeout(initGoogleSignIn, 500);
      }
    };
    
    initGoogleSignIn();
  }, []);

  // Handle Google ID Token from One Tap / Button
  const handleGoogleResponse = async (response) => {
    try {
      const googleIdToken = response.credential;
      console.log("Google Sign-In successful, sending to backend...");
      await googleLogin(googleIdToken);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  // Form validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateUsername = (username) => {
    if (!isLogin && !username) return "Username is required";
    if (!isLogin && username && username.length < 3) return "Username must be at least 3 characters";
    return "";
  };

  // Memoize password strength calculation for performance
  const passwordStrength = useMemo(() => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Very Weak", color: "bg-red-500" },
      { strength: 2, label: "Weak", color: "bg-orange-500" },
      { strength: 3, label: "Fair", color: "bg-yellow-500" },
      { strength: 4, label: "Good", color: "bg-blue-500" },
      { strength: 5, label: "Strong", color: "bg-green-500" }
    ];

    return levels[score];
  }, [password]);

  const validateForm = () => {
    const newErrors = {};
    
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    
    if (!isLogin) {
      newErrors.username = validateUsername(username);
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  // Debounce field validation for better performance
  const debouncedValidation = useDebounce((field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case 'email':
        newErrors.email = validateEmail(value);
        break;
      case 'password':
        newErrors.password = validatePassword(value);
        break;
      case 'username':
        newErrors.username = validateUsername(value);
        break;
    }
    setErrors(newErrors);
  }, 300);

  const handleFieldBlur = useCallback((field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    debouncedValidation(field, value);
  }, [debouncedValidation]);

  // Memoize form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setTouched({ email: true, password: true, username: true });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await authAPI.signup({ 
          username: username || email.split('@')[0], 
          email, 
          password,
          fullName: fullName || undefined
        });
        toast.success("Signup successful! Please login.");
        setIsLogin(true);
        setPassword("");
        setErrors({});
        setTouched({});
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || (isLogin ? "Login failed" : "Signup failed");
      toast.error(errorMessage);
      
      // Set server errors
      if (err.response?.data?.field) {
        setErrors(prev => ({
          ...prev,
          [err.response.data.field]: err.response.data.message
        }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLogin, email, password, username, fullName, login, validateForm]);

  // Memoize toggle handler
  const handleToggleMode = useCallback(() => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setPassword("");
  }, [isLogin]);

  // Memoize password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  // Optimize animations based on user preferences
  const optimizedVariants = useMemo(() => {
    return animationOptimization.getOptimizedVariants({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100" role="main">
      {/* Enhanced floating background elements */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-[#00E5A0]/30 to-[#00C4CC]/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-[#00C4CC]/25 to-[#00E5A0]/15 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 blur-2xl animate-[pulse_6s_ease-in-out_infinite]" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Top gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#00E5A0]/10 via-transparent to-transparent" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Enhanced title section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 px-4 py-2 text-sm font-semibold text-[#0D1B2A] backdrop-blur-sm"
            >
              <Sparkles size={16} className="text-[#00C4CC]" />
              Welcome to LumiAI
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.h1
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-[#0D1B2A]"
              >
                {isLogin ? "Welcome Back" : "Join LumiAI"}
              </motion.h1>
            </AnimatePresence>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-3 text-lg text-[#0D1B2A]/70 font-medium"
            >
              {isLogin 
                ? "Sign in to continue your creative journey" 
                : "Create your account and start generating amazing art"
              }
            </motion.p>
          </motion.div>

          {/* Enhanced card */}
          <Card className="relative p-8 backdrop-blur-xl bg-white/90 border-white/20 shadow-2xl">
            {/* Enhanced corner glow effects */}
            <div className="pointer-events-none absolute -z-10 -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#00C4CC]/30 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -z-10 -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-tr from-[#00E5A0]/30 to-transparent blur-2xl" />

            <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label={isLogin ? "Sign in form" : "Sign up form"}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={(e) => handleFieldBlur('username', e.target.value)}
                        className={`pl-11 ${errors.username && touched.username ? 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]' : ''}`}
                        placeholder="Choose a username"
                        error={touched.username ? errors.username : ""}
                        aria-label="Username"
                        aria-required="true"
                        aria-invalid={errors.username && touched.username ? 'true' : 'false'}
                        aria-describedby={errors.username && touched.username ? 'username-error' : undefined}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => handleFieldBlur('email', e.target.value)}
                  className={`pl-11 ${errors.email && touched.email ? 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]' : ''}`}
                  placeholder="Enter your email"
                  error={touched.email ? errors.email : ""}
                  aria-label="Email address"
                  aria-required="true"
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                  autoComplete="email"
                />
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-11"
                        placeholder="Full name (optional)"
                        aria-label="Full name (optional)"
                        autoComplete="name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={(e) => handleFieldBlur('password', e.target.value)}
                    className={`pl-11 pr-11 ${errors.password && touched.password ? 'border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]' : ''}`}
                    placeholder="Enter your password"
                    error={touched.password ? errors.password : ""}
                    aria-label="Password"
                    aria-required="true"
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    aria-describedby={errors.password && touched.password ? 'password-error' : (!isLogin && password ? 'password-strength' : undefined)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={0}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password strength indicator for signup */}
                {!isLogin && password && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                    id="password-strength"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuenow={passwordStrength.strength}
                        aria-valuemin={0}
                        aria-valuemax={5}
                        aria-label="Password strength"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full transition-colors ${passwordStrength.color}`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600" aria-label={`Password strength: ${passwordStrength.label}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg font-semibold relative overflow-hidden"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLogin ? "Sign In" : "Create Account"}
                </span>
                {/* Enhanced shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </Button>
            </form>

            {/* Enhanced divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Google Button */}
            <div ref={googleBtnRef} className="w-full flex justify-center" />
            
            {/* Fallback message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-xs text-gray-500 mt-4 space-y-1"
            >
              <p>Having trouble with Google Sign-In?</p>
              <p>Use email/password authentication above.</p>
            </motion.div>

            {/* Enhanced toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-600">
                {isLogin ? "New to LumiAI?" : "Already have an account?"}{" "}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleMode}
                  className="font-semibold text-[#00C4CC] hover:text-[#00E5A0] transition-colors underline-offset-2 hover:underline"
                >
                  {isLogin ? "Create an account" : "Sign in instead"}
                </motion.button>
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;