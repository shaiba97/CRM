import React from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, PackageCheck, Plus } from 'lucide-react';

export const PurchasingView: React.FC = () => {
  const { suppliers, language, formatCurrency } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'أوامر المشتريات واستلام الأقمشة' : 'Purchase Orders & Goods Receipt'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'متابعة الشحنات القادمة من المصانع، بوالص الشحن، وإدخال المستودع' : 'Track incoming textile shipments, waybills, and warehouse check-in.'}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 space-y-3">
        <h2 className="font-bold text-sm text-[#C6A052]">{language === 'ar' ? 'أمر شراء نشط رقم: PO-2026-081' : 'Active Purchase Order: PO-2026-081'}</h2>
        <p className="text-[#A39B94]">{language === 'ar' ? 'المورد: مصنع الكشمير البريطاني | الشحنة المتوقعة: 12 أغسطس 2026' : 'Supplier: British Cashmere Mills'}</p>
        <div className="font-bold text-[#C6A052]">{formatCurrency(145000)}</div>
      </div>
    </div>
  );
};
