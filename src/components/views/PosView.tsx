import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Wallet,
  DollarSign,
  Receipt,
  Check,
  Search,
  Sparkles,
  Printer,
} from 'lucide-react';

export const PosView: React.FC = () => {
  const {
    posCart,
    addToPosCart,
    updatePosCartQty,
    removeFromPosCart,
    clearPosCart,
    fabricRolls,
    customers,
    completePosCheckout,
    language,
    formatCurrency,
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'BANK_TRANSFER'>('CASH');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [completedInvoice, setCompletedInvoice] = useState<any | null>(null);

  const subtotal = posCart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (posCart.length === 0) return;

    const inv = completePosCheckout(
      selectedCustomerId || undefined,
      paymentMethod,
      discountAmount
    );

    setCompletedInvoice(inv);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'نقطة البيع السريعة (Touchscreen POS)' : 'Point of Sale (POS)'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar'
            ? 'كاشير مباشر لمبيعات الأقمشة بالمتر، الإكسسوارات، والتحصيل الفوري'
            : 'Fast cashier checkout for fabric meterage, accessories, and instant invoices.'}
        </p>
      </div>

      {/* POS Layout: Left Catalog (2 cols) & Right Cart & Keypad (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Catalog Selection Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#C6A052]">
              {language === 'ar' ? 'كتالوج المنتجات والأقمشة المتاحة' : 'Available Fabrics & Products'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fabricRolls.map((f) => (
              <div
                key={f.id}
                onClick={() =>
                  addToPosCart({
                    id: f.id,
                    name: `${f.fabricType} - ${f.color}`,
                    type: 'FABRIC_METER',
                    unitPrice: f.pricePerMeter,
                    quantity: 3.5, // default 3.5 meters for a garment
                  })
                }
                className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] cursor-pointer transition-all shadow hover:shadow-xl space-y-2"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#C6A052] font-mono">{f.rollCode}</span>
                  <span className="text-green-400">{f.remainingMeters}m rem</span>
                </div>
                <div className="font-bold text-[#F4F1EA] text-sm">{f.fabricType}</div>
                <div className="text-[11px] text-[#A39B94]">{f.color}</div>
                <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10">
                  <span className="text-[#A39B94]">{language === 'ar' ? 'سعر المتر:' : 'Price/m:'}</span>
                  <span className="font-bold text-[#C6A052]">{formatCurrency(f.pricePerMeter)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout Panel */}
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-3">
              <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                <span>{language === 'ar' ? 'سلة المشتريات والتحصيل' : 'Checkout Cart'}</span>
              </h2>
              {posCart.length > 0 && (
                <button
                  onClick={clearPosCart}
                  className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{language === 'ar' ? 'تفريغ' : 'Clear'}</span>
                </button>
              )}
            </div>

            {/* Customer selector for POS */}
            <div>
              <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'ربط بعميل (اختياري)' : 'Customer (Optional)'}</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2 text-[#F4F1EA]"
              >
                <option value="">{language === 'ar' ? '-- عميل نقدي مباشر --' : '-- Walk-in Cash Customer --'}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="max-h-52 overflow-y-auto space-y-2">
              {posCart.length === 0 ? (
                <div className="py-8 text-center text-[#A39B94] italic">
                  {language === 'ar' ? 'السلة فارغة - انقر على الأقمشة لإضافتها' : 'Cart is empty'}
                </div>
              ) : (
                posCart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#F4F1EA]">{item.name}</span>
                      <button onClick={() => removeFromPosCart(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updatePosCartQty(item.id, Math.max(0.5, item.quantity - 0.5))}
                          className="p-1 bg-[#36261C] rounded border border-[#C6A052]/30 text-[#C6A052]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-[#C6A052]">{item.quantity}</span>
                        <button
                          onClick={() => updatePosCartQty(item.id, item.quantity + 0.5)}
                          className="p-1 bg-[#36261C] rounded border border-[#C6A052]/30 text-[#C6A052]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-[#F4F1EA]">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="space-y-3 border-t border-[#C6A052]/20 pt-3">
            {/* Payment Method Tiles */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 rounded-xl font-bold border flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#C6A052] text-[#2A1C14] border-[#C6A052]'
                    : 'bg-[#2A1C14] text-[#A39B94] border-[#C6A052]/20'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-[10px]">{language === 'ar' ? 'نقداً' : 'Cash'}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`py-2 rounded-xl font-bold border flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'CARD'
                    ? 'bg-[#C6A052] text-[#2A1C14] border-[#C6A052]'
                    : 'bg-[#2A1C14] text-[#A39B94] border-[#C6A052]/20'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px]">{language === 'ar' ? 'بطاقة' : 'Card'}</span>
              </button>
              <button
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`py-2 rounded-xl font-bold border flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'bg-[#C6A052] text-[#2A1C14] border-[#C6A052]'
                    : 'bg-[#2A1C14] text-[#A39B94] border-[#C6A052]/20'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[10px]">{language === 'ar' ? 'بنكك/محفظة' : 'Bank'}</span>
              </button>
            </div>

            {/* Total calculation display */}
            <div className="p-3 bg-[#2A1C14] rounded-xl space-y-1 font-bold">
              <div className="flex justify-between text-[#A39B94]">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base text-[#C6A052] border-t border-[#C6A052]/20 pt-1">
                <span>{language === 'ar' ? 'الإجمالي النهائي:' : 'Total:'}</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={posCart.length === 0}
              className="w-full py-3 bg-[#C6A052] text-[#2A1C14] font-bold rounded-xl text-sm shadow-xl hover:bg-[#C6A052]/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{language === 'ar' ? 'دفع وإصدار الفاتورة' : 'Pay & Complete'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Complete Receipt Popup */}
      {completedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white text-black p-6 rounded-2xl space-y-4 shadow-2xl printable-area">
            <div className="text-center border-b pb-3 flex flex-col items-center">
              <Logo variant="print" mode="light" className="justify-center mb-1" />
              <p className="text-xs font-bold text-gray-700 mt-1">فاتورة بيع مباشرة - {completedInvoice.invoiceNumber}</p>
              <p className="text-[10px] text-gray-500">{completedInvoice.issuedAt}</p>
            </div>

            <div className="text-xs space-y-2">
              <div className="font-bold border-b pb-1">العميل: {completedInvoice.customerName}</div>
              <div className="space-y-1">
                {completedInvoice.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.description} x{it.quantity}</span>
                    <span>{formatCurrency(it.total)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-sm">
                <span>الإجمالي:</span>
                <span>{formatCurrency(completedInvoice.total)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 no-print">
              <button
                onClick={() => setCompletedInvoice(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-[#C6A052] text-black font-bold rounded-lg text-xs flex items-center gap-1"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الفاتورة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
