"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading products for category:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Format slug to readable category title
  const categoryTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const categoryProducts = products.filter(
    p =>
      (p.category && p.category.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) ||
      (p.mainCategory && p.mainCategory.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) ||
      (p.subCategory && p.subCategory.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) ||
      (p.styleCategory && p.styleCategory.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())
  );

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
