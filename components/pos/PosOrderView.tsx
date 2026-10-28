'use client';

import React, { useState } from 'react';
import { Food, Table, OrderItemPack, PortionSize, Menu } from '@/lib/types';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Send,
  Receipt,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface CartItem {
  food: Food;
  portion: PortionSize;
  quantity: number;
  unit_price: number;
}

interface PosOrderViewProps {
  foods: Food[];
  menus: Menu[];
  tables: Table[];
  selectedTable: Table | null;
  onSelectTable: (table: Table) => void;
  onSubmitOrder: (pack: OrderItemPack) => Promise<void>;
  onGenerateInvoiceForTable: (tableId: string) => void;
}

export const PosOrderView: React.FC<PosOrderViewProps> = ({
  foods,
  menus,
  tables,
  selectedTable,
  onSelectTable,
  onSubmitOrder,
  onGenerateInvoiceForTable,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPortionForFood, setSelectedPortionForFood] = useState<Record<string, PortionSize>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const filteredFoods = foods.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getPortion = (foodId: string): PortionSize => {
    return selectedPortionForFood[foodId] || 'M';
  };

  const handleSetPortion = (foodId: string, portion: PortionSize) => {
    setSelectedPortionForFood((prev) => ({ ...prev, [foodId]: portion }));
  };

  const calculateItemPrice = (basePrice: number, portion: PortionSize): number => {
    switch (portion) {
      case 'S':
        return Number((basePrice * 0.8).toFixed(2));
      case 'L':
        return Number((basePrice * 1.3).toFixed(2));
      case 'M':
      default:
        return basePrice;
    }
  };

  const addToCart = (food: Food) => {
    const portion = getPortion(food.food_id);
    const unit_price = calculateItemPrice(food.price, portion);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.food.food_id === food.food_id && item.portion === portion
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { food, portion, quantity: 1, unit_price }];
      }
    });
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const subtotal = Number(cart.reduce((acc, item) => acc + item.unit_price * item.quantity, 0).toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const serviceCharge = Number((subtotal * 0.1).toFixed(2));
  const grandTotal = Number((subtotal + tax + serviceCharge).toFixed(2));

  const handleSendOrder = async () => {
    if (!selectedTable) {
      alert('Please select an active dining table first!');
      return;
    }
    if (cart.length === 0) {
      alert('Your cart is empty! Add at least one food item.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.flatMap((item) =>
        Array.from({ length: item.quantity }).map(() => ({
          food_id: item.food.food_id,
          quantity: item.portion,
          unit_price: item.unit_price,
        }))
      );

      await onSubmitOrder({
        table_id: selectedTable.table_id,
        order_items: orderItems,
      });

      setOrderSuccessMsg(`Order successfully transmitted to Kitchen for Table ${selectedTable.table_number}!`);
      clearCart();
      setTimeout(() => setOrderSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Error submitting order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#f1f5f9] overflow-hidden font-sans">
      {/* Left & Center: Food Catalog & Categories */}
      <div className="flex-1 flex flex-col p-5 lg:p-6 gap-5 overflow-y-auto">
        {/* Table Selector & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase font-mono">Assigned Table:</span>
            <select
              value={selectedTable?.table_id || ''}
              onChange={(e) => {
                const tbl = tables.find((t) => t.table_id === e.target.value);
                if (tbl) onSelectTable(tbl);
              }}
              className="bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>-- Select Dining Table --</option>
              {tables.map((t) => (
                <option key={t.table_id} value={t.table_id}>
                  Table {t.table_number} ({t.number_of_guests} seats) • {t.status || 'AVAILABLE'}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, steak, pasta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'Starters', label: 'Starters & Appetizers' },
            { id: 'Grills', label: 'Steaks & Grills' },
            { id: 'Mains', label: 'Pastas & Mains' },
            { id: 'Beverages', label: 'Beverages & Drinks' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0b57d0] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {orderSuccessMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        {/* Food Items Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredFoods.map((food) => {
            const currentPortion = getPortion(food.food_id);
            const calculatedPrice = calculateItemPrice(food.price, currentPortion);

            return (
              <div
                key={food.food_id}
                className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {food.category || 'Menu Item'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{food.food_id.slice(-4)}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {food.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {food.description || 'Specially prepared dining recipe.'}
                  </p>
                </div>

                {/* S / M / L Portion Selector */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500">Portion Size:</span>
                    <div className="inline-flex rounded-md p-0.5 bg-slate-100 border border-slate-200">
                      {(['S', 'M', 'L'] as PortionSize[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handleSetPortion(food.food_id, p)}
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded transition-colors ${
                            currentPortion === p
                              ? 'bg-white text-blue-600 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add Button */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-sans">
                      <span className="text-xs text-slate-500 mr-0.5">$</span>
                      <span className="text-lg font-bold text-slate-900 font-mono">
                        {calculatedPrice.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(food)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-[#0b57d0] text-blue-700 hover:text-white border border-blue-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Live Order Cart & Bill Ticket */}
      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col justify-between">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider font-mono">
                LIVE ORDER TICKET
              </h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">Dining Table:</span>
            <span className="font-bold text-slate-900 font-mono">
              {selectedTable ? `Table ${selectedTable.table_number.toString().padStart(2, '0')}` : 'None Selected'}
            </span>
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
              <ShoppingBag className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
              <p className="font-medium text-slate-600">Ticket is currently empty.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click &quot;Add&quot; on dishes to populate order lines.
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.food.food_id}-${item.portion}`}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200/90 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 truncate">
                      {item.food.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-blue-700 border border-blue-200 font-mono font-bold">
                      {item.portion}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                    ${item.unit_price.toFixed(2)} × {item.quantity} ={' '}
                    <strong className="text-slate-900">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => updateCartQuantity(index, -1)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-900 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(index, 1)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3 text-xs">
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="text-slate-900 font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (5%):</span>
              <span className="text-slate-900 font-mono">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (10%):</span>
              <span className="text-slate-900 font-mono">${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Estimated Total:</span>
              <span className="text-blue-700 font-mono">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleSendOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-2.5 rounded-lg bg-[#0b57d0] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-2xs transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Send to Kitchen (Go API)'}</span>
            </button>

            {selectedTable?.current_order_id && (
              <button
                onClick={() => onGenerateInvoiceForTable(selectedTable.table_id)}
                className="w-full py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Generate Invoice for Table</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
