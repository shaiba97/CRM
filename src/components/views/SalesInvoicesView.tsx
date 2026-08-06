import React from 'react';
import { useApp } from '../../context/AppContext';
import { Receipt, Printer, CheckCircle2 } from 'lucide-react';

export const SalesInvoicesView: React.FC = () => {
  const { invoices, language, formatCurrency } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Receipt className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'سجل المبيعات والفواتير الصادرة' : 'Sales & Issued Invoices'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'فواتير الكاشير، إيصالات العربون، وحركة المبيعات' : 'Cashier receipts, deposit slips, and transaction logs.'}
        </p>
      </div>

      <div className="rounded-2xl bg-[#36261C] border border-[#C6A052]/20 overflow-hidden shadow">
        <table className="w-full text-right">
          <thead className="bg-[#2A1C14] text-[#A39B94] border-b border-[#C6A052]/10">
            <tr>
              <th className="p-3">{language === 'ar' ? 'رقم الفاتورة' : 'Invoice #'}</th>
              <th className="p-3">{language === 'ar' ? 'العميل' : 'Customer'}</th>
              <th className="p-3">{language === 'ar' ? 'طريقة الدفع' : 'Payment'}</th>
              <th className="p-3">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th className="p-3">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C6A052]/10 text-[#F4F1EA]">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-[#2A1C14]/60">
                <td className="p-3 font-mono font-bold text-[#C6A052]">{inv.invoiceNumber}</td>
                <td className="p-3 font-bold">{inv.customerName}</td>
                <td className="p-3 text-[#A39B94]">{inv.paymentMethod}</td>
                <td className="p-3 text-[#A39B94]">{inv.issuedAt}</td>
                <td className="p-3 font-bold text-[#C6A052]">{formatCurrency(inv.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
