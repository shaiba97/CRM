import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Plus,
  Sparkles,
  Phone,
  Mail,
  Ruler,
  Scissors,
  Send,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag,
  Calendar,
  Eye,
  Check,
} from 'lucide-react';
import { Customer } from '../../types';

interface CustomersViewProps {
  onOpenNewCustomer: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onOpenNewCustomer }) => {
  const {
    customers,
    emailLogs,
    measurements,
    calculateAILeadScore,
    sendCustomerCommunication,
    language,
    formatCurrency,
    formatNumber,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // Message Generator Modal State
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [commType, setCommType] = useState<'EMAIL' | 'WHATSAPP'>('WHATSAPP');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [isGeneratingMsg, setIsGeneratingMsg] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIntent = selectedIntentFilter === 'ALL' || c.leadIntent === selectedIntentFilter;

    return matchesSearch && matchesIntent;
  });

  const activeLogs = emailLogs.filter((l) => l.customerId === selectedCustomer?.id);
  const activeMeasurement = measurements.find((m) => m.customerId === selectedCustomer?.id);

  // Trigger Gemini AI Drafter
  const handleGenerateAIMessage = async () => {
    if (!selectedCustomer) return;
    setIsGeneratingMsg(true);

    try {
      const res = await fetch('/api/ai/draft-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: selectedCustomer.name,
          messageType: 'FITTING_REMINDER',
          garmentType: selectedCustomer.preferredFabric || 'ثوب إماراتي فاخر',
          orderStatus: 'في مرحلة القص والتجربة',
          fabricType: selectedCustomer.preferredFabric,
          language: language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMsgSubject(data.subject || 'تذكير بموعد القياس وتجربة الثوب');
        setMsgBody(data.body || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingMsg(false);
    }
  };

  const handleSendCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    sendCustomerCommunication(selectedCustomer.id, commType, msgSubject, msgBody);
    setShowMessageModal(false);
    setMsgSubject('');
    setMsgBody('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C6A052]" />
            <span>{language === 'ar' ? 'إدارة العملاء وتقييم الذكاء الاصطناعي (CRM)' : 'Customer CRM & AI Scoring'}</span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'تتبع ملفات العملاء، حساب التقييم الآلي، سجل البريد والواتساب، وملفات القياسات'
              : 'Track customer profiles, automated AI lead scores, email/WhatsApp logs, and measurements.'}
          </p>
        </div>

        <button
          onClick={onOpenNewCustomer}
          className="px-4 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'ar' ? 'إضافة عميل جديد' : 'New Customer'}</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Field */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#C6A052] absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، الهاتف، الوسم...' : 'Search by name, phone, tag...'}
            className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl pr-9 pl-3 py-2 text-xs text-[#F4F1EA] placeholder-[#A39B94] focus:outline-none focus:border-[#C6A052]"
          />
        </div>

        {/* Intent Filters Chips */}
        <div className="flex items-center gap-2 text-xs w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[#A39B94] font-semibold">{language === 'ar' ? 'تصنيف التقييم:' : 'Filter Score:'}</span>
          {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedIntentFilter(filter)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                selectedIntentFilter === filter
                  ? 'bg-[#C6A052] text-[#2A1C14]'
                  : 'bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]'
              }`}
            >
              {filter === 'ALL'
                ? language === 'ar'
                  ? 'الكل'
                  : 'All'
                : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Table (Left) & Customer Detail Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table View */}
        <div className="lg:col-span-2 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md overflow-hidden">
          <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
            <span className="font-bold text-xs text-[#C6A052]">
              {language === 'ar' ? 'قائمة العملاء المسجلين' : 'Customer Registry'} ({formatNumber(filteredCustomers.length)})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#2A1C14]/60 text-[#A39B94] uppercase border-b border-[#C6A052]/10">
                <tr>
                  <th className="p-3">{language === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="p-3">{language === 'ar' ? 'التقييم الآلي' : 'AI Score'}</th>
                  <th className="p-3">{language === 'ar' ? 'الإنفاق' : 'Spent'}</th>
                  <th className="p-3">{language === 'ar' ? 'تفاعل البريد' : 'Email Eng.'}</th>
                  <th className="p-3">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C6A052]/10 text-[#F4F1EA]">
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#422F23] font-semibold' : 'hover:bg-[#2A1C14]/70'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-[#F4F1EA]">{cust.name}</div>
                        <div className="text-[11px] text-[#A39B94]">{cust.phone}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            cust.leadIntent === 'HOT'
                              ? 'bg-red-950 text-red-300 border border-red-500/30'
                              : cust.leadIntent === 'WARM'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          {cust.leadScore}/100 ({cust.leadIntent})
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#C6A052]">
                        {formatCurrency(cust.totalSpent)}
                      </td>
                      <td className="p-3 text-[11px] text-[#A39B94]">
                        {cust.emailOpens} {language === 'ar' ? 'فتح' : 'opens'}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            calculateAILeadScore(cust.id);
                          }}
                          className="px-2.5 py-1 bg-[#2A1C14] border border-[#C6A052]/40 rounded-lg text-[10px] text-[#C6A052] hover:bg-[#C6A052] hover:text-[#2A1C14] transition-colors flex items-center gap-1"
                          title={language === 'ar' ? 'إعادة حساب التقييم' : 'Recalculate AI Score'}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{language === 'ar' ? 'تقييم الذكاء' : 'Score'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Customer Details & AI Interaction Drawer */}
        {selectedCustomer ? (
          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/30 shadow-xl space-y-5 text-xs">
            {/* Header profile info */}
            <div className="border-b border-[#C6A052]/20 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-[#2A1C14] text-[#C6A052]">
                  ID: {selectedCustomer.id}
                </span>
                <span
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    selectedCustomer.leadIntent === 'HOT'
                      ? 'bg-red-950 text-red-300 border border-red-500/40'
                      : selectedCustomer.leadIntent === 'WARM'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {selectedCustomer.leadScore}/100 - {selectedCustomer.leadIntent}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#F4F1EA]">{selectedCustomer.name}</h2>
              <div className="space-y-1 text-[#A39B94]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C6A052]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C6A052]" />
                  <span>{selectedCustomer.email}</span>
                </div>
              </div>
            </div>

            {/* AI Action Quick Launcher */}
            <div className="p-3 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl space-y-2">
              <div className="font-bold text-[#C6A052] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {language === 'ar' ? 'مولد التواصل بالذكاء الاصطناعي' : 'AI Communication Generator'}
                </span>
              </div>
              <p className="text-[11px] text-[#A39B94]">
                {language === 'ar'
                  ? 'صياغة وتتبع رسالة بريد أو واتساب مخصصة بحسب نوع القماش المفضل ودرجة التقييم.'
                  : 'Draft personalized email/WhatsApp message based on customer lead profile.'}
              </p>
              <button
                onClick={() => {
                  setShowMessageModal(true);
                  handleGenerateAIMessage();
                }}
                className="w-full py-2 bg-[#C6A052] text-[#2A1C14] font-bold rounded-lg hover:bg-[#C6A052]/90 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'صياغة وإرسال رسالة مخصصة' : 'Draft & Send Message'}</span>
              </button>
            </div>

            {/* Measurement Profile Snapshot */}
            <div className="space-y-2">
              <h3 className="font-bold text-[#C6A052] flex items-center gap-1.5">
                <Ruler className="w-4 h-4" />
                {language === 'ar' ? 'ملف القياسات المسجلة' : 'Measurement Profile'}
              </h3>
              {activeMeasurement ? (
                <div className="p-3 bg-[#2A1C14] border border-[#C6A052]/20 rounded-xl grid grid-cols-2 gap-2 text-[11px]">
                  <div>{language === 'ar' ? 'الصدر:' : 'Chest:'} <span className="font-bold text-[#F4F1EA]">{activeMeasurement.chest}cm</span></div>
                  <div>{language === 'ar' ? 'الخصر:' : 'Waist:'} <span className="font-bold text-[#F4F1EA]">{activeMeasurement.waist}cm</span></div>
                  <div>{language === 'ar' ? 'الكتف:' : 'Shoulder:'} <span className="font-bold text-[#F4F1EA]">{activeMeasurement.shoulder}cm</span></div>
                  <div>{language === 'ar' ? 'طول الكم:' : 'Sleeve:'} <span className="font-bold text-[#F4F1EA]">{activeMeasurement.sleeveLength}cm</span></div>
                </div>
              ) : (
                <div className="p-3 bg-[#2A1C14] rounded-xl text-[#A39B94] text-[11px] text-center">
                  {language === 'ar' ? 'لا توجد قياسات محفظة لهذا العميل بعد' : 'No measurements saved'}
                </div>
              )}
            </div>

            {/* Communication & Email Interaction Log */}
            <div className="space-y-2">
              <h3 className="font-bold text-[#C6A052] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {language === 'ar' ? 'سجل تفاعل البريد والواتساب' : 'Interaction History'}
              </h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {activeLogs.length === 0 ? (
                  <p className="text-[11px] text-[#A39B94] text-center py-2">{language === 'ar' ? 'لا توجد رسائل سابقة' : 'No history'}</p>
                ) : (
                  activeLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-[#2A1C14] border border-[#C6A052]/10 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#C6A052]">{log.type} - {log.status}</span>
                        <span className="text-[#A39B94] text-[10px]">{log.sentAt}</span>
                      </div>
                      <p className="text-[#F4F1EA]">{log.subject}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* AI Message Drafter Modal */}
      {showMessageModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl overflow-hidden text-[#F4F1EA]">
            <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C6A052]" />
                <h3 className="font-bold text-sm text-[#C6A052]">
                  {language === 'ar' ? `صياغة بالذكاء الاصطناعي لـ: ${selectedCustomer.name}` : `AI Message Drafter`}
                </h3>
              </div>
              <button onClick={() => setShowMessageModal(false)} className="text-[#A39B94] hover:text-[#F4F1EA]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSendCommunication} className="p-6 space-y-4 text-xs">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCommType('WHATSAPP')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                    commType === 'WHATSAPP'
                      ? 'bg-[#C6A052] text-[#2A1C14] border-[#C6A052]'
                      : 'bg-[#2A1C14] text-[#A39B94] border-[#C6A052]/20'
                  }`}
                >
                  {language === 'ar' ? 'رسالة واتساب (WhatsApp)' : 'WhatsApp'}
                </button>
                <button
                  type="button"
                  onClick={() => setCommType('EMAIL')}
                  className={`flex-1 py-2 rounded-xl font-bold border transition-all ${
                    commType === 'EMAIL'
                      ? 'bg-[#C6A052] text-[#2A1C14] border-[#C6A052]'
                      : 'bg-[#2A1C14] text-[#A39B94] border-[#C6A052]/20'
                  }`}
                >
                  {language === 'ar' ? 'بريد إلكتروني (Email)' : 'Email'}
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#C6A052] mb-1">
                  {language === 'ar' ? 'عنوان الرسالة / الموضوع' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  value={msgSubject}
                  onChange={(e) => setMsgSubject(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#C6A052]">
                    {language === 'ar' ? 'مضمون الرسالة' : 'Message Content'}
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAIMessage}
                    disabled={isGeneratingMsg}
                    className="text-[10px] text-[#C6A052] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingMsg ? 'جاري التوليد...' : 'إعادة توليد بالذكاء الاصطناعي'}</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  required
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA] leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 bg-[#2A1C14] rounded-xl text-[#F4F1EA]"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C6A052] text-[#2A1C14] font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إرسال وتحديث التقييم' : 'Send & Update Score'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
