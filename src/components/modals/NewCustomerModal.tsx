import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Sparkles, Check } from 'lucide-react';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewCustomerModal: React.FC<NewCustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomer, calculateAILeadScore, language, activeBranchId } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredFabric, setPreferredFabric] = useState('صوف إيطالي فاخر 150s');
  const [tagsInput, setTagsInput] = useState('عميل محتمل، عروض أقمشة');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const tags = tagsInput
      .split('،')
      .flatMap((t) => t.split(','))
      .map((t) => t.trim())
      .filter(Boolean);

    const newCust = addCustomer({
      name,
      phone,
      email: email || `${phone.replace(/\s+/g, '')}@example.com`,
      leadScore: 50,
      leadIntent: 'WARM',
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: 'N/A',
      emailOpens: 1,
      emailClicks: 0,
      measurementTaken: false,
      preferredFabric,
      tags,
      notes,
      branchId: activeBranchId,
    });

    // Automatically trigger AI lead scoring calculation
    calculateAILeadScore(newCust.id);

    setName('');
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl overflow-hidden text-[#F4F1EA]">
        {/* Header */}
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#C6A052]/20 text-[#C6A052]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#C6A052]">
                {language === 'ar' ? 'إضافة عميل محتمل جديد (CRM)' : 'New Customer & Prospect'}
              </h2>
              <p className="text-[11px] text-[#A39B94]">
                {language === 'ar' ? 'سيتم تشغيل خوارزمية التقييم والاحتساب الآلي فور الإضافة' : 'Automated AI lead scoring will trigger upon creation'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#422F23] text-[#A39B94] hover:text-[#F4F1EA]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#C6A052] mb-1">
              {language === 'ar' ? 'الاسم الثلاثي أو الشرفي' : 'Full Name'} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: عبد الله بن أحمد الفاضل' : 'e.g. Abdallah Ahmed'}
              className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#C6A052] mb-1">
                {language === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'} *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+249 91 234 5678"
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#C6A052] mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#C6A052] mb-1">
              {language === 'ar' ? 'نوع القماش المفضل / الاستفسار الأولي' : 'Preferred Fabric Interest'}
            </label>
            <select
              value={preferredFabric}
              onChange={(e) => setPreferredFabric(e.target.value)}
              className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
            >
              <option value="صوف إيطالي فاخر 150s">Super 150s Italian Wool (صوف إيطالي فاخر)</option>
              <option value="قطن ياباني حريري">Japanese Cotton Silk (قطن ياباني حريري)</option>
              <option value="كشمير بريطاني صلب">British Cashmere (كشمير بريطاني)</option>
              <option value="كتان هولندي خفيف">Linen Supreme (كتان هولندي ممتازة)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#C6A052] mb-1">
              {language === 'ar' ? 'وسوم التصنيف (مفصولة بفواصل)' : 'Tags / Categories'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="مثال: أطباء، بدل رسمية، عروض الصيف"
              className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#C6A052] mb-1">
              {language === 'ar' ? 'ملاحظات وتفاصيل التفاعل' : 'Initial Interaction Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ar' ? 'ملاحظات حول طلبات القياس الخاصة...' : 'Initial notes...'}
              className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-[#F4F1EA] hover:bg-[#422F23]"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold rounded-xl hover:bg-[#C6A052]/90 flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              {language === 'ar' ? 'حفظ وحساب التقييم' : 'Save & Score Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
