import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Heart, Users, ArrowRight, Play, Star, CheckCircle, Palette, Image, Wand2, Download, Eye, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Digital Artist",
            content: "LumiAI transformed my creative workflow. The Ghibli-inspired results are absolutely magical!",
            rating: 5,
            avatar: "SC"
        },
        {
            name: "Marcus Rodriguez",
            role: "Content Creator", 
            content: "I've never seen AI art this beautiful. LumiAI captures emotions perfectly.",
            rating: 5,
            avatar: "MR"
        },
        {
            name: "Emma Thompson",
            role: "Photographer",
            content: "The quality is incredible. My clients love the dreamy, painterly style.",
            rating: 5,
            avatar: "ET"
        },
        {
            name: "Alex Kim",
            role: "Graphic Designer",
            content: "The speed and quality are unmatched. LumiAI has become essential to my workflow.",
            rating: 5,
            avatar: "AK"
        }
    ];

    const features = [
        {
            icon: <Palette className="w-6 h-6" />,
            title: "AI-Powered Magic",
            description: "Transform any image into stunning Ghibli-inspired artwork with advanced AI technology",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Generate beautiful artwork in seconds, not hours. Perfect for busy creators",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Emotion Preserved",
            description: "Our AI understands and maintains the emotional essence of your original images",
            color: "from-red-500 to-pink-500"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community Driven",
            description: "Join thousands of artists creating and sharing magical artwork daily",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Image className="w-6 h-6" />,
            title: "Multiple Formats",
            description: "Support for photos, sketches, and digital art in various formats",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <Wand2 className="w-6 h-6" />,
            title: "Style Control",
            description: "Fine-tune the artistic style to match your creative vision perfectly",
            color: "from-indigo-500 to-purple-500"
        }
    ];

    const stats = [
        { number: "100K+", label: "Artworks Created", icon: <Image className="w-5 h-5" /> },
        { number: "25K+", label: "Happy Artists", icon: <Users className="w-5 h-5" /> },
        { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-5 h-5" /> },
        { number: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5" /> }
    ];

    const processSteps = [
        {
            step: "01",
            title: "Upload Your Image",
            description: "Choose any photo or artwork you'd like to transform",
            icon: <Image className="w-8 h-8" />
        },
        {
            step: "02", 
            title: "AI Magic Happens",
            description: "Our advanced AI analyzes and transforms your image",
            icon: <Sparkles className="w-8 h-8" />
        },
        {
            step: "03",
            title: "Download & Share",
            description: "Get your stunning Ghibli-inspired artwork instantly",
            icon: <Download className="w-8 h-8" />
        }
    ];

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    // Auto-rotate features
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [features.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] relative overflow-hidden">
            {/* Enhanced animated background - matching other pages */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
            </div>

            {/* Animated grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            {/* Enhanced Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-20">
                <div className="container mx-auto px-6 text-center relative z-10">
                    {/* Enhanced Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#00E5A0]/30 rounded-full px-4 py-2 mb-8 shadow-lg">
                        <Sparkles className="w-4 h-4 text-[#00C4CC]" />
                        <span className="text-sm font-semibold text-[#0D1B2A]">AI-Powered Art Generation</span>
                        <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
                    </div>

                    {/* Enhanced Main Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8">
                        <span className="text-[#0D1B2A]">Create </span>
                        <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                            Magical
                        </span>
                        <br />
                        <span className="text-[#0D1B2A]">Art with </span>
                        <span className="bg-gradient-to-r from-[#00C4CC] to-[#00E5A0] bg-clip-text text-transparent">
                            LumiAI
                        </span>
                    </h1>

                    {/* Enhanced Subtitle */}
                    <p className="text-xl md:text-2xl text-[#0D1B2A]/70 max-w-4xl mx-auto mb-12 leading-relaxed">
                        Transform your photos into breathtaking Ghibli-inspired artwork. 
                        <br className="hidden md:block" />
                        Experience the magic of AI-powered creativity in seconds, not hours.
                    </p>

                    {/* Enhanced CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                        <button
                            onClick={() => navigate("/create")}
                            className="group relative px-10 py-5 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                Start Creating Free
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00C4CC] to-[#00E5A0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                        
                        <button
                            onClick={() => navigate("/gallery")}
                            className="group flex items-center gap-3 px-10 py-5 bg-white/90 backdrop-blur-sm border-2 border-[#00E5A0]/30 text-[#0D1B2A] font-bold text-lg rounded-2xl hover:border-[#00C4CC] hover:bg-white hover:shadow-xl transition-all duration-300"
                        >
                            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Explore Gallery
                        </button>
                    </div>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-center mb-3">
                                    <div className="p-3 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-xl text-white group-hover:scale-110 transition-transform">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-[#0D1B2A]/60 font-semibold">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#00E5A0]/30 rounded-full px-4 py-2 mb-6">
                            <Wand2 className="w-4 h-4 text-[#00C4CC]" />
                            <span className="text-sm font-semibold text-[#0D1B2A]">Simple Process</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#0D1B2A] mb-6">
                            How <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">LumiAI</span> Works
                        </h2>
                        <p className="text-xl text-[#0D1B2A]/70 max-w-3xl mx-auto">
                            Transform your images into magical artwork in just three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {processSteps.map((step, index) => (
                            <div key={index} className="group relative">
                                {/* Connection Line */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] opacity-30 z-0" />
                                )}
                                
                                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200/50">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-8">
                                        <div className="w-12 h-12 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                                            {step.step}
                                        </div>
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-2xl flex items-center justify-center text-[#00C4CC] mb-6 mt-4 group-hover:scale-110 transition-transform">
                                        {step.icon}
                                    </div>

                                    <h3 className="text-2xl font-black text-[#0D1B2A] mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-[#0D1B2A]/70 text-lg leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#00E5A0]/30 rounded-full px-4 py-2 mb-6">
                            <Sparkles className="w-4 h-4 text-[#00C4CC]" />
                            <span className="text-sm font-semibold text-[#0D1B2A]">Powerful Features</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#0D1B2A] mb-6">
                            Why Choose <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">LumiAI</span>?
                        </h2>
                        <p className="text-xl text-[#0D1B2A]/70 max-w-3xl mx-auto">
                            Discover the advanced features that make LumiAI the perfect tool for creating stunning artwork
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`group p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-200/50 ${
                                    index === currentFeatureIndex ? 'ring-2 ring-[#00E5A0] ring-opacity-50' : ''
                                }`}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-[#0D1B2A] mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-[#0D1B2A]/70 text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#00E5A0]/30 rounded-full px-4 py-2 mb-6">
                            <Heart className="w-4 h-4 text-[#00C4CC]" />
                            <span className="text-sm font-semibold text-[#0D1B2A]">Community Love</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#0D1B2A] mb-6">
                            Loved by <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">Creators</span>
                        </h2>
                        <p className="text-xl text-[#0D1B2A]/70 max-w-3xl mx-auto">
                            Join thousands of satisfied artists who trust LumiAI for their creative projects
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-200/50 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#00C4CC]/10 to-[#00E5A0]/10 rounded-full blur-2xl" />
                            
                            <div className="relative z-10">
                                {/* Stars */}
                                <div className="flex justify-center mb-6">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} className="w-8 h-8 text-yellow-400 fill-current mx-1" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-2xl md:text-3xl text-[#0D1B2A] text-center mb-8 font-medium leading-relaxed">
                                    "{testimonials[currentTestimonial].content}"
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {testimonials[currentTestimonial].avatar}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-black text-[#0D1B2A] text-xl">
                                            {testimonials[currentTestimonial].name}
                                        </div>
                                        <div className="text-[#0D1B2A]/60 font-semibold">
                                            {testimonials[currentTestimonial].role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Testimonial Navigation */}
                        <div className="flex justify-center mt-8 gap-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial 
                                            ? 'bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] scale-125 shadow-lg' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-20 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                {/* Animated elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />
                
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                            Ready to Create Magic?
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
                            Join thousands of artists who are already creating stunning artwork with LumiAI. 
                            <br className="hidden md:block" />
                            Start your creative journey today - it's completely free!
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                            <button
                                onClick={() => navigate("/create")}
                                className="group px-10 py-5 bg-white text-[#0D1B2A] font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                            >
                                <span className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    Start Creating Now
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                            <button
                                onClick={() => navigate("/gallery")}
                                className="px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-300"
                            >
                                Explore Gallery
                            </button>
                        </div>

                        {/* Enhanced Trust Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-white/90">
                            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <CheckCircle className="w-6 h-6 text-white" />
                                <span className="font-semibold">No Credit Card Required</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <CheckCircle className="w-6 h-6 text-white" />
                                <span className="font-semibold">15 Free Credits</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <CheckCircle className="w-6 h-6 text-white" />
                                <span className="font-semibold">Cancel Anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage;