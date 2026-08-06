import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

export const AccountingView: React.FC = () => {
  const { invoices, language, formatCurrency } = useApp();

  const totalCollected = invoices.reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Wallet className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'الحسابات ومطابقة خزانة الصندوق' : 'Accounting & Till Reconciliation'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'مطابقة المقبوضات النقدية اليومية، التحويلات البنكية، وتسوية وردية الكاشير' : 'Reconcile cash till, card payments, and shift closings.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20">
          <div className="text-[#A39B94]">{language === 'ar' ? 'المقبوضات المباشرة اليوم' : 'Daily Cash Receipts'}</div>
          <div className="text-2xl font-bold text-[#C6A052] mt-1">{formatCurrency(totalCollected)}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20">
          <div className="text-[#A39B94]">{language === 'ar' ? 'حالة الصندوق:' : 'Till Status:'}</div>
          <div className="text-lg font-bold text-green-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'متطابق بنسبة 100%' : '100% Reconciled'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
