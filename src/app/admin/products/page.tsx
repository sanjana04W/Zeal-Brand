"use client";

import { Search, Plus, Edit, Trash2, X, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// Subcategory options based on selected Main Category
const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  "Men's T-Shirts": [
    "Basic T-Shirts",
    "Graphic T-Shirts",
    "Oversized T-Shirts",
  ],
  "Women's T-Shirts": [
    "Basic T-Shirts",
    "Crop Tops",
    "Oversized T-Shirts",
    "Graphic T-Shirts",
    "Fitted T-Shirts",
  ],
  "Kids' T-Shirts": [
    "Boys' T-Shirts",
    "Girls' T-Shirts",
    "Cartoon T-Shirts",
    "Printed T-Shirts",
  ],
};

const STYLE_CATEGORIES = [
  "Plain T-Shirts",
  "Printed T-Shirts",
  "Graphic T-Shirts",
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    mainCategory: "Men's T-Shirts",
    subCategory: "Basic T-Shirts",
    styleCategory: "Graphic T-Shirts",
    inStock: true,
    image: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Open Edit Modal ──
  const handleEditClick = (product: any) => {
    setEditingProduct({
      ...product,
      inStock: product.inStock !== undefined ? product.inStock : true,
      subCategory: product.subCategory || "Basic T-Shirts",
      styleCategory: product.styleCategory || "Graphic T-Shirts",
    });
    setSaveSuccess(false);
  };

  // ── Save Edited Product ──
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editingProduct.name,
          price: Number(editingProduct.price),
          mainCategory: editingProduct.mainCategory,
          subCategory: editingProduct.subCategory,
          styleCategory: editingProduct.styleCategory,
          category: editingProduct.subCategory || editingProduct.mainCategory,
          inStock: Boolean(editingProduct.inStock),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        fetchProducts();
        setTimeout(() => {
          setEditingProduct(null);
          setSaveSuccess(false);
        }, 1200);
      }
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Add New Product ──
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          mainCategory: newProduct.mainCategory,
          subCategory: newProduct.subCategory,
          styleCategory: newProduct.styleCategory,
          inStock: newProduct.inStock,
          image: newProduct.image || "/Images/tshirts/bow1.jpg",
        }),
      });

      if (res.ok) {
        setAddSuccess(true);
        fetchProducts();
        setTimeout(() => {
          setIsAddOpen(false);
          setAddSuccess(false);
          setNewProduct({
            name: "",
            price: "",
            mainCategory: "Men's T-Shirts",
            subCategory: "Basic T-Shirts",
            styleCategory: "Graphic T-Shirts",
            inStock: true,
            image: "",
          });
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to add product", err);
    } finally {
      setIsAdding(false);
    }
  };

  // ── Delete Product ──
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
        setDeletingId(null);
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.mainCategory && p.mainCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.styleCategory && p.styleCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 relative">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your catalog, pricing, and stock levels.</p>
        </div>
        <button
          onClick={() => {
            setIsAddOpen(true);
            setAddSuccess(false);
          }}
          className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl uppercase tracking-widest text-xs font-black hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products by name, category or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-xs font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-neutral-400 uppercase font-extrabold tracking-widest bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4">PRODUCT</th>
                  <th className="px-6 py-4">CATEGORY</th>
                  <th className="px-6 py-4">STYLE</th>
                  <th className="px-6 py-4">PRICE</th>
                  <th className="px-6 py-4">STOCK</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 shadow-2xs">
                          <Image
                            src={product.image || "/Images/tshirts/bow1.jpg"}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <p className="font-bold line-clamp-2 max-w-[200px] text-neutral-900 text-xs">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-neutral-800">{product.mainCategory}</p>
                      <span className="text-[11px] font-semibold text-neutral-400">{product.subCategory}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-700">
                      {product.styleCategory || "—"}
                    </td>
                    <td className="px-6 py-4 font-black text-neutral-900 text-sm">
                      Rs. {Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-extrabold ${!product.inStock ? "text-red-600" : "text-neutral-700"}`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {product.inStock ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all inline-flex"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingId(String(product.id))}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all inline-flex ml-1"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── EDIT PRODUCT MODAL ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="text-base font-black uppercase tracking-tight text-neutral-900">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Main Category
                  </label>
                  <select
                    value={editingProduct.mainCategory}
                    onChange={(e) => {
                      const newMain = e.target.value;
                      const subOptions = SUB_CATEGORIES_MAP[newMain] || [];
                      setEditingProduct({
                        ...editingProduct,
                        mainCategory: newMain,
                        subCategory: subOptions[0] || "Basic T-Shirts",
                      });
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="Men's T-Shirts">Men's T-Shirts</option>
                    <option value="Women's T-Shirts">Women's T-Shirts</option>
                    <option value="Kids' T-Shirts">Kids' T-Shirts</option>
                  </select>
                </div>
              </div>

              {/* Sub Category & Style Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Sub Category
                  </label>
                  <select
                    value={editingProduct.subCategory}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    {(SUB_CATEGORIES_MAP[editingProduct.mainCategory] || [
                      "Basic T-Shirts",
                      "Graphic T-Shirts",
                      "Oversized T-Shirts",
                    ]).map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Style Category
                  </label>
                  <select
                    value={editingProduct.styleCategory || "Graphic T-Shirts"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, styleCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    {STYLE_CATEGORIES.map((styleCat) => (
                      <option key={styleCat} value={styleCat}>
                        {styleCat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock & Status Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Stock Availability
                  </label>
                  <select
                    value={editingProduct.inStock ? "true" : "false"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        inStock: e.target.value === "true",
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Catalog Status
                  </label>
                  <select
                    value={editingProduct.inStock ? "Active" : "Archived"}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        inStock: e.target.value === "Active",
                      })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-3 rounded-2xl text-xs font-extrabold text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || saveSuccess}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 ${
                    saveSuccess ? "bg-emerald-600" : "bg-neutral-900 hover:bg-black"
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Saved
                    </>
                  ) : isSaving ? (
                    "Saving..."
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="text-base font-black uppercase tracking-tight text-neutral-900">Add New Product</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oversized Graphic Street Tee"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="4290"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Main Category *
                  </label>
                  <select
                    value={newProduct.mainCategory}
                    onChange={(e) => {
                      const main = e.target.value;
                      const subs = SUB_CATEGORIES_MAP[main] || [];
                      setNewProduct({
                        ...newProduct,
                        mainCategory: main,
                        subCategory: subs[0] || "Basic T-Shirts",
                      });
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="Men's T-Shirts">Men's T-Shirts</option>
                    <option value="Women's T-Shirts">Women's T-Shirts</option>
                    <option value="Kids' T-Shirts">Kids' T-Shirts</option>
                  </select>
                </div>
              </div>

              {/* Sub Category & Style Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Sub Category *
                  </label>
                  <select
                    value={newProduct.subCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    {(SUB_CATEGORIES_MAP[newProduct.mainCategory] || [
                      "Basic T-Shirts",
                      "Graphic T-Shirts",
                      "Oversized T-Shirts",
                    ]).map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Style Category *
                  </label>
                  <select
                    value={newProduct.styleCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, styleCategory: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    {STYLE_CATEGORIES.map((styleCat) => (
                      <option key={styleCat} value={styleCat}>
                        {styleCat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="/Images/tshirts/bow1.jpg"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
                    Stock Availability
                  </label>
                  <select
                    value={newProduct.inStock ? "true" : "false"}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, inStock: e.target.value === "true" })
                    }
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  >
                    <option value="true">In Stock (Active)</option>
                    <option value="false">Out of Stock (Archived)</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-3 rounded-2xl text-xs font-extrabold text-neutral-500 hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || addSuccess}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 ${
                    addSuccess ? "bg-emerald-600" : "bg-neutral-900 hover:bg-black"
                  }`}
                >
                  {addSuccess ? (
                    <>
                      <CheckCircle2 size={16} /> Created!
                    </>
                  ) : isAdding ? (
                    "Adding..."
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black text-neutral-900 mb-1">Delete Product?</h3>
            <p className="text-xs text-neutral-500 font-semibold mb-6">
              Are you sure you want to delete this product? This will permanently remove it from your website.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-neutral-200 rounded-2xl text-xs font-black text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deletingId)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black transition-all shadow-md"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
