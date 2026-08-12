"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, MapPin, Quote } from "lucide-react";
import Image from "next/image";

import { useState, useEffect } from "react";
import { PRODUCTS } from "@/lib/products";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(PRODUCTS.slice(0, 4));

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeaturedProducts(data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Error loading featured products:", err);
      }
    }
    loadProducts();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Sale Banner (Mona's Closet Style -> Zeal Aesthetic) */}
      <div className="w-full bg-neutral-900 border-b border-border/20 text-background py-4 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Texture/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-neutral-900 to-red-900/20 opacity-50"></div>
        <div className="container mx-auto relative z-10 flex items-center justify-center sm:justify-between gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full tracking-widest uppercase flex items-center gap-1 shrink-0 whitespace-nowrap">
              ⚡ Limited Sale
            </span>
            <h2 className="text-xs sm:text-base md:text-xl font-bold text-white tracking-wide whitespace-nowrap">
              🔥 Up to 50% Off — New Season Styles
            </h2>
          </div>

        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black">
          <Image
            src="/Images/tshirts/FB_IMG_1785245536424.jpg"
            alt="Zeal Brand Streetwear"
            fill
            className="object-cover object-top opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-foreground text-background text-xs font-bold tracking-widest mb-6">
              THE SEASONAL DROP
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-4 sm:mb-6 text-white drop-shadow-xl">
              Unleash Your <br />
              <span className="text-red-400">
                True Zeal
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-white/90 text-sm sm:text-lg md:text-xl mb-6 sm:mb-10 font-medium drop-shadow px-4 sm:px-0">
              Quality from inside out 🖤. Premium graphic tees & heavy-weight oversized fits designed for the streets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link 
                href="/shop" 
                className="group flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-neutral-200 transition-all active:scale-95 w-full sm:w-auto justify-center"
              >
                Shop New Arrivals
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="py-12 sm:py-24 bg-background border-t border-border/20">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight">Shop By Category</h2>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">Explore our premium streetwear collections.</p>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              All Categories <ArrowRight size={14} />
            </Link>
          </div>

          {/* By Gender Row */}
          <p className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-3 sm:mb-4">By Gender</p>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mb-6 sm:mb-10">
            <Link href="/shop?main=Men%27s+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/boys%203.jpg" alt="Men's T-Shirts" fill className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/boys5 .jpg" alt="Men's T-Shirts Hover" fill className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Men&apos;s T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>

            <Link href="/shop?main=Women%27s+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/FB_IMG_1785245661370.jpg" alt="Women's T-Shirts" fill className="object-cover object-top transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/FB_IMG_1785245647629.jpg" alt="Women's T-Shirts Hover" fill className="object-cover object-top transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Women&apos;s T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>

            <Link href="/shop?main=Kids%27+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/FB_IMG_1785245691318.jpg" alt="Kids' T-Shirts" fill className="object-cover object-top transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/FB_IMG_1785245699937.jpg" alt="Kids' T-Shirts Hover" fill className="object-cover object-top transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Kids&apos; T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>
          </div>

          {/* By Style Row */}
          <p className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-3 sm:mb-4">By Style</p>
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            <Link href="/shop?style=Plain+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/FB_IMG_1785258382145.jpg" alt="Plain T-Shirts" fill className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/FB_IMG_1785258543242.jpg" alt="Plain T-Shirts Hover" fill className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Plain T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>

            <Link href="/shop?style=Printed+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/FB_IMG_1785245628741.jpg" alt="Printed T-Shirts" fill className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/FB_IMG_1785245666744.jpg" alt="Printed T-Shirts Hover" fill className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Printed T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>

            <Link href="/shop?style=Graphic+T-Shirts" className="relative group block aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden">
              <Image src="/Images/tshirts/FB_IMG_1785245536855.jpg" alt="Graphic T-Shirts" fill className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-105" unoptimized />
              <Image src="/Images/tshirts/FB_IMG_1785245539837.jpg" alt="Graphic T-Shirts Hover" fill className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105 absolute inset-0" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-serif mb-1">Graphic T-Shirts</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:text-neutral-300 transition-colors">Shop Now <ArrowRight size={12} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-24 bg-background">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">Featured Drops</h2>
              <p className="text-muted-foreground mt-1 sm:mt-2 text-sm">The most hyped pieces this week.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-muted-foreground transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/product/${product.id}`} className="group flex flex-col h-full cursor-pointer">
                  <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-lg mb-4">
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    
                    {/* Quick Add overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <button className="w-full bg-foreground text-background font-bold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-foreground/90 shadow-xl pointer-events-none">
                        <ShoppingBag size={18} />
                        Quick Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <p className="text-[9px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-0.5 sm:mb-1">{product.category}</p>
                    <h3 className="text-sm sm:text-lg font-bold leading-tight mb-1 sm:mb-2 group-hover:underline underline-offset-4 decoration-2 line-clamp-2">{product.name}</h3>
                    <p className="font-medium mt-auto text-xs sm:text-base">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider border-b-2 border-foreground pb-1">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-xs tracking-[0.2em] uppercase mb-4">
              <Star size={14} className="fill-red-500" />
              CUSTOMER REVIEWS
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">What Our Customers Say</h2>
            <p className="text-neutral-600 font-medium">Real reviews from verified buyers across Sri Lanka</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Review 1 */}
            <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
              <Quote className="text-red-100 w-12 h-12 absolute top-6 left-6 -z-10 group-hover:scale-110 transition-transform" />
              <p className="text-foreground/80 leading-relaxed mb-8 flex-1 relative z-10 pt-2">
                "Ordered the oversized tee and graphic tee — came next day in perfect condition! Amazing packaging and everything felt premium. Will definitely reorder."
              </p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-foreground">Malani A.</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" /> Colombo 07
                  </div>
                </div>
                <div className="flex gap-1 text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
              <Quote className="text-red-100 dark:text-red-950 w-12 h-12 absolute top-6 left-6 -z-10 group-hover:scale-110 transition-transform" />
              <p className="text-foreground/80 leading-relaxed mb-8 flex-1 relative z-10 pt-2">
                "Delivered all the way to Kandy in 3 days with COD. No issues at all. The heavy cotton feels exactly as described — super authentic and high quality!"
              </p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-foreground">Kasun P.</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" /> Kandy
                  </div>
                </div>
                <div className="flex gap-1 text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-background border border-border/50 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
              <Quote className="text-red-100 dark:text-red-950 w-12 h-12 absolute top-6 left-6 -z-10 group-hover:scale-110 transition-transform" />
              <p className="text-foreground/80 leading-relaxed mb-8 flex-1 relative z-10 pt-2">
                "Love the Instagram page updates — I always know what's dropping. Fast delivery and the streetwear fits were fresh. Highly recommend for limited drops."
              </p>
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <h4 className="font-bold text-sm mb-1 text-foreground">Dinesh M.</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" /> Battaramulla
                  </div>
                </div>
                <div className="flex gap-1 text-amber-400">
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                  <Star size={14} className="fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-2 mt-10">
            <div className="w-6 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
            <div className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-neutral-700"></div>
          </div>
        </div>
      </section>

      {/* Trust Strip & Info */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="group flex flex-col items-center p-4 hover:-translate-y-2 transition-transform duration-300 cursor-default">
              <div className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-red-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-pulse"><path d="M5 12l5 5l10 -10"/></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">Premium Quality</h4>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Heavyweight cotton, durable prints, and oversized fits designed to last.</p>
            </div>
            
            <div className="group flex flex-col items-center p-4 pt-8 md:pt-4 hover:-translate-y-2 transition-transform duration-300 cursor-default">
              <div className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-red-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-pulse"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">Cash on Delivery</h4>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Order securely with COD available across all districts in Sri Lanka.</p>
            </div>
            
            <div className="group flex flex-col items-center p-4 pt-8 md:pt-4 hover:-translate-y-2 transition-transform duration-300 cursor-default">
              <div className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-red-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-pulse"><path d="M5 9l2 2l4 -4"/><path d="M19 9l-2 2l-4 -4"/><path d="M2 15h20"/><path d="M12 15v6"/></svg>
              </div>
              <h4 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">Islandwide Shipping</h4>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Fast and reliable delivery right to your doorstep within 2-4 working days.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Styled by You */}
      <section className="py-24 overflow-hidden bg-background">
         <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Styled by You</h2>
            <p className="text-muted-foreground mt-2">Tag @zeal.brand on Instagram to be featured.</p>
         </div>
         
         <div className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory px-4 md:px-8 hide-scrollbar">
            {/* Customer styling photos */}
            {[
              "/Images/tshirts/FB_IMG_1785245637406.jpg",
              "/Images/tshirts/FB_IMG_1785258431654.jpg",
              "/Images/tshirts/FB_IMG_1785245643256.jpg",
              "/Images/tshirts/FB_IMG_1785258441087.jpg",
              "/Images/tshirts/FB_IMG_1785245645421.jpg",
              
            ].map((src, i) => (
              <div key={i} className="relative min-w-[280px] md:min-w-[320px] aspect-[4/5] snap-center rounded-xl overflow-hidden bg-neutral-200">
                <Image
                  src={src}
                  alt="Customer styling"
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase mb-10">
            Need Assistance? We Are Active Daily On Our Socials
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@zeal.brand8"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-[#111111] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 min-w-[220px] justify-center"
            >
              {/* TikTok Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.2 8.2 0 004.79 1.53V7.05a4.85 4.85 0 01-1.02-.36z"/>
              </svg>
              Visit Our TikTok Page
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/94788585588"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-[#25D366] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#1ebe5d] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 min-w-[220px] justify-center"
            >
              {/* WhatsApp Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/people/ZEAL-BRAND/61571829807376/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-[#1877F2] text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-[#0d6ef0] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 min-w-[220px] justify-center"
            >
              {/* Facebook Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Visit Our Facebook Page
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/brand.zeal/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 min-w-[220px] justify-center"
              style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
            >
              {/* Instagram Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Visit Our Instagram
            </a>
          </div>
        </div>
      </section>

      {/* New Arrivals Split Banner */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-[#918c8e] overflow-hidden flex items-center justify-center">
        {/* Left Image */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 md:w-[45%]">
          <Image 
            src="/Images/tshirts/FB_IMG_1785245647629.jpg" 
            alt="New Arrivals Left" 
            fill 
            className="object-cover object-top" 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#918c8e]/20 to-[#918c8e]"></div>
        </div>
        
        {/* Right Image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-[45%]">
          <Image 
            src="/Images/tshirts/FB_IMG_1785245661370.jpg" 
            alt="New Arrivals Right" 
            fill 
            className="object-cover object-top" 
            unoptimized 
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#918c8e]/20 to-[#918c8e]"></div>
          
          {/* Desktop Shop Now Button (Bottom Right) */}
          <div className="hidden md:block absolute bottom-8 right-8 z-30">
            <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-neutral-800 transition-colors shadow-2xl">
              Shop Now <span className="w-1.5 h-1.5 bg-white"></span>
            </Link>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-2xl">
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-[#3d3b3c] uppercase mb-4">
            Just In
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#c0bcb8] uppercase tracking-[0.15em] leading-tight mb-8">
            New Arrivals <br />
            You Need
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#2a2829] mb-4">
            ZEAL BRAND
          </h3>
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[#e6e4e1] uppercase mb-8 md:mb-0">
            New Collection
          </span>
          
          {/* Mobile Shop Now Button */}
          <div className="md:hidden mt-4">
            <Link href="/shop" className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl">
              Shop Now <span className="w-1.5 h-1.5 bg-white"></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
