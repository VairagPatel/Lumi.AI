import { useState } from "react";
import { Sparkles } from "lucide-react";

const PromptBot = ({ onSuggest }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const fetchSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/v1/prompt/suggest");
      if (!res.ok) {
        throw new Error("Failed to fetch prompt");
      }
      const text = await res.text();
      setSuggestion(text);
      onSuggest(text); // ✅ Send suggestion to parent
    } catch (err) {
      console.error("Error fetching prompt:", err);
      setError("⚠️ Could not fetch a suggestion. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={fetchSuggestion}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                   bg-[#3FE3D8] text-[#0D1B2A] text-sm font-semibold 
                   hover:bg-[#00E5A0] transition disabled:opacity-60 mx-auto"
      >
        <Sparkles size={16} className="text-[#0D1B2A]" />
        {loading ? "Thinking..." : "Generate Prompt with LumiAI Bot"}
      </button>

      {suggestion && (
        <p className="mt-3 text-sm font-medium text-[#374151]">
          💡 {suggestion}
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default PromptBot;
