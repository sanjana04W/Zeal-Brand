"use client";

import { useCartStore } from "@/lib/store";
import { X, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
              <button 
                onClick={closeCart}
                className="bg-foreground text-background px-6 py-3 font-bold uppercase rounded-md hover:bg-neutral-800"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-border pb-6 last:border-0">
                  <div className="relative w-20 h-24 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm leading-tight line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-border rounded">
                        <button 
                          className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-background space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold text-lg">Rs. {getCartTotal().toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping and COD fees calculated at checkout.</p>
            <Link
              href="/cart"
              onClick={closeCart}
              className="w-full border border-neutral-300 text-foreground py-3 rounded-md uppercase tracking-widest font-bold hover:bg-neutral-100 transition-colors flex justify-center items-center text-sm"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-foreground text-background py-4 rounded-md uppercase tracking-widest font-black hover:bg-neutral-800 transition-colors flex justify-center items-center"
            >
              Checkout Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
