// src/components/ImageDropzone.jsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImageFile } from '../utils/imageUtils';
import toast from 'react-hot-toast';

const ImageDropzone = ({ onImageSelect, selectedImage, onRemove }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      validateImageFile(file);
      onImageSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-2xl border-2 border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={handleRemove}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={18} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-300
              ${isDragActive 
                ? 'border-[#00E5A0] bg-[#00E5A0]/10 scale-[1.02]' 
                : 'border-gray-300 dark:border-gray-600 hover:border-[#00E5A0] hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-gradient-to-br from-[#00E5A0]/20 to-[#00C4CC]/20 rounded-full">
                {isDragActive ? (
                  <ImageIcon size={40} className="text-[#00E5A0]" />
                ) : (
                  <Upload size={40} className="text-gray-400" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse (JPEG, PNG, WebP • Max 20MB)
                </p>
              </div>
            </motion.div>

            {/* Animated border glow */}
            {isDragActive && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(90deg, #00E5A0, #00C4CC, #00E5A0)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageDropzone;
