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
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        const found = products.find((p: any) => String(p.id) === String(resolvedParams.id));
        if (found) {
          setProduct(found);
          const sizeStock = found.sizeStock || { S: true, M: true, L: true, XL: true, XXL: true };
          const firstAvailable = SIZES.find((s) => sizeStock[s] !== false) || "L";
          setSelectedSize(firstAvailable);

          // Strictly match same mainCategory + subCategory (prevents cross-gender mixing).
          // Show 2–4 products; hide section entirely if fewer than 2 matches.
          const related = products
            .filter(
              (p: any) =>
                p.mainCategory === found.mainCategory &&
                p.subCategory === found.subCategory &&
                String(p.id) !== String(found.id)
            )
            .slice(0, 4);

          setRelatedProducts(related.length >= 2 ? related : []);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const sizeStock = product?.sizeStock || { S: true, M: true, L: true, XL: true, XXL: true };
  const isSelectedSizeAvailable = Boolean(product?.inStock !== false && sizeStock[selectedSize] !== false);
  const isAnySizeAvailable = Boolean(product?.inStock !== false && SIZES.some((s) => sizeStock[s] !== false));

  const handleAddToCart = () => {
    if (!product || !isSelectedSizeAvailable) return;
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
              {SIZES.map((size) => {
                const isAvailable = Boolean(product.inStock !== false && sizeStock[size] !== false);
                const isSelected = selectedSize === size;

                return (
                  <button 
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSize(size)}
                    className={`relative py-3 rounded-xl text-sm font-bold transition-all border flex flex-col items-center justify-center ${
                      !isAvailable
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60'
                        : isSelected 
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900 ring-offset-1' 
                        : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <span className={!isAvailable ? "line-through text-neutral-400" : ""}>{size}</span>
                    {!isAvailable && (
                      <span className="text-[8px] font-black uppercase text-red-500 tracking-tighter mt-0.5 whitespace-nowrap">
                        Out of Stock
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Size Stock Guidance Notice */}
            <div className="mt-3 text-xs font-semibold">
              {!isAnySizeAvailable ? (
                <p className="text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  All sizes are temporarily out of stock for this product.
                </p>
              ) : !isSelectedSizeAvailable ? (
                <p className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                  Size {selectedSize} is Temporarily Out of Stock. Please choose another available size.
                </p>
              ) : (
                <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Size {selectedSize} is In Stock — Ready for Islandwide Dispatch
                </p>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart — 1 Row on Mobile */}
          <div className="flex flex-row items-center gap-2 sm:gap-3 mb-8">
            <div className="flex items-center justify-between border border-border rounded-md px-2.5 sm:px-3 py-3 w-24 sm:w-28 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                disabled={quantity <= 1 || !isSelectedSizeAvailable}
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm sm:text-base">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                disabled={!isSelectedSizeAvailable}
              >
                <Plus size={14} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!isSelectedSizeAvailable}
              className={`flex-1 uppercase tracking-wider font-black py-3.5 px-3 sm:px-6 text-xs sm:text-sm rounded-xl transition-all active:scale-[0.98] truncate ${
                isSelectedSizeAvailable 
                  ? 'bg-neutral-900 text-white hover:bg-black shadow-xl cursor-pointer' 
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
              }`}
            >
              {isSelectedSizeAvailable
                ? `Add to Cart — Rs. ${(product.price * quantity).toLocaleString()}`
                : !isAnySizeAvailable
                ? "All Sizes Out of Stock"
                : `Size ${selectedSize} Temporarily Out of Stock`}
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

      {/* Related Products: You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24 pt-12 border-t border-border">
          <h2 className="text-xl sm:text-2xl font-serif text-foreground mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <Link
                href={`/product/${p.id}`}
                key={p.id}
                className="group flex flex-col cursor-pointer border border-border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                  {p.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        {p.badge}
                      </span>
                    </div>
                  )}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <div className="flex flex-col flex-1 p-3">
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-0.5 truncate">
                    {p.mainCategory}
                  </p>
                  <h3 className="text-[11px] sm:text-xs font-medium leading-tight mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="mt-auto flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-foreground text-xs">Rs. {p.price.toLocaleString()}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        Rs. {p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
