import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is LumiAI?",
      answer: "LumiAI is an AI-powered art generation platform that creates stunning Ghibli-inspired artwork from text descriptions or photos. It combines advanced AI technology with beautiful artistic styles to help you bring your imagination to life."
    },
    {
      question: "How do I create artwork with LumiAI?",
      answer: "Simply go to the Create page, choose between Text to Art or Photo to Art, enter your description or upload a photo, select your preferred Ghibli style, and click Generate. Your artwork will be ready in seconds!"
    },
    {
      question: "What are credits and how do they work?",
      answer: "Credits are used to generate artwork. Each image generation costs 1 credit. New users get 15 free credits to start. You can purchase more credits through our pricing plans whenever you need them."
    },
    {
      question: "Can I use the generated images commercially?",
      answer: "Yes! All images you create with LumiAI are yours to use for personal or commercial purposes. You have full rights to download, share, and use your creations however you like."
    },
    {
      question: "What image formats are supported?",
      answer: "For Photo to Art, we support JPG, PNG, and WebP formats. Generated images are provided in high-quality PNG format, perfect for printing or digital use."
    },
    {
      question: "How long does it take to generate an image?",
      answer: "Most images are generated in 5-15 seconds, depending on the complexity and current server load. We're constantly working to make the process even faster!"
    },
    {
      question: "What Ghibli styles are available?",
      answer: "We offer multiple Ghibli-inspired styles including General, Spirited Away, My Neighbor Totoro, Howl's Moving Castle, and more. Each style captures the unique aesthetic of different Studio Ghibli films."
    },
    {
      question: "Can I edit or regenerate images?",
      answer: "Yes! If you're not satisfied with a result, you can regenerate with different prompts or styles. Each generation uses one credit, so you have full creative freedom to experiment."
    },
    {
      question: "Is my data and artwork private?",
      answer: "Absolutely. We take privacy seriously. Your uploaded photos and generated artwork are private and only visible to you. We don't share or use your creations without your permission."
    },
    {
      question: "What if I run out of credits?",
      answer: "You can easily purchase more credits through our Pricing page. We offer flexible plans to suit different needs, from casual creators to professional artists."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/40 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#0E7490] backdrop-blur mb-6">
            <HelpCircle size={14} className="text-[#00C4CC]" />
            Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D1B2A] mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-lg text-[#0D1B2A]/70">
            Everything you need to know about LumiAI
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0D1B2A] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-[#00C4CC] flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-[#0D1B2A]/70 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-2xl p-10 border border-[#00E5A0]/20">
          <h2 className="text-2xl font-bold text-[#0D1B2A] mb-3">
            Still have questions?
          </h2>
          <p className="text-[#0D1B2A]/70 mb-6">
            We're here to help! Reach out to our support team anytime.
          </p>
          <a
            href="mailto:support@lumiai.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
