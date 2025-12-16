import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA] py-6">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center">
          <p className="text-[#0D1B2A] text-sm font-medium flex items-center gap-2">
            Made with 
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            by Vairag
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
