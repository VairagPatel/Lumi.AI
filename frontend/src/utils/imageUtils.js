// src/utils/imageUtils.js

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadImage = (blob, filename = 'lumi-ai-generated.png') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 20MB limit');
  }

  return true;
};
