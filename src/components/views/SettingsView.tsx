import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Languages,
  DollarSign,
  Sparkles,
  Building2,
  FileText,
  Save,
  Plus,
  Receipt,
  Store,
  ShieldCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    numeralStyle,
    setNumeralStyle,
    activeTenant,
    tenants = [],
    switchTenant,
    updateTenant,
    setIsNewTenantModalOpen,
  } = useApp();

  const [nameAr, setNameAr] = useState(activeTenant?.nameAr || '');
  const [nameEn, setNameEn] = useState(activeTenant?.nameEn || '');
  const [ownerName, setOwnerName] = useState(activeTenant?.ownerName || '');
  const [ownerPhone, setOwnerPhone] = useState(activeTenant?.ownerPhone || '');
  const [crNumber, setCrNumber] = useState(activeTenant?.crNumber || '');
  const [taxRatePct, setTaxRatePct] = useState(activeTenant?.taxRatePct || 15);
  const [currencySymbol, setCurrencySymbol] = useState(activeTenant?.currencySymbol || 'ج.س');
  const [currencyCode, setCurrencyCode] = useState(activeTenant?.currencyCode || 'SDG');
  const [receiptHeaderAr, setReceiptHeaderAr] = useState(activeTenant?.receiptHeaderAr || '');
  const [receiptFooterAr, setReceiptFooterAr] = useState(activeTenant?.receiptFooterAr || '');

  useEffect(() => {
    if (activeTenant) {
      setNameAr(activeTenant.nameAr || '');
      setNameEn(activeTenant.nameEn || '');
      setOwnerName(activeTenant.ownerName || '');
      setOwnerPhone(activeTenant.ownerPhone || '');
      setCrNumber(activeTenant.crNumber || '');
      setTaxRatePct(activeTenant.taxRatePct || 15);
      setCurrencySymbol(activeTenant.currencySymbol || 'ج.س');
      setCurrencyCode(activeTenant.currencyCode || 'SDG');
      setReceiptHeaderAr(activeTenant.receiptHeaderAr || '');
      setReceiptFooterAr(activeTenant.receiptFooterAr || '');
    }
  }, [activeTenant]);

  const handleSaveTenantSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant) return;

    updateTenant(activeTenant.id, {
      nameAr,
      nameEn,
      ownerName,
      ownerPhone,
      crNumber,
      taxRatePct,
      currencySymbol,
      currencyCode,
      receiptHeaderAr,
      receiptFooterAr,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs text-[#F4F1EA]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#F4F1EA] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#C6A052]" />
            <span>
              {language === 'ar'
                ? 'إعدادات دار الخياطة وتخصيص العلامة التجارية (Multi-Tenant SaaS Settings)'
                : 'Tailor Shop SaaS Settings & Branding'}
            </span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'تخصيص بيانات دار الخياطة النشطة، العملة، الهيدر المطبوع للفواتير، وخيارات العرض'
              : 'Customize active tailor shop details, currency, invoice header, and display preferences.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTenantModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A052] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-[#2A1C14] font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === 'ar'
              ? 'تسجيل دار خياطة جديدة (+ Tenant)'
              : 'Register New Shop Enterprise'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Tenant Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveTenantSettings}
            className="p-6 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C6A052]" />
                <h2 className="font-extrabold text-sm text-[#C6A052]">
                  {language === 'ar'
                    ? `إعدادات المؤسسة النشطة: ${activeTenant?.nameAr}`
                    : `Active Enterprise: ${activeTenant?.nameEn}`}
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#C6A052]/20 text-[#C6A052] font-bold text-[10px]">
                {activeTenant?.subscriptionPlan}
              </span>
            </div>

            {/* Shop Brand Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'اسم المشغل / دار الخياطة (بالعربي)' : 'Shop Name (Arabic)'}
                </label>
                <input
                  type="text"
                  required
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
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>

            {/* Owner & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'اسم مالك دار الخياطة' : 'Owner Name'}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'رقم الهاتف للتواصل والواتساب' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="text"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>

            {/* Currency, VAT & CR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'رمز العملة الرسمية' : 'Official Currency'}
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
                  <option value="ج.س">جنيه سوداني (ج.س / SDG)</option>
                  <option value="ر.س">ريال سعودي (ر.س / SAR)</option>
                  <option value="د.إ">درهم إماراتي (د.إ / AED)</option>
                  <option value="ر.ع">ريال عماني (ر.ع / OMR)</option>
                  <option value="ر.ق">ريال قطري (ر.ق / QAR)</option>
                  <option value="$">دولار أمريكي ($ / USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#A39B94] mb-1 font-medium">
                  {language === 'ar' ? 'نسبة الضريبة (VAT %)' : 'VAT % Rate'}
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
                  {language === 'ar' ? 'رقم السجل التجاري / CR' : 'CR / Tax ID'}
                </label>
                <input
                  type="text"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>

            {/* Receipt Header & Footer Text */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-[#C6A052] flex items-center gap-1.5 border-b border-[#C6A052]/10 pb-1">
                <Receipt className="w-4 h-4" />
                <span>{language === 'ar' ? 'نصوص الترويسة والتذييل على فاتورة POS' : 'POS Invoice Header & Footer'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A39B94] mb-1 font-medium">
                    {language === 'ar' ? 'ترويسة الفاتورة (Header Text)' : 'Invoice Header'}
                  </label>
                  <input
                    type="text"
                    value={receiptHeaderAr}
                    onChange={(e) => setReceiptHeaderAr(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>

                <div>
                  <label className="block text-[#A39B94] mb-1 font-medium">
                    {language === 'ar' ? 'تذييل الفاتورة (Footer Text)' : 'Invoice Footer'}
                  </label>
                  <input
                    type="text"
                    value={receiptFooterAr}
                    onChange={(e) => setReceiptFooterAr(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl px-3 py-2 text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C6A052]/20 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C6A052] hover:bg-amber-500 text-[#2A1C14] font-black flex items-center gap-2 shadow transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'ar' ? 'حفظ إعدادات دار الخياطة' : 'Save Shop Profile'}</span>
              </button>
            </div>
          </form>

          {/* Regional & System Options */}
          <div className="p-6 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-4">
            <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <span>{language === 'ar' ? 'خيارات اللغة والعرض' : 'Language & Display Preferences'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-[#2A1C14] rounded-xl border border-[#C6A052]/10">
                <span>{language === 'ar' ? 'لغة واجهة النظام' : 'UI Language'}</span>
                <button
                  onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                  className="px-3 py-1.5 bg-[#C6A052] text-[#2A1C14] font-bold rounded-lg"
                >
                  {language === 'ar' ? 'العربية (Arabic)' : 'English'}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#2A1C14] rounded-xl border border-[#C6A052]/10">
                <span>{language === 'ar' ? 'نمط الأرقام (١٢٣٤٥٦٧٨٩٠)' : 'Arabic Numerals Style'}</span>
                <button
                  onClick={() => setNumeralStyle(numeralStyle === 'ar' ? 'en' : 'ar')}
                  className="px-3 py-1.5 bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] font-bold rounded-lg hover:border-[#C6A052]"
                >
                  {numeralStyle === 'ar' ? 'شرقية (١٢٣)' : 'Western (123)'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Registered Shops List & Switcher */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-2">
              <h2 className="font-bold text-sm text-[#F4F1EA] flex items-center gap-2">
                <Store className="w-4 h-4 text-[#C6A052]" />
                <span>{language === 'ar' ? 'دور الخياطة المسجلة لدينا' : 'Registered Tailor Shops'}</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6A052]/20 text-[#C6A052] font-bold">
                {tenants.length} {language === 'ar' ? 'مؤسسات' : 'Tenants'}
              </span>
            </div>

            <div className="space-y-2.5">
              {tenants.map((tenant) => {
                const isSelected = tenant.id === activeTenant?.id;
                return (
                  <div
                    key={tenant.id}
                    onClick={() => switchTenant(tenant.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A1C14] border-[#C6A052] shadow-md'
                        : 'bg-[#2A1C14]/50 border-[#C6A052]/20 hover:border-[#C6A052]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-[#C6A052] text-[#2A1C14]'
                              : 'bg-[#36261C] text-[#C6A052] border border-[#C6A052]/30'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-[#F4F1EA]">
                            {language === 'ar' ? tenant.nameAr : tenant.nameEn}
                          </div>
                          <div className="text-[10px] text-[#A39B94]">
                            {tenant.ownerName} • <span className="text-[#C6A052] font-bold">{tenant.currencySymbol}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>نشط الان</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#C6A052] underline font-medium">
                          انتقال
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsNewTenantModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#2A1C14] hover:bg-[#2A1C14]/80 border border-[#C6A052]/40 text-[#C6A052] font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة دار خياطة جديدة (+ Tenant)' : 'Register New Tenant'}</span>
            </button>
          </div>

          {/* AI Status Banner */}
          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-2">
            <h3 className="font-bold text-xs text-[#C6A052] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C6A052]" />
              <span>{language === 'ar' ? 'مساحة عمل الذكاء الاصطناعي معزولة' : 'Isolated AI Cloud Engine'}</span>
            </h3>
            <p className="text-[11px] text-[#A39B94] leading-relaxed">
              {language === 'ar'
                ? 'تتم معالجة قياسات العملاء وتقييمات الرغبات بشكل آمن ومستقل لكل دار خياطة عبر Gemini API دون مشاركة البيانات بين المؤسسات.'
                : 'Customer measurements and lead calculations are isolated per tailor tenant via Gemini API.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
