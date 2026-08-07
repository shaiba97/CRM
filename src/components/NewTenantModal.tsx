import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { X, Building2, ShieldCheck, Sparkles, Plus, CreditCard, DollarSign } from 'lucide-react';

export const NewTenantModal: React.FC = () => {
  const {
    language,
    isNewTenantModalOpen,
    setIsNewTenantModalOpen,
    addTenant,
  } = useApp();

  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('ر.س');
  const [currencyCode, setCurrencyCode] = useState('SAR');
  const [taxRatePct, setTaxRatePct] = useState<number>(15);
  const [addressAr, setAddressAr] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'PRO_SAAS' | 'ENTERPRISE' | 'STARTER'>('PRO_SAAS');

  if (!isNewTenantModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !ownerName || !ownerPhone) return;

    addTenant({
      nameAr,
      nameEn: nameEn || nameAr,
      ownerName,
      ownerEmail: ownerEmail || `${ownerName.replace(/\s+/g, '').toLowerCase()}@tailorapp.com`,
      ownerPhone,
      crNumber: crNumber || `CR-${Math.floor(100000 + Math.random() * 900000)}`,
      taxRatePct,
      currencySymbol,
      currencyCode,
      addressAr: addressAr || 'المقر الرئيسي للمؤسسة',
      addressEn: 'Main Enterprise Showroom & Workshop',
      subscriptionPlan,
      activeBranchesCount: 1,
      receiptHeaderAr: `ترحبو بكم ${nameAr} - أفضل الخامات ودقة التثبيت`,
      receiptFooterAr: 'شكراً لزيارتكم - نتطلع لملاقاتكم دائماً',
    });

    setIsNewTenantModalOpen(false);
    // Reset
    setNameAr('');
    setNameEn('');
    setOwnerName('');
    setOwnerPhone('');
    setOwnerEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn text-xs text-[#F4F1EA]">
      <div className="relative w-full max-w-2xl bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#2A1C14] border-b border-[#C6A052]/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo variant="full" size="sm" mode="dark" />
            <div>
              <h2 className="text-base font-extrabold text-[#F4F1EA] flex items-center gap-2">
                <span>
                  {language === 'ar'
                    ? 'تسجيل وإضافة دار خياطة جديدة'
                    : 'Register New Tailor Shop Enterprise'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  Multi-Tenant SaaS
                </span>
              </h2>
              <p className="text-[11px] text-[#A39B94]">
                {language === 'ar'
                  ? 'إنشاء مساحة عمل مستقلة بالكامل لدار خياطة مع تخصيص العملة والضريبة تحت مظلة نظام كوفادو'
                  : 'Create an isolated cloud workspace with custom currency, VAT, and branch config under Kofado.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewTenantModalOpen(false)}
            className="p-1.5 rounded-lg text-[#A39B94] hover:text-[#F4F1EA] hover:bg-[#C6A052]/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Section 1: Shop Enterprise Names */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-[#C6A052] border-b border-[#C6A052]/20 pb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C6A052]" />
              <span>{language === 'ar' ? '1. بيانات دار الخياطة والمؤسسة' : '1. Tailor Shop Branding'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'اسم دار الخياطة (بالعربي) *' : 'Shop Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: دار الشموخ للخياطة الرفيعة"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'اسم المشغل (بالإنجليزية)' : 'Shop Name (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Al-Shamookh Bespoke House"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Owner Contact Info */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-xs text-[#C6A052] border-b border-[#C6A052]/20 pb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C6A052]" />
              <span>{language === 'ar' ? '2. بيانات مالك المشغل / الحساب' : '2. Owner & Contact Info'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'اسم مالك الدار *' : 'Owner Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="الشيخ / الأستاذ..."
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="+966 50... / +249..."
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Owner Email'}
                </label>
                <input
                  type="email"
                  placeholder="owner@tailor.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Currency, VAT, CR & Region */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-xs text-[#C6A052] border-b border-[#C6A052]/20 pb-1 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#C6A052]" />
              <span>{language === 'ar' ? '3. إعدادات العملة والضريبة والسجل التجاري' : '3. Currency, VAT & Regional Config'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'رمز العملة' : 'Currency Symbol'}
                </label>
                <select
                  value={currencySymbol}
                  onChange={(e) => {
                    const sym = e.target.value;
                    setCurrencySymbol(sym);
                    if (sym === 'ر.س') setCurrencyCode('SAR');
                    else if (sym === 'ج.س') setCurrencyCode('SDG');
                    else if (sym === 'د.إ') setCurrencyCode('AED');
                    else if (sym === 'ر.ع') setCurrencyCode('OMR');
                    else if (sym === 'ر.ق') setCurrencyCode('QAR');
                    else setCurrencyCode('USD');
                  }}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                >
                  <option value="ر.س">ريال سعودي (ر.س)</option>
                  <option value="ج.س">جنيه سوداني (ج.س)</option>
                  <option value="د.إ">درهم إماراتي (د.إ)</option>
                  <option value="ر.ع">ريال عماني (ر.ع)</option>
                  <option value="ر.ق">ريال قطري (ر.ق)</option>
                  <option value="$">دولار أمريكي ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'نسبة الضريبة (VAT %)' : 'VAT Rate %'}
                </label>
                <input
                  type="number"
                  value={taxRatePct}
                  onChange={(e) => setTaxRatePct(Number(e.target.value))}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'رقم السجل التجاري / الضريبي' : 'CR / Tax ID'}
                </label>
                <input
                  type="text"
                  placeholder="1010XXXXXX"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'خطة الاشتراك' : 'SaaS Plan'}
                </label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                >
                  <option value="PRO_SAAS">Pro SaaS (حتى 5 فروع)</option>
                  <option value="ENTERPRISE">Enterprise (فروع غير محدودة)</option>
                  <option value="STARTER">Starter (فرع واحد)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#A39B94] mb-1 font-medium">
                {language === 'ar' ? 'عنوان المعرض / الورشة الرئيسية' : 'Showroom / Address'}
              </label>
              <input
                type="text"
                placeholder="المدينة - الحي - الشارع الرئيسي..."
                value={addressAr}
                onChange={(e) => setAddressAr(e.target.value)}
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#C6A052]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewTenantModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#2A1C14] hover:bg-[#2A1C14]/80 text-[#A39B94] font-bold border border-[#C6A052]/20 transition-all"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#C6A052] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-[#2A1C14] font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>
                {language === 'ar' ? 'تأكيد تسجيل الدار والبدء' : 'Create & Switch Workspace'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
