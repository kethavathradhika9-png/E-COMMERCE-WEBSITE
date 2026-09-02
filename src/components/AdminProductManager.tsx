import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';
import { IProduct } from '../types.js';
import {
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Package,
  CheckCircle,
  X
} from 'lucide-react';

export const AdminProductManager: React.FC = () => {
  const { products, categories, refreshProducts, addToast } = useApp();
  const [filterCat, setFilterCat] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Laptops & Computing',
    brand: '',
    price: 1000,
    originalPrice: 1200,
    stock: 50,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    processor: 'Intel Core Ultra 7',
    ram: '16GB LPDDR5X',
    storage: '512GB NVMe SSD'
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Laptops & Computing',
      brand: '',
      price: 1000,
      originalPrice: 1200,
      stock: 50,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      processor: 'Intel Core Ultra 7',
      ram: '16GB LPDDR5X',
      storage: '512GB NVMe SSD'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: IProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      stock: p.stock,
      description: p.description,
      imageUrl: p.images[0] || '',
      processor: p.specifications['Processor'] || '',
      ram: p.specifications['RAM'] || '',
      storage: p.specifications['Storage'] || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from inventory?`)) return;
    try {
      await api.deleteProduct(id);
      await refreshProducts();
      addToast({ type: 'success', title: 'Product Deleted', message: `${name} has been removed from catalog.` });
    } catch (e) {
      addToast({ type: 'error', title: 'Delete Failed', message: 'Could not delete product.' });
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          brand: formData.brand,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice),
          stock: Number(formData.stock),
          description: formData.description,
          images: [formData.imageUrl],
          specifications: {
            ...editingProduct.specifications,
            'Processor': formData.processor,
            'RAM': formData.ram,
            'Storage': formData.storage
          }
        });
        addToast({ type: 'success', title: 'Inventory Updated', message: `${formData.name} updated successfully.` });
      } else {
        await api.createProduct({
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          category: formData.category,
          brand: formData.brand,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice),
          rating: 4.8,
          reviewCount: 1,
          stock: Number(formData.stock),
          images: [formData.imageUrl],
          description: formData.description,
          specifications: {
            'Processor': formData.processor,
            'RAM': formData.ram,
            'Storage': formData.storage
          },
          badges: ['New Launch'],
          tags: ['hardware', 'gadget']
        });
        addToast({ type: 'success', title: 'Product Created', message: `${formData.name} added to catalog.` });
      }
      setIsModalOpen(false);
      await refreshProducts();
    } catch (e) {
      addToast({ type: 'error', title: 'Save Failed', message: 'Could not save product details.' });
    }
  };

  const filteredProducts = filterCat === 'All'
    ? products
    : filterCat === 'LowStock'
    ? products.filter(p => p.stock <= 10)
    : products.filter(p => p.category === filterCat);

  return (
    <div id="admin-product-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
              <span>Inventory & Product Catalog Operations</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-400">
              Admin Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time warehouse stock synchronization, dynamic pricing override, and hardware specification curation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshProducts}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Hardware</span>
          </button>
        </div>
      </div>

      {/* Category & Stock Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilterCat('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            filterCat === 'All' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 border border-white/10 text-slate-400'
          }`}
        >
          All Items ({products.length})
        </button>

        <button
          onClick={() => setFilterCat('LowStock')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
            filterCat === 'LowStock' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900 border border-white/10 text-rose-400'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Low Stock Alert ({products.filter(p => p.stock <= 10).length})</span>
        </button>

        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              filterCat === c.name ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 border border-white/10 text-slate-400'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="border border-white/10 rounded-2xl bg-slate-950 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/80 font-mono text-slate-400 uppercase text-[11px]">
              <th className="p-4">Product & Category</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price (INR)</th>
              <th className="p-4">Current Inventory</th>
              <th className="p-4">Rating</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={(p.images && p.images[0]) || ''} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-900 p-1" referrerPolicy="no-referrer" />
                  <div>
                    <div className="font-semibold text-slate-200">{p.name}</div>
                    <div className="text-[11px] font-mono text-sky-400">{p.category}</div>
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-300">{p.brand}</td>
                <td className="p-4 font-mono font-bold text-slate-100">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="p-4 font-mono">
                  {p.stock <= 5 ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      {p.stock} Units (CRITICAL)
                    </span>
                  ) : p.stock <= 15 ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                      {p.stock} Units (LOW)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {p.stock} Units (OPTIMAL)
                    </span>
                  )}
                </td>
                <td className="p-4 font-mono text-amber-400">
                  ⭐ {p.rating} ({p.reviewCount})
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-sky-950 text-slate-400 hover:text-sky-400 border border-white/10"
                    title="Edit specs & inventory"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-white/10"
                    title="Delete product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-100">
                {editingProduct ? `Edit Hardware: ${editingProduct.name}` : 'Add New Hardware to Catalog'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Image URL (Unsplash or CDN)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Processor / Core</label>
                  <input
                    type="text"
                    value={formData.processor}
                    onChange={e => setFormData({ ...formData, processor: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Memory / RAM</label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={e => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-400 mb-1">Storage</label>
                  <input
                    type="text"
                    value={formData.storage}
                    onChange={e => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                >
                  Save Hardware Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
