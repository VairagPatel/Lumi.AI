import { CheckCircle, Sparkles, AlertTriangle } from "lucide-react";
import { useCreateOrder, useVerifyPayment, usePaymentStatus } from "../hooks/usePayment";
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
  const { data: paymentStatus, isLoading: statusLoading, error: statusError, refetch: refetchStatus } = usePaymentStatus();
  const [isProcessing, setIsProcessing] = useState(false);

  // Debug payment status
  useEffect(() => {
    console.log("Payment Status:", paymentStatus);
    console.log("Status Loading:", statusLoading);
    console.log("Status Error:", statusError);
  }, [paymentStatus, statusLoading, statusError]);

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

  // Retry fetching payment status if it fails
  useEffect(() => {
    if (statusError) {
      console.error("Payment status error:", statusError);
      // Retry after 3 seconds
      const timer = setTimeout(() => {
        refetchStatus();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusError, refetchStatus]);

  const handleBuyCredits = async (plan) => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase credits");
      navigate("/auth");
      return;
    }

    if (isProcessing) {
      return;
    }

    // Check payment service availability
    console.log("Checking payment availability:", paymentStatus);
    if (statusLoading) {
      toast.error("Checking payment service availability...");
      return;
    }
    
    if (statusError) {
      toast.error("Unable to verify payment service. Please try again.");
      return;
    }
    
    if (!paymentStatus?.available) {
      toast.error(paymentStatus?.message || "Payment service is currently unavailable. Please try again later.");
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
    <section className="relative min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-6 pt-20 pb-20 relative z-10">
        {/* Enhanced header */}
        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00E5A0]/30 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#0D1B2A] shadow-lg mb-8">
            <Sparkles size={16} className="text-[#00C4CC]" />
            Credits, Simple & Transparent
            <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-[#0D1B2A] mb-6 leading-tight">
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Simple Pricing
            </span>
          </h2>
          <p className="text-xl text-[#0D1B2A]/70 max-w-2xl mx-auto leading-relaxed">
            Pick a pack and start generating magical LumiAI art. No subscriptions, no hidden fees. 
            Pay once, create forever.
          </p>
        </header>

        {/* Enhanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <article
              key={i}
              className={`relative group rounded-3xl border shadow-2xl bg-white/90 backdrop-blur-xl p-8 transition-all duration-500
                hover:-translate-y-3 hover:shadow-3xl overflow-hidden
                ${plan.highlight ? "border-[#00C4CC] scale-105" : "border-gray-200/50"}`}
            >
              {/* Enhanced highlight ribbon */}
              {plan.highlight && (
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#00E5A0] to-[#00C4CC] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white transform -rotate-12 text-center leading-tight">
                    Best<br />Value
                  </span>
                </div>
              )}

              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5A0]/5 to-[#00C4CC]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

              {/* Enhanced header */}
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-[#0D1B2A] mb-3 group-hover:text-[#00C4CC] transition-colors">{plan.name}</h3>
                <div className="flex items-end gap-2 mb-4">
                  <p className="text-5xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                    ₹{plan.price}
                  </p>
                  <span className="text-gray-500 mb-2 text-lg font-medium">/ pack</span>
                </div>

                {/* Enhanced token chip */}
                <div className="inline-flex items-center gap-3 rounded-2xl border border-[#00E5A0]/30 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 px-4 py-2 text-sm font-bold text-[#0D1B2A] shadow-lg">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] animate-pulse" />
                  {plan.tokens} credits
                </div>
              </div>

              {/* Enhanced features */}
              <ul className="space-y-4 text-base mb-8 relative z-10">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-[#00E5A0] flex-shrink-0" />
                  <span className="font-medium">Access to Text → Image</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-[#00E5A0] flex-shrink-0" />
                  <span className="font-medium">Photo → Art Transform</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-[#00E5A0] flex-shrink-0" />
                  <span className="font-medium">Save & Download Art</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-[#00E5A0] flex-shrink-0" />
                  <span className="font-medium">Priority Generation {plan.highlight ? "(Pro+)" : ""}</span>
                </li>
              </ul>

              {/* Enhanced CTA */}
              <div className="relative z-10">
                <button
                  className={`w-full rounded-2xl py-4 font-bold text-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 ${
                    plan.highlight
                      ? "text-white bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] shadow-xl hover:shadow-2xl"
                      : "bg-gray-100 text-[#0D1B2A] hover:bg-gray-200 shadow-lg hover:shadow-xl"
                  }`}
                  onClick={() => handleBuyCredits(plan)}
                  disabled={isProcessing || statusLoading || (paymentStatus && !paymentStatus.available)}
                >
                  {statusLoading ? "Checking..." : 
                   isProcessing ? "Processing..." : 
                   statusError ? "Service Error" :
                   (paymentStatus && !paymentStatus.available) ? "Unavailable" : 
                   "Buy Now"}
                </button>
                
                {statusError && (
                  <div className="mt-2 flex items-center justify-center text-xs text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Unable to check payment service
                  </div>
                )}
                
                {!statusLoading && !statusError && paymentStatus && !paymentStatus.available && (
                  <div className="mt-2 flex items-center justify-center text-xs text-amber-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {paymentStatus.message || "Payment service temporarily unavailable"}
                  </div>
                )}
                
                {!statusLoading && !statusError && paymentStatus && paymentStatus.available && (
                  <div className="mt-2 flex items-center justify-center text-xs text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Payment service ready
                  </div>
                )}
              </div>

              {/* soft hover glow */}
              <span className="pointer-events-none absolute -z-10 -right-6 -bottom-6 h-28 w-28 rounded-full bg-[#00C4CC]/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
            </article>
          ))}
        </div>

        {/* Enhanced reassurance section */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#00C4CC]" />
              <span className="font-bold text-lg text-[#0D1B2A]">Why Choose LumiAI?</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-medium">One-time payment</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-medium">Credits never expire</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="font-medium">Instant access</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                🔒 <span className="font-medium">Secure payment powered by Razorpay (Test Mode)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
