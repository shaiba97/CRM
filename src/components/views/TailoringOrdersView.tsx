import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import { Scissors, Plus, Search, Filter, Printer, Check, Clock, ChevronDown } from 'lucide-react';
import { OrderStatus, TailoringOrder } from '../../types';

interface TailoringOrdersViewProps {
  onOpenNewOrder: () => void;
}

export const TailoringOrdersView: React.FC<TailoringOrdersViewProps> = ({ onOpenNewOrder }) => {
  const {
    tailoringOrders,
    updateOrderStatus,
    language,
    formatCurrency,
    formatNumber,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [activePrintOrder, setActivePrintOrder] = useState<TailoringOrder | null>(null);

  const filteredOrders = tailoringOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.garmentStyle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'ALL' || o.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const STATUSES: { key: OrderStatus; labelAr: string; labelEn: string }[] = [
    { key: 'NEW', labelAr: 'جديد', labelEn: 'New' },
    { key: 'FITTING', labelAr: 'ملاءمة وقياس', labelEn: 'Fitting' },
    { key: 'CUTTING', labelAr: 'قص القماش', labelEn: 'Cutting' },
    { key: 'SEWING', labelAr: 'خياطة وتطريز', labelEn: 'Sewing' },
    { key: 'QC', labelAr: 'فحص الجودة', labelEn: 'QC' },
    { key: 'READY', labelAr: 'جاهز للتسليم', labelEn: 'Ready' },
    { key: 'DELIVERED', labelAr: 'تم التسليم', labelEn: 'Delivered' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <Scissors className="w-5 h-5 text-[#C6A052]" />
            <span>{language === 'ar' ? 'طلبات التفصيل والأزياء الملكية' : 'Tailoring & Custom Garments'}</span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'متابعة كافة طلبات التفصيل، تخصيص الخياطين، تسديد العربون والمبالغ المتبقية'
              : 'Track custom tailoring orders, tailor assignments, deposits and balances.'}
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="px-4 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'ar' ? 'طلب تفصيل جديد' : 'New Order'}</span>
        </button>
      </div>

      {/* Toolbar & Filter Chips */}
      <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#C6A052] absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث برقم الأودر، اسم العميل، النمط...' : 'Search order #, customer name...'}
            className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl pr-9 pl-3 py-2 text-[#F4F1EA]"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
              selectedStatusFilter === 'ALL'
                ? 'bg-[#C6A052] text-[#2A1C14]'
                : 'bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          {STATUSES.map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap ${
                selectedStatusFilter === st.key
                  ? 'bg-[#C6A052] text-[#2A1C14]'
                  : 'bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]'
              }`}
            >
              {language === 'ar' ? st.labelAr : st.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] transition-all shadow-md space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-2">
                <span className="font-mono text-sm font-bold text-[#C6A052]">{ord.orderNumber}</span>
                <div className="relative group">
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                    className="bg-[#2A1C14] border border-[#C6A052]/40 rounded-lg px-2.5 py-1 text-[10px] text-[#C6A052] font-bold uppercase cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {language === 'ar' ? s.labelAr : s.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#F4F1EA]">{ord.customerName}</h3>
                <p className="text-[11px] text-[#A39B94]">{ord.customerPhone}</p>
              </div>

              <div className="p-3 bg-[#2A1C14] border border-[#C6A052]/20 rounded-xl space-y-1">
                <div className="font-semibold text-[#C6A052]">{ord.garmentStyle}</div>
                <div className="text-[11px] text-[#A39B94]">
                  {language === 'ar' ? 'القماش:' : 'Fabric:'} <span className="text-[#F4F1EA]">{ord.fabricName || 'صوف إيطالي'}</span> ({ord.metersUsed || 3.5}m)
                </div>
                <div className="text-[11px] text-[#A39B94]">
                  {language === 'ar' ? 'الخياط:' : 'Tailor:'} <span className="text-[#F4F1EA]">{ord.assignedTailorName}</span>
                </div>
              </div>

              {ord.notes && (
                <p className="text-[11px] text-[#A39B94] italic bg-[#2A1C14]/50 p-2 rounded-lg">
                  "{ord.notes}"
                </p>
              )}
            </div>

            {/* Financials & Delivery Date */}
            <div className="space-y-2 pt-3 border-t border-[#C6A052]/10">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A39B94]">{language === 'ar' ? 'تاريخ التسليم:' : 'Due Date:'}</span>
                <span className="font-bold text-[#F4F1EA]">{ord.dueDate}</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <div>
                  <span className="text-[#A39B94]">{language === 'ar' ? 'المبلغ الإجمالي:' : 'Total:'} </span>
                  <span className="text-[#C6A052]">{formatCurrency(ord.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-[#A39B94]">{language === 'ar' ? 'المتبقي:' : 'Due:'} </span>
                  <span className={ord.balanceDue > 0 ? 'text-amber-400' : 'text-green-400'}>
                    {formatCurrency(ord.balanceDue)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActivePrintOrder(ord)}
                className="w-full py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-[#C6A052] hover:bg-[#422F23] flex items-center justify-center gap-1.5 transition-colors font-semibold text-xs mt-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'طباعة كرت التفصيل والإيصال' : 'Print Job Order Card'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Job Order Modal */}
      {activePrintOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white text-black p-6 rounded-2xl space-y-4 shadow-2xl printable-area">
            <div className="text-center border-b pb-3 flex flex-col items-center">
              <Logo variant="print" mode="light" className="justify-center mb-1" />
              <p className="text-xs font-bold text-gray-700 mt-1">كرت الأوردر وفاتورة العربون - {activePrintOrder.orderNumber}</p>
            </div>

            <div className="text-xs space-y-1">
              <div><strong>اسم العميل:</strong> {activePrintOrder.customerName}</div>
              <div><strong>الهاتف:</strong> {activePrintOrder.customerPhone}</div>
              <div><strong>النمط المطلوب:</strong> {activePrintOrder.garmentStyle}</div>
              <div><strong>القماش والمترية:</strong> {activePrintOrder.fabricName} ({activePrintOrder.metersUsed} متر)</div>
              <div><strong>الخياط المسؤول:</strong> {activePrintOrder.assignedTailorName}</div>
              <div><strong>تاريخ التسليم:</strong> {activePrintOrder.dueDate}</div>
            </div>

            <div className="border-t pt-2 text-xs flex justify-between font-bold">
              <span>الإجمالي: {formatCurrency(activePrintOrder.totalAmount)}</span>
              <span>المدفوع: {formatCurrency(activePrintOrder.depositPaid)}</span>
              <span>المتبقي: {formatCurrency(activePrintOrder.balanceDue)}</span>
            </div>

            <div className="flex justify-end gap-2 pt-4 no-print">
              <button
                onClick={() => setActivePrintOrder(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-[#C6A052] text-black font-bold rounded-lg text-xs flex items-center gap-1"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الان</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
