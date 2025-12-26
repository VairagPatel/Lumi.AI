import Spinner from "./Spinner.jsx";
import UploadIcon from "./UploadIcon.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import PromptBot from "./PromptBot.jsx";
import { useEffect, useRef, useState } from "react";
import { Download, PlusCircle } from "lucide-react";
import { useImageToImage } from "../hooks/useGeneration.js";

/* ---------- Component ---------- */

const PhotoToImageSection = ({ onGenerate }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [recentImages, setRecentImages] = useState([]);
  const fileInputRef = useRef(null);

  const imageToImageMutation = useImageToImage();
  const isLoading = imageToImageMutation.isPending;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("lumiai-previews")) || [];
    setRecentImages(saved);
  }, []);

  const isCreateDisabled = isLoading || !uploadedFile;

  const onBrowseClick = () => fileInputRef.current.click();

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setGeneratedImage(null);
      setError(null);
    } else {
      setError("Please upload a valid image file.");
      setUploadedImage(null);
      setUploadedFile(null);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile) {
      setError("Please upload an image first!");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("image", uploadedFile);
    formData.append("prompt", prompt || "Transform this image into a beautiful Ghibli-style artwork");

    console.log("Generating image with:", {
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type,
      prompt: prompt || "Transform this image into a beautiful Ghibli-style artwork"
    });

    try {
      const response = await imageToImageMutation.mutateAsync(formData);
      
      // Response is a blob
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      setGeneratedImage(url);
      saveRecent(url);
      
      console.log("Image generation successful, blob size:", blob.size);
      
      // Notify parent component
      if (onGenerate) {
        onGenerate();
      }
    } catch (err) {
      console.error("Error generating image:", err);
      const errorMessage = err.response?.data?.message || err.message || "Image generation failed";
      setError(errorMessage);
    }
  };

  const saveRecent = (url) => {
    const newPreview = { url, timestamp: Date.now() };
    const updated = [newPreview, ...recentImages].slice(0, 3);
    setRecentImages(updated);
    localStorage.setItem("lumiai-previews", JSON.stringify(updated));
  };

  // Download with format conversion
  const handleDownload = async (customUrl = null, format = downloadFormat) => {
    const imgSrc = customUrl || generatedImage;
    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const mimeType =
        format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";

      const link = document.createElement("a");
      link.href = canvas.toDataURL(mimeType, 1.0);
      link.download = `lumiai-art-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  const handleCreateAnother = () => {
    setUploadedFile(null);
    setUploadedImage(null);
    setGeneratedImage(null);
    setPrompt("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {/* Upload Section */}
      <div className="bg-[#F9FAFA] p-8 rounded-2xl shadow-md flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-[#0D1B2A]">
          Transform Your Photo
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Upload your photo and watch LumiAI transform it into a beautiful Ghibli-style artwork while preserving the original composition and elements.
        </p>

        {/* Upload Box */}
        <div
          className={`flex-grow border-2 border-dashed rounded-xl flex flex-col justify-center items-center text-center p-6 transition-colors ${
            isDragging
              ? "border-[#00C4CC] bg-[#00E5A0]/10"
              : "border-[#00E5A0] hover:bg-[#00E5A0]/5"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileChange(e.dataTransfer.files[0]);
          }}
        >
          {uploadedImage ? (
            <img
              src={uploadedImage}
              alt="Uploaded preview"
              className="max-h-80 w-auto rounded-lg object-contain"
            />
          ) : (
            <div>
              <UploadIcon />
              <p className="text-[#0D1B2A]/70 mt-2">Drag & drop your image here</p>
              <p className="text-[#0D1B2A]/50 text-sm my-2">or</p>
              <button
                onClick={onBrowseClick}
                className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white hover:scale-105 transition"
              >
                Browse Files
              </button>
              <input
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files[0])}
                type="file"
                className="hidden"
                accept="image/*"
              />
            </div>
          )}
        </div>

        {/* Prompt + Bot + Generate */}
        {!generatedImage && (
          <>
            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="prompt-photo"
                  className="text-md font-semibold mb-2 block text-black"
                >
                  Transformation Details (Optional)
                </label>
                <textarea
                  id="prompt-photo"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00E5A0] text-black"
                  rows="2"
                  placeholder="Describe how you want to transform your image (e.g., 'make it more colorful', 'add magical elements', 'sunset lighting')..."
                />
                <PromptBot onSuggest={(text) => setPrompt(text)} />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isCreateDisabled}
              className="mt-6 w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] hover:scale-105 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Transforming Your Photo..." : "Transform Photo to Art"}
            </button>
          </>
        )}

        {/* After Generation */}
        {generatedImage && (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[#0D1B2A]">
                Download as:
              </label>
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00E5A0]"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleDownload()}
                className="flex-1 py-3 px-6 rounded-lg font-semibold bg-[#F3F4F6] text-[#0D1B2A] hover:bg-[#E5E7EB] transition flex items-center justify-center gap-2"
              >
                <Download size={20} /> Download
              </button>
              <button
                onClick={handleCreateAnother}
                className="flex-1 py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <PlusCircle size={20} /> Create Another
              </button>
            </div>
          </div>
        )}


      </div>

      {/* Result Section */}
      <div className="bg-[#F9FAFA] p-8 rounded-2xl shadow-md flex flex-col justify-center items-center">
        <div className="w-full h-full flex justify-center items-center border-2 border-dashed border-[#00E5A0]/40 rounded-xl bg-white min-h-[400px]">
          {isLoading ? (
            <Spinner />
          ) : generatedImage ? (
            <img
              src={generatedImage}
              alt="Final LumiAI art"
              className="max-h-[32rem] w-auto rounded-lg object-contain"
            />
          ) : (
            <p className="text-center text-[#0D1B2A]/50 max-w-sm">
              Your generated LumiAI art will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoToImageSection;
