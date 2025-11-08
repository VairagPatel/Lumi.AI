import { useState } from "react";
import ErrorMessage from "./ErrorMessage.jsx";
import Spinner from "./Spinner.jsx";
import { Download, FileText, PlusCircle } from "lucide-react";
import GhibliStyleDropdown from "./GhibliStyleDropdown.jsx";
import PromptBot from "./PromptBot.jsx";

/* ---------- Helpers ---------- */

// Converts base64 (without prefix) into Blob
const base64ToBlob = (b64, mime = "image/png") => {
  const byteChars = atob(b64);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNums);
  return new Blob([byteArray], { type: mime });
};

// API base (defaults to localhost)
const getApiBase = () => import.meta.env.VITE_API_BASE || "http://localhost:8080";

/* ---------- Component ---------- */

const TextToImageSection = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isCreateDisabled = isLoading || !prompt.trim();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description for your artwork.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = { prompt, style };

    try {
      const API_URL = `${getApiBase()}/api/v1/generate-from-text`;

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "image/png, image/jpeg, application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60_000); // 60s timeout

      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const maybeText = await response.text().catch(() => "");
        throw new Error(
          `Request failed (${response.status}). ${maybeText || "No error body"}`
        );
      }

      // Handle raw image or JSON base64
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await response.json();
        const b64 =
          json.imageBase64 || json.image || json.data || json.result || null;

        if (!b64) {
          throw new Error("Response JSON missing image data.");
        }

        const cleaned = b64.includes(",") ? b64.split(",")[1] : b64;
        const mime =
          (json.mimeType && String(json.mimeType)) ||
          (b64.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png");

        const blob = base64ToBlob(cleaned, mime);
        setGeneratedImage(URL.createObjectURL(blob));
      } else {
        const blob = await response.blob();
        setGeneratedImage(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Error generating image from text:", err);
      if (err.name === "AbortError") {
        setError("Request timed out. Try again in a moment.");
      } else if (String(err).includes("Failed to fetch")) {
        setError(
          "Failed to reach the backend. Is the API running on http://localhost:8080 and CORS enabled?"
        );
      } else {
        setError(
          err?.message ||
            "Failed to generate image. Please ensure the backend is running and check the console."
        );
      }
    } finally {
      setIsLoading(false);
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
                  className="text-md font-semibold mb-2 block text-[#374151]"
                >
                  Your Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  id="prompt-text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0]"
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
