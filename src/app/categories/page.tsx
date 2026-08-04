"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    title: "Men's T-Shirts",
    subtitle: "Premium men's heavyweight tees and oversized drops.",
    image: "/Images/tshirts/boys%203.jpg",
    hoverImage: "/Images/tshirts/boys5 .jpg",
    badge: "NEW ARRIVALS",
    link: "/shop?main=Men%27s+T-Shirts"
  },
  {
    title: "Women's T-Shirts",
    subtitle: "Sleek fitted silhouettes and vintage graphic designs.",
    image: "/Images/tshirts/FB_IMG_1785245661370.jpg",
    hoverImage: "/Images/tshirts/FB_IMG_1785245647629.jpg",
    badge: "BEST SELLER",
    link: "/shop?main=Women%27s+T-Shirts"
  },
  {
    title: "Kids' T-Shirts",
    subtitle: "Durable and stylish streetwear for the next generation.",
    image: "/Images/tshirts/FB_IMG_1785245691318.jpg",
    hoverImage: "/Images/tshirts/FB_IMG_1785245699937.jpg",
    link: "/shop?main=Kids%27+T-Shirts"
  },
  {
    title: "Plain T-Shirts",
    subtitle: "Clean, minimal basics — the foundation of every wardrobe.",
    image: "/Images/tshirts/FB_IMG_1785245504516.jpg",
    hoverImage: "/Images/tshirts/FB_IMG_1785245506486.jpg",
    badge: "ESSENTIALS",
    link: "/shop?style=Plain+T-Shirts"
  },
  {
    title: "Printed T-Shirts",
    subtitle: "Bold prints and patterns that make a statement.",
    image: "/Images/tshirts/FB_IMG_1785245628741.jpg",
    hoverImage: "/Images/tshirts/FB_IMG_1785245643256.jpg",
    badge: "TRENDING",
    link: "/shop?style=Printed+T-Shirts"
  },
  {
    title: "Graphic T-Shirts",
    subtitle: "Artistic drops with striking visuals and iconic graphics.",
    image: "/Images/tshirts/FB_IMG_1785258431654.jpg",
    hoverImage: "/Images/tshirts/FB_IMG_1785258401349.jpg",
    badge: "CURATED",
    link: "/shop?style=Graphic+T-Shirts"
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center max-w-2xl">
        <span className="text-[10px] sm:text-xs font-bold text-red-500 tracking-[0.2em] uppercase mb-2 block">
          Collections
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif mb-2 sm:mb-4">Our Collections</h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
          Explore carefully selected wardrobes and styles categorized for ease of browsing.
        </p>
      </div>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 pb-16 sm:pb-32 space-y-8 sm:space-y-16">

        {/* By Gender */}
        <div>
          <p className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-3 sm:mb-6">By Gender</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {COLLECTIONS.slice(0, 3).map((collection, idx) => (
              <CollectionCard key={idx} collection={collection} />
            ))}
          </div>
        </div>

        {/* By Style */}
        <div>
          <p className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase mb-3 sm:mb-6">By Style</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {COLLECTIONS.slice(3).map((collection, idx) => (
              <CollectionCard key={idx} collection={collection} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function CollectionCard({ collection }: { collection: typeof COLLECTIONS[0] }) {
  return (
    <Link
      href={collection.link}
      className="group relative block aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-900 border border-border/20 shadow-xl"
    >
      {collection.badge && (
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {collection.badge}
          </span>
        </div>
      )}
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110"
        unoptimized
      />
      <Image
        src={collection.hoverImage}
        alt={`${collection.title} Hover`}
        fill
        className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110 absolute inset-0"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90"></div>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex flex-col justify-end text-white z-10 transition-transform duration-500 group-hover:-translate-y-1">
        <h3 className="text-xl font-serif mb-1">{collection.title}</h3>
        <p className="text-xs text-neutral-300 mb-4 line-clamp-2 pr-4">{collection.subtitle}</p>
        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-white group-hover:text-red-400 transition-colors">
          Explore Collection <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
