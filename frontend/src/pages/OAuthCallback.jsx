import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Extract token from query string (?token=xxx)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        // Save token in context/localStorage
        login(null, null, token); // Passing token directly (AuthContext will handle storing)
        navigate("/create"); // Redirect after login
      } catch (err) {
        console.error("OAuth login failed:", err);
        navigate("/auth"); // Back to login on error
      }
    } else {
      navigate("/auth"); // If no token, go back
    }
  }, [login, navigate]);

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <p className="text-lg font-semibold text-gray-700">
        Logging you in with Google... ✨
      </p>
    </div>
  );
};

export default OAuthCallback;
