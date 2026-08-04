"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Truck, ArrowRightLeft, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        const found = products.find((p: any) => p.id === resolvedParams.id);
        setProduct(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.image,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The item you're looking for doesn't exist or has been removed.</p>
        <Link href="/shop" className="bg-foreground text-background px-8 py-3 rounded-md font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs md:text-sm font-medium text-muted-foreground mb-6">
        <Link href="/shop" className="hover:text-foreground flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>
        <span className="mx-3">/</span>
        <Link href={`/shop?main=${encodeURIComponent(product.mainCategory || "")}`} className="hover:text-foreground">
          {product.mainCategory || "Category"}
        </Link>
        <span className="mx-3">/</span>
        <span className="text-foreground truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
        {/* Image Gallery */}
        <div className="w-full lg:w-[45%]">
          {/* Main Image */}
          <div className="relative aspect-[4/5] w-full bg-neutral-100 rounded-xl overflow-hidden shadow-sm">
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                  {product.badge}
                </span>
              </div>
            )}
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <div className="mb-6 border-b border-border pb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              {product.mainCategory} {product.subCategory ? `· ${product.subCategory}` : ''}
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-3 leading-none">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-xl md:text-2xl font-medium">Rs. {product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</p>
              )}
            </div>
          </div>

          {/* Size Selector */}
          <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider">Select Size</h3>
              <button className="text-xs underline underline-offset-4 text-muted-foreground hover:text-foreground">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SIZES.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2.5 rounded-md text-sm font-bold transition-all border ${
                    selectedSize === size 
                      ? 'bg-foreground text-background border-foreground shadow-md' 
                      : 'bg-background text-foreground border-border hover:border-foreground'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart — 1 Row on Mobile */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 mb-8">
            <div className="flex items-center justify-between border border-border rounded-md px-2.5 sm:px-3 py-3 w-24 sm:w-28 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm sm:text-base">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 uppercase tracking-wider font-black py-3 px-3 sm:px-6 text-xs sm:text-sm rounded-md transition-all active:scale-[0.98] truncate ${
                product.inStock 
                  ? 'bg-foreground text-background hover:bg-neutral-800 shadow-xl' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {product.inStock ? `Add to Cart — Rs. ${(product.price * quantity).toLocaleString()}` : 'Out of Stock'}
            </button>
          </div>

          {/* Details Accordeon / Sections */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Elevate your streetwear collection with this premium piece. Designed with meticulous attention to detail, this item offers a perfect blend of comfort and bold style. Featuring heavy-duty stitching and high-quality materials, it's built to withstand daily wear while keeping you at the forefront of modern fashion.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Fabric</h4>
                <p className="text-muted-foreground text-xs">100% Premium Material</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Fit</h4>
                <p className="text-muted-foreground text-xs">True to Size / Modern Fit</p>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
              <Truck size={18} className="text-muted-foreground shrink-0" />
              <span className="whitespace-nowrap">Islandwide Delivery</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
              <ArrowRightLeft size={18} className="text-muted-foreground shrink-0" />
              <span className="whitespace-nowrap">7-Day Exchanges</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
              <ShieldCheck size={18} className="text-muted-foreground shrink-0" />
              <span className="whitespace-nowrap">Cash on Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
