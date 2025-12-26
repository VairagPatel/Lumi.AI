import { useState } from "react";
import { ChevronDown, HelpCircle, Search, MessageCircle, Mail, Sparkles } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "What is LumiAI?",
      answer: "LumiAI is an AI-powered art generation platform that creates stunning Ghibli-inspired artwork from text descriptions or photos. It combines advanced AI technology with beautiful artistic styles to help you bring your imagination to life.",
      category: "General"
    },
    {
      question: "How do I create artwork with LumiAI?",
      answer: "Simply go to the Create page, choose between Text to Art or Photo to Art, enter your description or upload a photo, select your preferred Ghibli style, and click Generate. Your artwork will be ready in seconds!",
      category: "Getting Started"
    },
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used to generate artwork. Each image generation costs 1 credit. New users get 15 free credits to start. You can purchase more credits through our pricing plans whenever you need them.",
      category: "Credits"
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes! All images you create with LumiAI are yours to use for personal or commercial purposes. You have full rights to download, share, and use your creations however you like.",
      category: "Usage Rights"
    },
    {
      question: "What image formats are supported?",
      answer: "For Photo to Art, we support JPG, PNG, and WebP formats. Generated images are provided in high-quality PNG format, perfect for printing or digital use.",
      category: "Technical"
    },
    {
      question: "How long does it take to generate an image?",
      answer: "Most images are generated in 5-15 seconds, depending on the complexity and current server load. We're constantly working to make the process even faster!",
      category: "Performance"
    },
    {
      question: "What Ghibli styles are available?",
      answer: "We offer multiple Ghibli-inspired styles including General, Spirited Away, My Neighbor Totoro, Howl's Moving Castle, and more. Each style captures the unique aesthetic of different Studio Ghibli films.",
      category: "Styles"
    },
    {
      question: "Can I edit or regenerate images?",
      answer: "Yes! If you're not satisfied with a result, you can regenerate with different prompts or styles. Each generation uses one credit, so you have full creative freedom to experiment.",
      category: "Features"
    },
    {
      question: "Is my data and artwork private?",
      answer: "Absolutely. We take privacy seriously. Your uploaded photos and generated artwork are private and only visible to you. We don't share or use your creations without your permission.",
      category: "Privacy"
    },
    {
      question: "What if I run out of credits?",
      answer: "You can easily purchase more credits through our Pricing page. We offer flexible plans to suit different needs, from casual creators to professional artists.",
      category: "Credits"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-6 py-20 max-w-5xl relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#0D1B2A] shadow-lg mb-8">
            <HelpCircle size={16} className="text-[#00C4CC]" />
            Help Center
            <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0D1B2A] mb-6 leading-tight">
            Frequently Asked{" "}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-[#0D1B2A]/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about LumiAI. Can't find what you're looking for? We're here to help!
          </p>
        </div>

        {/* Enhanced search bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[#00C4CC]/50 focus:border-[#00C4CC] transition-all text-lg"
            />
          </div>
        </div>

        {/* Enhanced FAQ List */}
        <div className="space-y-6 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/50 transition-all duration-200"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white">
                        {faq.category}
                      </span>
                    </div>
                    <span className="font-bold text-lg text-[#0D1B2A] group-hover:text-[#00C4CC] transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-[#00C4CC] flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-8 pb-6 text-[#0D1B2A]/70 leading-relaxed border-t border-gray-100/50 pt-6 text-lg animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2">No results found</h3>
              <p className="text-gray-600">Try searching with different keywords or browse all questions above.</p>
            </div>
          )}
        </div>

        {/* Enhanced contact section */}
        <div className="text-center">
          <div className="relative bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-3xl p-16 overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Still Have Questions?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                We're here to help! Our support team is ready to assist you with any questions about LumiAI. 
                Get personalized help and expert guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:support@lumiai.com"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold bg-white text-[#0D1B2A] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                  Contact Support
                </a>
                <a
                  href="/create"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <Sparkles size={20} />
                  Try LumiAI Now
                </a>
              </div>
              
              {/* Response time indicator */}
              <div className="mt-8 flex items-center justify-center gap-2 text-white/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Average response time: 2-4 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add fadeIn animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default FAQPage;
