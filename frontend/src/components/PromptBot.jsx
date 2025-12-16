import { useState } from "react";
import { Sparkles } from "lucide-react";
import { usePromptSuggestion } from "../hooks/usePrompt";

const PromptBot = ({ onSuggest }) => {
  const [suggestion, setSuggestion] = useState(null);
  const { refetch, isFetching } = usePromptSuggestion();

  const fetchSuggestion = async () => {
    try {
      const { data } = await refetch();
      const promptText = data;
      setSuggestion(promptText);
      onSuggest(promptText);
    } catch (err) {
      console.error("Error fetching prompt:", err);
    }
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={fetchSuggestion}
        disabled={isFetching}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl 
                   bg-gradient-to-r from-indigo-500 to-purple-500 text-black text-sm font-semibold 
                   hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg 
                   hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mx-auto"
      >
        <Sparkles size={16} className={isFetching ? "animate-spin" : ""} />
        {isFetching ? "Thinking..." : "✨ Get AI Suggestion"}
      </button>

      {suggestion && (
        <p className="mt-3 text-sm font-medium text-black">
          💡 {suggestion}
        </p>
      )}
    </div>
  );
};

export default PromptBot;
