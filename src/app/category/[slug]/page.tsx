"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { Filter, ChevronDown } from "lucide-react";

// Reusing mock data for structure
const PRODUCTS = [
  { id: "1", name: "Oversized 'Acid Wash' Graphic Tee", price: 4500, image: "/Images/tshirts/FB_IMG_1785245490163.jpg", category: "oversized", badge: "NEW DROP" },
  { id: "6", name: "Box Fit Heavy Cotton - Olive", price: 3800, image: "/Images/tshirts/FB_IMG_1785245492198.jpg", category: "oversized" },
  { id: "2", name: "Classic Logo Premium Tee - Black", price: 3200, image: "/Images/tshirts/FB_IMG_1785245498132.jpg", category: "graphic-tees" },
  { id: "5", name: "Cyberpunk Edition Graphic Print", price: 4200, image: "/Images/tshirts/FB_IMG_1785245500425.jpg", category: "graphic-tees" },
  { id: "4", name: "Essential Heavyweight Tee - White", price: 3500, image: "/Images/tshirts/FB_IMG_1785245502582.jpg", category: "basic-tees" },
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  // Format slug to readable category title
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryProducts = PRODUCTS.filter(p => p.category === slug);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-border gap-6">
        <div>
          <nav className="text-sm font-medium text-muted-foreground mb-4">
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{categoryTitle}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{categoryTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Filter size={18} />
            <span className="font-medium">Filter</span>
          </button>
          <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <span className="font-medium">Sort By: Newest</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Grid */}
        <div className="flex-1">
          {categoryProducts.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">We don't have any items in this category yet.</p>
              <Link href="/shop" className="bg-foreground text-background px-6 py-3 font-bold uppercase rounded hover:bg-neutral-800">Browse All</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
              {categoryProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col cursor-pointer">
                  <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden rounded-lg mb-4">
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-foreground text-background text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                          {product.badge}
                        </span>
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{categoryTitle}</p>
                    <h3 className="text-lg font-bold leading-tight mb-2 group-hover:underline underline-offset-4 decoration-2">{product.name}</h3>
                    <p className="font-medium mt-auto">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
