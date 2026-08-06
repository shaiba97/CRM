import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Users,
  Scissors,
  Layers,
  Receipt,
  Sparkles,
  ArrowRight,
  Send,
  Plus,
} from 'lucide-react';

interface CommandPaletteOverlayProps {
  onOpenQuickNewOrder: () => void;
  onOpenQuickNewCustomer: () => void;
}

export const CommandPaletteOverlay: React.FC<CommandPaletteOverlayProps> = ({
  onOpenQuickNewOrder,
  onOpenQuickNewCustomer,
}) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    customers,
    tailoringOrders,
    fabricRolls,
    invoices,
    setActiveTab,
    language,
    formatCurrency,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = globalSearchQuery.trim().toLowerCase();

  const matchedCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );

  const matchedOrders = tailoringOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.garmentStyle.toLowerCase().includes(q)
  );

  const matchedFabrics = fabricRolls.filter(
    (f) =>
      f.rollCode.toLowerCase().includes(q) ||
      f.fabricType.toLowerCase().includes(q) ||
      f.color.toLowerCase().includes(q)
  );

  const matchedInvoices = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(q) ||
      i.customerName.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F4F1EA]">
        {/* Search Input Bar */}
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C6A052]" />
          <input
            ref={inputRef}
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم العميل، رقم الهاتف، أودر التفصيل، كود القماش...'
                : 'Search customers, phone, tailoring orders, fabric rolls...'
            }
            className="flex-1 bg-transparent text-sm text-[#F4F1EA] placeholder-[#A39B94] focus:outline-none"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="p-1 text-[#A39B94] hover:text-[#F4F1EA]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-xs bg-[#36261C] border border-[#C6A052]/30 rounded-lg text-[#C6A052] hover:bg-[#422F23]"
          >
            Esc
          </button>
        </div>

        {/* Action Quick Bar */}
        {!q && (
          <div className="p-4 bg-[#2A1C14]/40 border-b border-[#C6A052]/10">
            <div className="text-[11px] font-bold text-[#C6A052] uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ar' ? 'إجراءات سريعة واختصارات' : 'Quick Actions'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => {
                  onOpenQuickNewOrder();
                  setIsSearchOpen(false);
                }}
                className="p-2.5 rounded-xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] text-right flex items-center gap-2"
              >
                <Scissors className="w-4 h-4 text-[#C6A052]" />
                <span>{language === 'ar' ? 'طلب تفصيل جديد' : 'New Order'}</span>
              </button>
              <button
                onClick={() => {
                  onOpenQuickNewCustomer();
                  setIsSearchOpen(false);
                }}
                className="p-2.5 rounded-xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] text-right flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-[#C6A052]" />
                <span>{language === 'ar' ? 'إضافة عميل محتمل' : 'Add Prospect'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('pos');
                  setIsSearchOpen(false);
                }}
                className="p-2.5 rounded-xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] text-right flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#C6A052]" />
                <span>{language === 'ar' ? 'فتح كاشير نقطة البيع' : 'POS Checkout'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {q &&
            matchedCustomers.length === 0 &&
            matchedOrders.length === 0 &&
            matchedFabrics.length === 0 &&
            matchedInvoices.length === 0 && (
              <div className="py-8 text-center text-[#A39B94]">
                {language === 'ar' ? 'لم يتم العثور على نتائج تطابق البحث' : 'No matching records found'}
              </div>
            )}

          {/* Customers Match */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#C6A052] mb-1.5 flex items-center gap-1.5 uppercase">
                <Users className="w-3.5 h-3.5" />
                {language === 'ar' ? 'العملاء وتقييم الذكاء الاصطناعي' : 'Customers'} ({matchedCustomers.length})
              </div>
              <div className="space-y-1">
                {matchedCustomers.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveTab('customers');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 hover:border-[#C6A052] flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-[#F4F1EA] flex items-center gap-2">
                        <span>{c.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            c.leadIntent === 'HOT'
                              ? 'bg-red-950 text-red-300 border border-red-500/40'
                              : c.leadIntent === 'WARM'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          {c.leadIntent} ({c.leadScore}/100)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#A39B94] mt-0.5">
                        {c.phone} | {formatCurrency(c.totalSpent)} | {c.orderCount} {language === 'ar' ? 'طلبات' : 'orders'}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C6A052] rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Match */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#C6A052] mb-1.5 flex items-center gap-1.5 uppercase">
                <Scissors className="w-3.5 h-3.5" />
                {language === 'ar' ? 'طلبات التفصيل والأزياء' : 'Tailoring Orders'} ({matchedOrders.length})
              </div>
              <div className="space-y-1">
                {matchedOrders.slice(0, 4).map((o) => (
                  <div
                    key={o.id}
                    onClick={() => {
                      setActiveTab('tailoring');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 hover:border-[#C6A052] flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-[#F4F1EA] flex items-center gap-2">
                        <span className="text-[#C6A052]">{o.orderNumber}</span>
                        <span>- {o.customerName}</span>
                      </div>
                      <div className="text-[11px] text-[#A39B94] mt-0.5">
                        {o.garmentStyle} | {language === 'ar' ? 'الحالة:' : 'Status:'} {o.status} | {formatCurrency(o.totalAmount)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C6A052] rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fabric Rolls Match */}
          {matchedFabrics.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-[#C6A052] mb-1.5 flex items-center gap-1.5 uppercase">
                <Layers className="w-3.5 h-3.5" />
                {language === 'ar' ? 'كتالوج لفات الأقمشة' : 'Fabric Rolls'} ({matchedFabrics.length})
              </div>
              <div className="space-y-1">
                {matchedFabrics.slice(0, 4).map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setActiveTab('fabric-rolls');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 hover:border-[#C6A052] flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-[#F4F1EA] flex items-center gap-2">
                        <span className="text-[#C6A052] font-mono">{f.rollCode}</span>
                        <span>{f.fabricType}</span>
                      </div>
                      <div className="text-[11px] text-[#A39B94] mt-0.5">
                        {f.color} | {language === 'ar' ? 'المتبقي:' : 'Rem:'} {f.remainingMeters}m | {formatCurrency(f.pricePerMeter)}/m
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#C6A052] rotate-180" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
