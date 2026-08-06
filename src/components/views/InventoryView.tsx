import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Plus, Search, Tag } from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { products, language, formatCurrency, formatNumber } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'المخزون العام والإكسسوارات' : 'General Products & Accessories'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'الأزرار الفاخرة، الأكمام الكبك، بطانات الصوف، وخيوط التطريز' : 'Buttons, cuff links, linings, and embroidery threads.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-3">
            <div className="flex items-center justify-between font-bold border-b border-[#C6A052]/10 pb-2">
              <span className="text-[#F4F1EA] text-sm">{p.name}</span>
              <span className="font-mono text-[#C6A052] text-[11px]">{p.sku}</span>
            </div>

            <div className="text-[#A39B94]">{language === 'ar' ? 'التصنيف:' : 'Category:'} <span className="text-[#F4F1EA]">{p.category}</span></div>

            <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10">
              <div>
                <span className="text-[#A39B94]">{language === 'ar' ? 'المتوفر بالمستودع:' : 'Stock:'} </span>
                <span className="font-bold text-[#C6A052]">{formatNumber(p.stockQuantity)}</span>
              </div>
              <div className="font-bold text-[#F4F1EA] text-sm">
                {formatCurrency(p.unitPrice)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
