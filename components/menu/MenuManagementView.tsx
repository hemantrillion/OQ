'use client';

import React, { useState } from 'react';
import { Food, Menu } from '@/lib/types';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Tag,
  Search,
} from 'lucide-react';

interface MenuManagementViewProps {
  foods: Food[];
  menus: Menu[];
  onAddFood: (food: Partial<Food>) => Promise<void>;
  onUpdateFoodPrice: (foodId: string, newPrice: number) => Promise<void>;
  onAddMenu: (menu: Partial<Menu>) => Promise<void>;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  foods,
  menus,
  onAddFood,
  onUpdateFoodPrice,
  onAddMenu,
}) => {
  const [selectedMenuId, setSelectedMenuId] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState<number>(24);
  const [newFoodMenuId, setNewFoodMenuId] = useState(menus[0]?.menu_id || '');
  const [newFoodDesc, setNewFoodDesc] = useState('');

  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuCategory, setNewMenuCategory] = useState('');

  const filteredFoods = foods.filter((f) => {
    const matchesMenu = selectedMenuId === 'ALL' || f.menu_id === selectedMenuId;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesMenu && matchesSearch;
  });

  const handleAddFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodMenuId) return;

    await onAddFood({
      name: newFoodName,
      price: Number(newFoodPrice),
      menu_id: newFoodMenuId,
      food_image: 'icon-default',
      description: newFoodDesc,
    });

    setIsAddFoodOpen(false);
    setNewFoodName('');
    setNewFoodDesc('');
  };

  const handleAddMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !newMenuCategory) return;

    await onAddMenu({
      name: newMenuName,
      category: newMenuCategory,
    });

    setIsAddMenuOpen(false);
    setNewMenuName('');
    setNewMenuCategory('');
  };

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Top Banner & Control Ribbon matching NEW PROJECT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-blue-600" />
            <span>Food Catalog & Menu Categories Directory</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized with Go Gin endpoints: <code className="text-blue-700 font-mono">/foods</code> and <code className="text-blue-700 font-mono">/menus</code>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAddMenuOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Create Menu Category</span>
          </button>

          <button
            onClick={() => setIsAddFoodOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Food Item</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedMenuId('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedMenuId === 'ALL'
              ? 'bg-[#0b57d0] text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          All Items ({foods.length})
        </button>

        {menus.map((m) => {
          const count = foods.filter((f) => f.menu_id === m.menu_id).length;
          return (
            <button
              key={m.menu_id}
              onClick={() => setSelectedMenuId(m.menu_id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedMenuId === m.menu_id
                  ? 'bg-[#0b57d0] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{m.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Foods Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFoods.map((food) => {
          const parentMenu = menus.find((m) => m.menu_id === food.menu_id);

          return (
            <div
              key={food.food_id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {parentMenu?.name || 'Menu Item'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: #{food.food_id.slice(-4)}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {food.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {food.description || 'Quality culinary recipe prepared fresh daily.'}
                </p>
              </div>

              {/* Price & Fast Inline Price Editor */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 mr-0.5">$</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {food.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    const pricePrompt = prompt('Enter new retail unit price ($):', food.price.toString());
                    if (pricePrompt && !isNaN(Number(pricePrompt))) {
                      onUpdateFoodPrice(food.food_id, Number(pricePrompt));
                    }
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-slate-500" />
                  <span>Update Price</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {isAddFoodOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Add Food Item (Go POST /foods)</span>
            </h3>

            <form onSubmit={handleAddFoodSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dish Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Caesar Salad"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Parent Menu Category:
                </label>
                <select
                  value={newFoodMenuId}
                  onChange={(e) => setNewFoodMenuId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  {menus.map((m) => (
                    <option key={m.menu_id} value={m.menu_id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Base Retail Price ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.5"
                  value={newFoodPrice}
                  onChange={(e) => setNewFoodPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation details, and flavors..."
                  value={newFoodDesc}
                  onChange={(e) => setNewFoodDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddFoodOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Create Food Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Menu Category Modal */}
      {isAddMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Create Menu Category (Go POST /menus)</span>
            </h3>

            <form onSubmit={handleAddMenuSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Menu Display Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood & Raw Bar"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Category Tag:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood, Dessert, Wine"
                  value={newMenuCategory}
                  onChange={(e) => setNewMenuCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Category in DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
