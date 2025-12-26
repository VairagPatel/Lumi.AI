import { useState } from "react";
import ErrorMessage from "./ErrorMessage.jsx";
import Spinner from "./Spinner.jsx";
import { Download, FileText, PlusCircle } from "lucide-react";
import GhibliStyleDropdown from "./GhibliStyleDropdown.jsx";
import PromptBot from "./PromptBot.jsx";
import { useTextToImage } from "../hooks/useGeneration.js";

/* ---------- Component ---------- */

const TextToImageSection = ({ onGenerate }) => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("general");
  const [error, setError] = useState(null);

  const textToImageMutation = useTextToImage();
  const isLoading = textToImageMutation.isPending;
  const isCreateDisabled = isLoading || !prompt.trim();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your artwork.");
      return;
    }

    setError(null);

    try {
      // Additional validation before API call
      const requestData = { 
        prompt: prompt.trim(), 
        style: style || "general" 
      };
      
      console.log("Sending request data:", requestData);
      
      if (!requestData.prompt) {
        setError("Please enter a description for your artwork.");
        return;
      }
      
      const response = await textToImageMutation.mutateAsync(requestData);
      
      // Response is a blob
      const blob = response.data;
      const imageUrl = URL.createObjectURL(blob);
      setGeneratedImage(imageUrl);
      
      // Notify parent component
      if (onGenerate) {
        onGenerate();
      }
    } catch (err) {
      console.error("Error generating image from text:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to generate image";
      setError(errorMessage);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `lumiai-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateAnother = () => {
    setGeneratedImage(null);
    setPrompt("");
    setStyle("general");
    setError(null);
  };

  return (
    <div className="relative">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      <div className="bg-[#FAFAFA] p-8 rounded-2xl shadow-md flex flex-col max-w-4xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-[#374151]">
          Text to LumiAI Art
        </h2>

        {/* Preview Box */}
        <div className="w-full h-80 flex justify-center items-center border-2 border-dashed border-[#3FE3D8] rounded-xl bg-white mb-6">
          {isLoading ? (
            <Spinner />
          ) : generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated LumiAI art"
              className="h-full w-full rounded-lg object-contain p-2"
            />
          ) : (
            <div className="text-center text-[#374151]/50">
              <FileText size={48} className="mx-auto text-[#374151]/30 mb-4" />
              <p>Describe your scene and generate stunning LumiAI artwork</p>
            </div>
          )}
        </div>

        {/* Input + AI Suggestion + Generate Button */}
        {!generatedImage && (
          <>
            <div className="space-y-4">
              <GhibliStyleDropdown
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />

              <div>
                <label
                  htmlFor="prompt-text"
                  className="text-md font-semibold mb-2 block text-[#0D1B2A]"
                >
                  Your Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  id="prompt-text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0] text-[#0D1B2A] placeholder:text-gray-500"
                  rows="3"
                  placeholder="Describe the magical scene you want LumiAI to create..."
                />

                {/* 🔹 AI Suggestion Button */}
                <PromptBot onSuggest={(text) => setPrompt(text)} />
              </div>

              {/* 🔹 Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isCreateDisabled}
                className={`w-full py-3 px-6 rounded-lg font-bold text-white transition 
                  ${
                    isCreateDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#00E5A0] hover:bg-[#3FE3D8]"
                  }`}
              >
                {isLoading ? "Generating..." : "Generate with LumiAI"}
              </button>
            </div>
          </>
        )}

        {/* Actions After Generation */}
        {generatedImage && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] transition flex items-center justify-center gap-2"
            >
              <Download size={20} /> Download
            </button>
            <button
              onClick={handleCreateAnother}
              className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-[#00E5A0] hover:bg-[#3FE3D8] transition flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} /> Create Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImageSection;
