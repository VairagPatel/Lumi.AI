import { useState, useEffect, useMemo } from "react";
import { Sparkles, Filter, Grid3X3, List, Search, Heart, Download, Eye, SortAsc, User, Calendar, TrendingUp, LayoutGrid, ArrowUp, Share2 } from "lucide-react";
import { assets } from "../assets/assets.js";

const GalleryPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [layoutMode, setLayoutMode] = useState("grid"); // grid, masonry, list
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Enhanced gallery items using all available assets
  const galleryItems = [
    { 
      id: 1,
      imageSrc: assets.lumiai_art_1, 
      title: "Ethereal Mountain Sanctuary",
      category: "nature",
      description: "A breathtaking mountain landscape with mystical floating elements and serene atmosphere",
      tags: ["mountains", "ethereal", "sanctuary", "peaceful"],
      likes: 892,
      downloads: 234,
      featured: true,
      artist: "Luna_Artist",
      createdAt: "2024-12-15"
    },
    { 
      id: 2,
      imageSrc: assets.lumiai_art_2, 
      title: "Magical Forest Portal",
      category: "fantasy",
      description: "An enchanted forest gateway leading to otherworldly realms with glowing spirits",
      tags: ["forest", "portal", "magical", "spirits"],
      likes: 756,
      downloads: 189,
      featured: true,
      artist: "MysticCreator",
      createdAt: "2024-12-14"
    },
    { 
      id: 3,
      imageSrc: assets.lumiai_art_3, 
      title: "Celestial Dreams",
      category: "fantasy",
      description: "A stunning celestial landscape with floating islands and cosmic elements",
      tags: ["celestial", "dreams", "cosmic", "floating"],
      likes: 1024,
      downloads: 312,
      featured: true,
      artist: "StarGazer_AI",
      createdAt: "2024-12-13"
    },
    { 
      id: 4,
      imageSrc: assets.lumiai_art_4, 
      title: "Ocean's Whisper",
      category: "nature",
      description: "Serene ocean waves meeting a mystical shoreline under twilight skies",
      tags: ["ocean", "waves", "twilight", "serene"],
      likes: 687,
      downloads: 198,
      featured: true,
      artist: "WaveRider",
      createdAt: "2024-12-12"
    },
    { 
      id: 5,
      imageSrc: assets.lumiai_art_5, 
      title: "Digital Renaissance",
      category: "abstract",
      description: "A fusion of classical art elements with modern digital aesthetics",
      tags: ["digital", "renaissance", "classical", "modern"],
      likes: 543,
      downloads: 167,
      featured: false,
      artist: "NeoClassic",
      createdAt: "2024-12-11"
    },
    { 
      id: 6,
      imageSrc: assets.lumiai_art_6, 
      title: "Mystic Garden Bloom",
      category: "nature",
      description: "A magical garden scene with ethereal lighting and mystical creatures",
      tags: ["garden", "magical", "nature", "bloom"],
      likes: 634,
      downloads: 156,
      featured: false,
      artist: "GardenMage",
      createdAt: "2024-12-10"
    },
    { 
      id: 7,
      imageSrc: assets.lumiai_art_7, 
      title: "Sky Pirate's Adventure",
      category: "fantasy",
      description: "Floating islands and airships in a dreamy sky adventure",
      tags: ["sky", "adventure", "fantasy", "airship"],
      likes: 578,
      downloads: 142,
      featured: false,
      artist: "SkyExplorer",
      createdAt: "2024-12-09"
    },
    { 
      id: 8,
      imageSrc: assets.lumiai_art_8, 
      title: "Spirited River Journey",
      category: "nature",
      description: "A serene river flowing through an enchanted landscape",
      tags: ["river", "journey", "peaceful", "water"],
      likes: 445,
      downloads: 98,
      featured: false,
      artist: "RiverSpirit",
      createdAt: "2024-12-08"
    },
    { 
      id: 9,
      imageSrc: assets.lumiai_art_9, 
      title: "Enchanted Forest Spirit",
      category: "fantasy",
      description: "Mystical forest with glowing spirits and magical flora",
      tags: ["forest", "spirits", "magical", "flora"],
      likes: 512,
      downloads: 123,
      featured: false,
      artist: "ForestMystic",
      createdAt: "2024-12-07"
    },
    { 
      id: 10,
      imageSrc: assets.lumiai_art_10, 
      title: "Twilight Serenity",
      category: "nature",
      description: "A peaceful twilight scene with soft colors and gentle atmosphere",
      tags: ["twilight", "peaceful", "serene", "colors"],
      likes: 723,
      downloads: 267,
      featured: false,
      artist: "TwilightArtist",
      createdAt: "2024-12-06"
    },
    { 
      id: 11,
      imageSrc: assets.grid_1, 
      title: "Whimsical Forest Dweller",
      category: "nature",
      description: "A magical forest scene with ethereal lighting and mystical creatures",
      tags: ["forest", "magical", "nature", "ghibli"],
      likes: 634,
      downloads: 156,
      featured: false,
      artist: "ForestMage",
      createdAt: "2024-12-05"
    },
    { 
      id: 12,
      imageSrc: assets.grid_2, 
      title: "Sky Pirate's Retreat",
      category: "fantasy",
      description: "Floating islands and airships in a dreamy sky adventure",
      tags: ["sky", "adventure", "fantasy", "airship"],
      likes: 578,
      downloads: 142,
      featured: false,
      artist: "SkyExplorer",
      createdAt: "2024-12-04"
    },
    { 
      id: 13,
      imageSrc: assets.grid_3, 
      title: "Spirited River Journey",
      category: "nature",
      description: "A serene river flowing through an enchanted landscape",
      tags: ["river", "journey", "peaceful", "water"],
      likes: 445,
      downloads: 98,
      featured: false,
      artist: "RiverSpirit",
      createdAt: "2024-12-03"
    },
    { 
      id: 14,
      imageSrc: assets.grid_4, 
      title: "Enchanted Garden Spirit",
      category: "fantasy",
      description: "Mystical garden with glowing spirits and magical flora",
      tags: ["garden", "spirits", "magical", "flora"],
      likes: 512,
      downloads: 123,
      featured: false,
      artist: "GardenMystic",
      createdAt: "2024-12-02"
    },
    { 
      id: 15,
      imageSrc: assets.step1, 
      title: "Transformation Process",
      category: "tutorial",
      description: "Step-by-step transformation from photo to LumiAI art",
      tags: ["tutorial", "process", "transformation", "guide"],
      likes: 723,
      downloads: 267,
      featured: false,
      artist: "TutorialMaster",
      createdAt: "2024-12-01"
    },
    { 
      id: 16,
      imageSrc: assets.grid, 
      title: "Gallery Showcase",
      category: "showcase",
      description: "A beautiful collection of LumiAI generated artworks in perfect harmony",
      tags: ["gallery", "collection", "showcase", "harmony"],
      likes: 689,
      downloads: 201,
      featured: false,
      artist: "CuratorAI",
      createdAt: "2024-11-30"
    },
  ];

  const categories = [
    { id: "all", name: "All Artworks", count: galleryItems.length },
    { id: "featured", name: "Featured", count: galleryItems.filter(item => item.featured).length },
    { id: "nature", name: "Nature", count: galleryItems.filter(item => item.category === "nature").length },
    { id: "fantasy", name: "Fantasy", count: galleryItems.filter(item => item.category === "fantasy").length },
    { id: "abstract", name: "Abstract", count: galleryItems.filter(item => item.category === "abstract").length },
    { id: "tutorial", name: "Tutorials", count: galleryItems.filter(item => item.category === "tutorial").length },
    { id: "showcase", name: "Showcase", count: galleryItems.filter(item => item.category === "showcase").length },
  ];

  // Filter and sort items based on category, search, and sort criteria
  const filteredAndSortedItems = useMemo(() => {
    return galleryItems
      .filter(item => {
        const matchesCategory = filterCategory === "all" || 
                               item.category === filterCategory ||
                               (filterCategory === "featured" && item.featured);
        const matchesSearch = searchTerm === "" || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.artist.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "popular":
            return b.likes - a.likes;
          case "downloads":
            return b.downloads - a.downloads;
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [filterCategory, searchTerm, sortBy]);

  // Load favorites from localStorage and handle scroll
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("lumiai-favorites") || "[]");
    setFavorites(savedFavorites);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(8);
  }, [filterCategory, searchTerm, sortBy]);

  const toggleFavorite = (itemId) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    
    setFavorites(newFavorites);
    localStorage.setItem("lumiai-favorites", JSON.stringify(newFavorites));
  };

  const handleDownload = (imageSrc, title) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `lumiai-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadMoreItems = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 8);
      setIsLoading(false);
    }, 1000);
  };

  const displayedItems = filteredAndSortedItems.slice(0, displayCount);
  const hasMoreItems = displayCount < filteredAndSortedItems.length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareGallery = () => {
    if (navigator.share) {
      navigator.share({
        title: 'LumiAI Gallery',
        text: 'Check out these amazing AI-generated artworks!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-[#ECFDF5] to-[#F0F9FF] relative overflow-hidden">
      {/* Enhanced animated background - matching CreatePage and ProfilePage */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00E5A0]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00C4CC]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00E5A0]/10 to-[#00C4CC]/10 rounded-full blur-2xl animate-spin" style={{animationDuration: '20s'}} />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#00E5A0]/30 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#00C4CC]" />
            <span className="text-sm font-semibold text-[#0D1B2A]">Community Gallery</span>
            <div className="w-2 h-2 bg-[#00E5A0] rounded-full animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            <span className="text-[#0D1B2A]">Discover </span>
            <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
              Magical
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C4CC] to-[#00E5A0] bg-clip-text text-transparent">
              LumiAI
            </span>
            <span className="text-[#0D1B2A]"> Creations</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-[#0D1B2A]/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Explore stunning AI-generated artwork created by our community. 
            <br className="hidden md:block" />
            Get inspired and create your own magical masterpieces.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                {galleryItems.length}+
              </div>
              <div className="text-sm text-[#0D1B2A]/60 font-medium mt-1">
                Artworks
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                {galleryItems.reduce((sum, item) => sum + item.likes, 0)}+
              </div>
              <div className="text-sm text-[#0D1B2A]/60 font-medium mt-1">
                Likes
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                {galleryItems.reduce((sum, item) => sum + item.downloads, 0)}+
              </div>
              <div className="text-sm text-[#0D1B2A]/60 font-medium mt-1">
                Downloads
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                4.9★
              </div>
              <div className="text-sm text-[#0D1B2A]/60 font-medium mt-1">
                Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter and Search Section */}
      <section className="container mx-auto px-6 mb-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8">
          {/* Top Row - Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search artworks, artists, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00E5A0] focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00E5A0] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloaded</option>
                <option value="title">Alphabetical</option>
              </select>
              <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                showFilters
                  ? "bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setLayoutMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  layoutMode === "grid"
                    ? "bg-white shadow-md text-[#00C4CC]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Grid Layout"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayoutMode("masonry")}
                className={`p-2 rounded-lg transition-all ${
                  layoutMode === "masonry"
                    ? "bg-white shadow-md text-[#00C4CC]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="Masonry Layout"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayoutMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  layoutMode === "list"
                    ? "bg-white shadow-md text-[#00C4CC]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                title="List Layout"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filters - Collapsible */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setFilterCategory(category.id)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      filterCategory === category.id
                        ? "bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
            <span>
              Showing {filteredAndSortedItems.length} of {galleryItems.length} artworks
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Sorted by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      {filterCategory === "all" && searchTerm === "" && (
        <section className="container mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800">Featured Creations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0D1B2A] mb-4">
              <span className="bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] bg-clip-text text-transparent">
                Latest Masterpieces
              </span>
            </h2>
            <p className="text-lg text-[#0D1B2A]/70 max-w-2xl mx-auto">
              Discover the most stunning and popular AI-generated artworks from our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {galleryItems.filter(item => item.featured).map((item, index) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-3"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Enhanced animated ring for featured items */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg,rgba(255,215,0,.3),rgba(255,193,7,.3),transparent_60%)] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />

                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[16/10] rounded-3xl">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.08]"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/800x500/F9FAFB/0D1B2A?text=Featured+Artwork';
                    }}
                  />

                  {/* Enhanced golden sheen sweep for featured */}
                  <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent translate-x-[-120%] rotate-6 transition-transform duration-1000 ease-out group-hover:translate-x-[260%]" />

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 text-sm font-bold text-amber-800 backdrop-blur shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Featured
                    </span>
                  </div>

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-4 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
                        favorites.includes(item.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDownload(item.imageSrc, item.title)}
                      className="p-4 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-110"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button className="p-4 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-110">
                      <Eye className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-base leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-base text-gray-600">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">{item.likes}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">{item.downloads}</span>
                      </span>
                    </div>
                    <span className="text-[#00C4CC] font-bold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      LumiAI
                    </span>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2 translate-y-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-transform duration-700 group-hover:translate-y-0" />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Enhanced Gallery Grid */}
      <section className="container mx-auto px-6 pb-20">
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No artworks found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className={`${
              layoutMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : layoutMode === "masonry"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8"
                : "grid grid-cols-1 max-w-4xl mx-auto gap-8"
            }`}>
            {displayedItems.map((item, index) => (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  layoutMode === "list" ? "flex gap-6 p-6" : layoutMode === "masonry" ? "break-inside-avoid mb-8" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Enhanced animated ring */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[conic-gradient(from_0deg,rgba(0,229,160,.25),rgba(0,196,204,.25),transparent_60%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Image Container */}
                <div className={`relative overflow-hidden ${
                  layoutMode === "list" 
                    ? "w-48 h-32 rounded-2xl flex-shrink-0" 
                    : layoutMode === "masonry"
                    ? "aspect-auto rounded-3xl"
                    : "aspect-[4/5] rounded-3xl"
                }`}>
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[800ms] group-hover:scale-[1.06]"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/600x750/F9FAFB/0D1B2A?text=${encodeURIComponent(item.title)}`;
                    }}
                    onLoad={(e) => {
                      e.currentTarget.classList.add('loaded');
                    }}
                  />

                  {/* Enhanced mint sheen sweep */}
                  <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-120%] rotate-6 transition-transform duration-700 ease-out group-hover:translate-x-[260%]" />

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
                        favorites.includes(item.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleDownload(item.imageSrc, item.title)}
                      className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-110"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-110">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Category and Featured Badges */}
                  {layoutMode !== "list" && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {item.featured && (
                        <span className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 text-sm font-bold text-amber-800 backdrop-blur shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                      <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/85 px-3 py-1.5 text-sm font-semibold text-gray-800 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC]" />
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`${layoutMode === "list" ? "flex-1" : "p-6"}`}>
                  <h3 className={`font-bold text-gray-800 mb-2 ${
                    layoutMode === "list" ? "text-xl" : "text-lg"
                  }`}>
                    {item.title}
                  </h3>
                  
                  {/* Artist and Date */}
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {item.artist}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className={`text-gray-600 mb-4 ${
                    layoutMode === "list" ? "text-base" : "text-sm"
                  }`}>
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, layoutMode === "list" ? 4 : 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 text-xs rounded-lg font-medium border border-gray-200 hover:border-[#00E5A0] transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        {item.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <Download className="w-4 h-4" />
                        {item.downloads.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[#00C4CC] font-semibold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      LumiAI
                    </span>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 translate-y-full bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] transition-transform duration-500 group-hover:translate-y-0" />
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreItems && (
            <div className="text-center mt-12">
              <button
                onClick={loadMoreItems}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  `Load More (${filteredAndSortedItems.length - displayCount} remaining)`
                )}
              </button>
            </div>
          )}
          </>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Create Your Own?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of artists and start creating stunning AI artwork today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/create"
              className="px-8 py-4 bg-white text-[#0D1B2A] font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Creating Now
            </a>
            <a
              href="/auth"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all duration-300"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Share Button */}
        <button
          onClick={shareGallery}
          className="p-4 bg-gradient-to-r from-[#00E5A0] to-[#00C4CC] text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          title="Share Gallery"
        >
          <Share2 className="w-6 h-6" />
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-4 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-gray-200"
            title="Scroll to Top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
