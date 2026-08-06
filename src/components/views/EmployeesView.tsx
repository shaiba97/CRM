import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Scissors, Award } from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, language, formatCurrency } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'فريق الخياطين والموظفين والعمولات' : 'Tailors & HR Commissions'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'إدارة الخياطين والمصممين، عمولات القطع المنجزة، وساعات الحضور' : 'Manage tailors, designers, piece-rate commissions, and attendance.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((e) => (
          <div key={e.id} className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-2">
            <div className="flex items-center justify-between font-bold border-b border-[#C6A052]/10 pb-2">
              <span className="text-[#F4F1EA] text-sm">{e.name}</span>
              <span className="px-2 py-0.5 rounded bg-[#2A1C14] text-[#C6A052] font-mono">{e.role}</span>
            </div>
            <div className="text-[#A39B94]">{e.phone}</div>
            <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10 font-bold">
              <span className="text-[#A39B94]">{language === 'ar' ? 'العمولة المستحقة:' : 'Commission:'}</span>
              <span className="text-[#C6A052]">{formatCurrency(e.commissionRate * 1000)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
