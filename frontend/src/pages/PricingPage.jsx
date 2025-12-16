import { CheckCircle, Sparkles } from "lucide-react";
import { useCreateOrder, useVerifyPayment } from "../hooks/usePayment";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const plans = [
  { name: "Starter", price: 10, tokens: 100, highlight: false },
  { name: "Pro", price: 50, tokens: 200, highlight: true },
  { name: "Premium", price: 100, tokens: 500, highlight: false },
  { name: "Ultimate", price: 200, tokens: 1000, highlight: false },
];

const PricingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBuyCredits = async (plan) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase credits");
      navigate("/auth");
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await createOrderMutation.mutateAsync({
        creditsAmount: plan.tokens,
        amount: plan.price,
      });

      const orderData = orderResponse.data.data;

      // Razorpay options
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency,
        name: "LumiAI",
        description: `Purchase ${plan.tokens} credits`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            
            // Redirect to profile to see updated credits
            navigate("/profile");
          } catch (error) {
            console.error("Payment verification failed:", error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#00E5A0",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        setIsProcessing(false);
        toast.error("Payment failed: " + response.error.description);
      });

    } catch (error) {
      setIsProcessing(false);
      console.error("Error creating order:", error);
    }
  };
  
  return (
    <section className="relative min-h-screen bg-[#F9FAFB]">
      {/* top gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-48 bg-gradient-to-b from-[#00E5A0]/15 to-transparent" />

      <div className="container mx-auto px-6 pt-14 pb-20">
        {/* Header */}
        <header className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
            <Sparkles size={14} className="text-[#00C4CC]" />
            Credits, Simple & Transparent
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
            Simple Pricing
          </h2>
          <p className="mt-3 text-gray-600">
            Pick a pack and start generating magical LumiAI art. No hidden fees.
          </p>
        </header>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative group rounded-3xl border shadow-md bg-white p-6 transition
                hover:-translate-y-1 hover:shadow-xl
                ${plan.highlight ? "border-[#00C4CC]" : "border-gray-200"}`}
            >
              {/* highlight ribbon */}
              {plan.highlight && (
                <span className="absolute -top-3 right-5 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow">
                  Best Value
                </span>
              )}

              {/* header */}
              <div className="mb-5">
                <h3 className="text-xl font-bold text-[#0D1B2A]">{plan.name}</h3>
                <div className="mt-2 flex items-end gap-1">
                  <p className="text-4xl font-extrabold text-[#00C4CC]">
                    ₹{plan.price}
                  </p>
                  <span className="text-gray-500 mb-1 text-sm">/ pack</span>
                </div>

                {/* token chip */}
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
                  {plan.tokens} credits
                </div>
              </div>

              {/* features */}
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Access to Text → Image
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Photo → Art Transform
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Save & Download Art
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle size={18} className="text-[#00E5A0]" />
                  Priority Generation (Pro+)
                </li>
              </ul>

              {/* CTA */}
              <div className="mt-6">
                <button
                  className={`w-full rounded-xl py-3 font-semibold transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlight
                      ? "text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-md hover:shadow-lg"
                      : "bg-[#F3F4F6] text-[#0D1B2A] hover:bg-[#E5E7EB]"
                  }`}
                  onClick={() => handleBuyCredits(plan)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Buy Now"}
                </button>
              </div>

              {/* soft hover glow */}
              <span className="pointer-events-none absolute -z-10 -right-6 -bottom-6 h-28 w-28 rounded-full bg-[#00C4CC]/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            </article>
          ))}
        </div>

        {/* tiny reassurance */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Prices are one-time packs. Credits don't expire.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            🔒 Secure payment powered by Razorpay (Test Mode)
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
