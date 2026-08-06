import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Phone, Mail, MapPin, DollarSign } from 'lucide-react';

export const SuppliersView: React.FC = () => {
  const { suppliers, language, formatCurrency } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C6A052]" />
            <span>{language === 'ar' ? 'سجل الموردين ومصانع الغزل' : 'Suppliers & Mills Registry'}</span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar' ? 'متابعة مصانع الأقمشة، الذمم الدائنة، وأوامر توريد الغزل' : 'Manage textile mills, payables, and fabric purchase orders.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-3">
            <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-2">
              <span className="font-bold text-sm text-[#F4F1EA]">{s.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2A1C14] text-[#C6A052] font-mono">{s.country}</span>
            </div>

            <div className="space-y-1 text-[#A39B94]">
              <div>{language === 'ar' ? 'مسؤول الاتصال:' : 'Contact:'} <span className="text-[#F4F1EA]">{s.contactPerson}</span></div>
              <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#C6A052]" /><span>{s.phone}</span></div>
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#C6A052]" /><span>{s.email}</span></div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10 font-bold">
              <span className="text-[#A39B94]">{language === 'ar' ? 'الذمم الدائنة للمورد:' : 'Balance Payable:'}</span>
              <span className={s.balancePayable > 0 ? 'text-amber-400' : 'text-green-400'}>{formatCurrency(s.balancePayable)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
