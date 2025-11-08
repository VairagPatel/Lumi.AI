import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, onClose }) => (
  <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-50 border border-red-300 text-red-700 px-5 py-3 rounded-xl shadow-md z-50 flex items-center space-x-3 animate-fade-in">
    {/* Icon */}
    <AlertCircle className="text-red-500 w-5 h-5" />

    {/* Message */}
    <span className="block sm:inline text-sm font-medium">{message}</span>

    {/* Close Button */}
    <button
      onClick={onClose}
      className="ml-3 text-red-500 hover:text-red-700 font-bold"
    >
      &times;
    </button>
  </div>
);

export default ErrorMessage;
