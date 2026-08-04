"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Flame, Tag, Clock, SlidersHorizontal } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useCartStore } from "@/lib/store";

// Only show products with an originalPrice (i.e. actually on sale)
const SALE_PRODUCTS = PRODUCTS.filter((p) => p.originalPrice);

function getDiscount(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

// Countdown to next Sunday midnight
function useCountdown() {
  const getTarget = () => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilSunday = (7 - day) % 7 || 7;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(23, 59, 59, 0);
    return target.getTime();
  };

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = getTarget();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export default function SalePage() {
  const { addItem, toggleCart } = useCartStore();
  const { h, m, s } = useCountdown();

  const [sort, setSort] = useState("discount");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showCount, setShowCount] = useState(24);

  const categories = useMemo(() => {
    const cats = new Set<string>(SALE_PRODUCTS.map((p) => p.mainCategory));
    return ["All", ...Array.from(cats)];
  }, []);

  const displayed = useMemo(() => {
    let list = categoryFilter === "All"
      ? SALE_PRODUCTS
      : SALE_PRODUCTS.filter((p) => p.mainCategory === categoryFilter);

    if (sort === "discount") list = [...list].sort((a, b) => getDiscount(b.price, b.originalPrice) - getDiscount(a.price, a.originalPrice));
    else if (sort === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "saving") list = [...list].sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));

    return list.slice(0, showCount);
  }, [sort, categoryFilter, showCount]);

  const totalSavings = SALE_PRODUCTS.reduce((acc, p) => acc + (p.originalPrice - p.price), 0);

  function handleAddToCart(e: React.MouseEvent, product: any) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: "M",
    });
    toggleCart();
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden bg-red-600 text-white">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-black/10 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame size={20} className="text-yellow-300 animate-pulse" />
                <span className="text-xs font-black tracking-[0.25em] uppercase text-yellow-300">Limited Time Offer</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                End of<br />
                <span className="text-yellow-300">Season</span> Sale
              </h1>
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Up to <strong className="text-white">50% off</strong> selected styles. Limited stock — once it&apos;s gone, it&apos;s gone.
              </p>
              <div className="flex items-center gap-3 mt-6 flex-wrap">
                <span className="bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold">{SALE_PRODUCTS.length} items on sale</span>
                <span className="bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-bold">
                  Total savings up to Rs. {totalSavings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: Countdown */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 text-center shrink-0">
              <div className="flex items-center gap-2 justify-center mb-4 text-yellow-300">
                <Clock size={16} />
                <span className="text-xs font-black tracking-widest uppercase">Sale Ends In</span>
              </div>
              <div className="flex items-center gap-3">
                {[{ label: "HRS", val: h }, { label: "MIN", val: m }, { label: "SEC", val: s }].map(({ label, val }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-xl px-4 py-3 min-w-[64px]">
                      <span className="text-4xl font-black tabular-nums block leading-none">
                        {String(val).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] tracking-widest font-bold text-white/70 mt-1 block">{label}</span>
                    </div>
                    {i < 2 && <span className="text-2xl font-black text-white/60">:</span>}
                  </div>
                ))}
              </div>
              <Link
                href="#sale-items"
                className="mt-5 block bg-white text-red-600 font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-yellow-300 hover:text-red-700 transition-colors"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                  categoryFilter === cat
                    ? "bg-red-600 text-white border-red-600 shadow-md"
                    : "border-border text-muted-foreground hover:border-red-400 hover:text-red-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="sale-items" className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wide flex items-center gap-2">
              <Tag size={20} className="text-red-500" />
              {categoryFilter === "All" ? "All Sale Items" : categoryFilter}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {displayed.length} of {categoryFilter === "All" ? SALE_PRODUCTS.length : SALE_PRODUCTS.filter(p => p.mainCategory === categoryFilter).length} items
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              >
                <option value="discount">Biggest Discount</option>
                <option value="saving">Biggest Saving (Rs.)</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>

            {/* Show count */}
            <div className="relative hidden sm:block">
              <select
                value={showCount}
                onChange={(e) => setShowCount(Number(e.target.value))}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
              >
                <option value={12}>12 items</option>
                <option value={24}>24 items</option>
                <option value={48}>48 items</option>
                <option value={9999}>All items</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {displayed.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-2xl font-bold mb-2">No sale items in this category</p>
            <p className="text-muted-foreground mb-6">Try a different category or check back later.</p>
            <button
              onClick={() => setCategoryFilter("All")}
              className="bg-red-600 text-white px-6 py-3 font-bold uppercase rounded-full hover:bg-red-700 transition-colors"
            >
              View All Sale Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {displayed.map((product: any) => {
              const discount = getDiscount(product.price, product.originalPrice);
              const saving = product.originalPrice - product.price;
              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {/* Discount badge */}
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow">
                      -{discount}%
                    </div>
                    {/* Saving badge */}
                    <div className="absolute top-2 right-2 z-10 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow">
                      Save Rs.{saving.toLocaleString()}
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center">
                        <span className="bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Sold Out</span>
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-3 md:p-4">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{product.mainCategory}</p>
                    <h3 className="text-sm font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base font-black text-red-600">Rs. {product.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                      </div>
                      {product.inStock ? (
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-full bg-foreground text-background text-xs font-black uppercase tracking-widest py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button disabled className="w-full bg-neutral-200 text-neutral-400 text-xs font-black uppercase tracking-widest py-2 rounded-lg cursor-not-allowed">
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {displayed.length < (categoryFilter === "All" ? SALE_PRODUCTS.length : SALE_PRODUCTS.filter(p => p.mainCategory === categoryFilter).length) && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowCount((c) => c + 12)}
              className="flex items-center gap-2 border-2 border-red-500 text-red-600 font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-red-600 hover:text-white transition-all"
            >
              <SlidersHorizontal size={16} /> Load More
            </button>
          </div>
        )}

      </div>

      {/* Bottom CTA */}
      <div className="bg-neutral-900 text-white py-16 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-3">Don&apos;t miss out</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Want early access to future sales?</h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">Follow us on Instagram and WhatsApp to get notified first about exclusive drops and flash sales.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://www.instagram.com/brand.zeal/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Follow on Instagram
            </a>
            <a
              href="https://wa.me/94788585588"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
