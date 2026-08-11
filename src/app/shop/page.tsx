"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";

const MAX_PRICE_LIMIT = 50000;

function ShopContent() {
  const searchParams = useSearchParams();

  const [productsList, setProductsList] = useState<any[]>(PRODUCTS);
  const [filter, setFilter] = useState<{ main?: string; sub?: string; style?: string }>({});
  const [keyword, setKeyword] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_LIMIT);
  const [sort, setSort] = useState("Newest");
  const [showCount, setShowCount] = useState(24);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Prevent background scrolling on mobile when filters drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Fetch dynamic products from /api/products
  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductsList(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch live products for shop:", err);
      }
    }
    fetchLiveProducts();
  }, []);

  // Read URL query params on mount
  useEffect(() => {
    const main = searchParams.get("main") || undefined;
    const style = searchParams.get("style") || undefined;
    setFilter({ main, style });
  }, [searchParams]);

  // Compute max price from current products so slider feels relevant
  const allPrices = productsList.map((p) => p.price);
  const absoluteMax = allPrices.length > 0 ? Math.max(...allPrices) : MAX_PRICE_LIMIT;

  const filteredAndSorted = useMemo(() => {
    let result = productsList.filter((p) => {
      if (filter.main && p.mainCategory !== filter.main) return false;
      if (filter.sub && p.subCategory !== filter.sub && p.styleCategory !== filter.sub && p.category !== filter.sub) return false;
      if (filter.style && p.styleCategory !== filter.style) return false;
      if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    if (sort === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    // "Newest" = default order from products.json

    // Only apply showCount limit when a filter is active; All Categories shows everything
    const isFiltered = filter.main || filter.sub || filter.style || keyword || maxPrice < MAX_PRICE_LIMIT;
    return isFiltered ? result.slice(0, showCount) : result;
  }, [productsList, filter, keyword, maxPrice, sort, showCount]);

  const totalMatching = useMemo(() => {
    return productsList.filter((p) => {
      if (filter.main && p.mainCategory !== filter.main) return false;
      if (filter.sub && p.subCategory !== filter.sub && p.styleCategory !== filter.sub && p.category !== filter.sub) return false;
      if (filter.style && p.styleCategory !== filter.style) return false;
      if (keyword && !p.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      return true;
    }).length;
  }, [productsList, filter, keyword, maxPrice]);

  const CATEGORY_TREE = [
    {
      title: "Men's T-Shirts",
      main: "Men's T-Shirts",
      subs: ["Basic T-Shirts", "Graphic T-Shirts", "Oversized T-Shirts"],
    },
    {
      title: "Women's T-Shirts",
      main: "Women's T-Shirts",
      subs: ["Basic T-Shirts", "Crop Tops", "Oversized T-Shirts", "Graphic T-Shirts", "Fitted T-Shirts"],
    },
    {
      title: "Kids' T-Shirts",
      main: "Kids' T-Shirts",
      subs: ["Boys' T-Shirts", "Girls' T-Shirts", "Cartoon T-Shirts", "Printed T-Shirts"],
    },
  ];

  const STYLE_CATEGORIES = ["Plain T-Shirts", "Printed T-Shirts", "Graphic T-Shirts"];

  const pageTitle = filter.sub
    ? filter.sub
    : filter.main
    ? filter.main
    : filter.style
    ? filter.style
    : "Shop Collections";

  const pageSubtitle = filter.sub
    ? `Showing ${filteredAndSorted.length} of ${totalMatching} items in ${filter.sub}`
    : filter.main || filter.style
    ? `Showing ${filteredAndSorted.length} of ${totalMatching} items in ${filter.main || filter.style}`
    : `Showing all ${filteredAndSorted.length} premium apparel choices`;

  function resetAll() {
    setFilter({});
    setKeyword("");
    setMaxPrice(MAX_PRICE_LIMIT);
    setSort("Newest");
    setShowCount(24);
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-border gap-6">
        <div>
          {/* Breadcrumb */}
          {(filter.main || filter.sub || filter.style) && (
            <nav className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5 flex-wrap">
              <button
                onClick={resetAll}
                className="hover:text-foreground transition-colors"
              >
                All
              </button>
              {filter.main && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => setFilter({ main: filter.main })}
                    className={`hover:text-foreground transition-colors ${
                      !filter.sub ? "text-foreground font-bold" : ""
                    }`}
                  >
                    {filter.main}
                  </button>
                </>
              )}
              {filter.sub && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-black">{filter.sub}</span>
                </>
              )}
              {filter.style && !filter.main && (
                <>
                  <span>/</span>
                  <span className="text-foreground font-black">{filter.style}</span>
                </>
              )}
            </nav>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-foreground">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm md:text-base">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-sm flex-wrap">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex lg:hidden items-center gap-2 bg-background border border-border rounded px-4 py-1.5 hover:bg-neutral-50 transition-colors cursor-pointer text-foreground font-semibold"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Sort:</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-background border border-border rounded px-4 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer text-foreground"
              >
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>

          {/* Show count */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-muted-foreground">Show:</span>
            <div className="relative">
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="appearance-none bg-background border border-border rounded px-4 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-foreground cursor-pointer text-foreground"
              >
                <option value={12}>12 items</option>
                <option value={24}>24 items</option>
                <option value={48}>48 items</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-72 shrink-0 space-y-8 pr-4">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <h2 className="text-3xl font-serif flex items-center gap-2">
              <SlidersHorizontal size={24} /> Filters
            </h2>
            <button
              onClick={resetAll}
              className="text-sm underline underline-offset-4 text-muted-foreground hover:text-foreground"
            >
              Reset
            </button>
          </div>

          {/* Keyword Search */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">Keyword</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Type product name..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded bg-transparent focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1">Categories</h3>

            <button
              onClick={() => setFilter({})}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                !filter.main && !filter.style ? "bg-neutral-100 font-medium text-foreground" : "text-muted-foreground hover:bg-neutral-50"
              }`}
            >
              All Categories
            </button>

            {CATEGORY_TREE.map((section) => (
              <div key={section.title} className="pt-2">
                <button
                  onClick={() => setFilter({ main: section.main })}
                  className={`w-full text-left px-3 py-1.5 font-medium transition-colors ${
                    filter.main === section.main && !filter.sub ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {section.title}
                </button>
                <ul className="pl-6 mt-1 space-y-1 text-sm">
                  {section.subs.map((sub) => (
                    <li key={sub}>
                      <button
                        onClick={() => setFilter({ main: section.main, sub })}
                        className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                          filter.main === section.main && filter.sub === sub
                            ? "bg-neutral-100 font-medium text-foreground"
                            : "text-muted-foreground hover:bg-neutral-50"
                        }`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Style Categories */}
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3 px-3">Style-Based</h3>
              <ul className="space-y-1 text-sm">
                {STYLE_CATEGORIES.map((style) => (
                  <li key={style}>
                    <button
                      onClick={() => setFilter({ style })}
                      className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                        filter.style === style ? "bg-neutral-100 font-medium text-foreground" : "text-muted-foreground hover:bg-neutral-50"
                      }`}
                    >
                      {style}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price Slider */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Max Price</h3>
              <span className="font-bold text-sm">Rs. {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max={MAX_PRICE_LIMIT}
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-foreground cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Rs. 0</span>
              <span>Rs. {MAX_PRICE_LIMIT.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-2xl font-serif mb-2">No products found</p>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or price range.</p>
              <button
                onClick={resetAll}
                className="bg-foreground text-background px-6 py-2.5 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-12">
              {filteredAndSorted.map((product: any) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group flex flex-col cursor-pointer border border-border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-2 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 sm:mb-1 truncate">
                      {product.mainCategory}
                    </p>
                    <h3 className="text-xs sm:text-sm font-medium leading-tight mb-1 sm:mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-1 sm:pt-2">
                      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                        <span className="font-bold text-foreground text-xs sm:text-sm">Rs. {product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-teal-500" : "bg-red-500"}`}></div>
                        <span className={`text-[10px] sm:text-[11px] font-medium ${product.inStock ? "text-teal-600" : "text-red-600"}`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs lg:hidden"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed top-0 right-0 z-[110] h-full w-80 bg-background shadow-2xl flex flex-col lg:hidden border-l border-border"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-xl font-serif flex items-center gap-2 text-foreground">
                  <SlidersHorizontal size={18} /> Filters
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetAll}
                    className="text-xs underline text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-all cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-8">
                {/* Keyword Search */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">Keyword</h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Type product name..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded bg-transparent focus:outline-none focus:border-foreground text-foreground"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1">Categories</h3>

                  <button
                    onClick={() => { setFilter({}); setIsMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      !filter.main && !filter.style ? "bg-neutral-100 font-medium text-foreground" : "text-muted-foreground hover:bg-neutral-50"
                    }`}
                  >
                    All Categories
                  </button>

                  {CATEGORY_TREE.map((section) => (
                    <div key={section.title} className="pt-2">
                      <button
                        onClick={() => { setFilter({ main: section.main }); setIsMobileFilterOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 font-medium transition-colors ${
                          filter.main === section.main && !filter.sub ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {section.title}
                      </button>
                      <ul className="pl-6 mt-1 space-y-1 text-sm">
                        {section.subs.map((sub) => (
                          <li key={sub}>
                            <button
                              onClick={() => { setFilter({ main: section.main, sub }); setIsMobileFilterOpen(false); }}
                              className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                                filter.main === section.main && filter.sub === sub
                                  ? "bg-neutral-100 font-medium text-foreground"
                                  : "text-muted-foreground hover:bg-neutral-50"
                              }`}
                            >
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {/* Style Categories */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3 px-3">Style-Based</h3>
                    <ul className="space-y-1 text-sm">
                      {STYLE_CATEGORIES.map((style) => (
                        <li key={style}>
                          <button
                            onClick={() => { setFilter({ style }); setIsMobileFilterOpen(false); }}
                            className={`w-full text-left px-3 py-1.5 rounded transition-colors ${
                              filter.style === style ? "bg-neutral-100 font-medium text-foreground" : "text-muted-foreground hover:bg-neutral-50"
                            }`}
                          >
                            {style}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Max Price</h3>
                    <span className="font-bold text-sm text-foreground">Rs. {maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE_LIMIT}
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-foreground cursor-pointer h-2 bg-neutral-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Rs. 0</span>
                    <span>Rs. {MAX_PRICE_LIMIT.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border bg-neutral-50 flex gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 bg-foreground text-background py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest text-center hover:bg-neutral-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-24 text-center font-bold text-neutral-500 uppercase tracking-widest text-sm">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
