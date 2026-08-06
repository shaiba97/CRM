import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Send,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Eye,
  MousePointer,
  Filter,
} from 'lucide-react';

export const EmailTrackingView: React.FC = () => {
  const { emailLogs, customers, sendCustomerCommunication, language, formatNumber } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'EMAIL' | 'WHATSAPP'>('ALL');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const filteredLogs = emailLogs.filter((l) => {
    if (filterType !== 'ALL' && l.type !== filterType) return false;
    if (selectedCustomerId && l.customerId !== selectedCustomerId) return false;
    return true;
  });

  const totalOpened = emailLogs.filter((l) => l.status === 'OPENED' || l.status === 'CLICKED').length;
  const totalClicked = emailLogs.filter((l) => l.status === 'CLICKED').length;
  const openRate = emailLogs.length > 0 ? Math.round((totalOpened / emailLogs.length) * 100) : 0;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !subject || !content) return;

    sendCustomerCommunication(selectedCustomerId, 'EMAIL', subject, content);
    setSubject('');
    setContent('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'تتبع البريد الإلكتروني ورسائل الواتساب' : 'Email & WhatsApp Tracking'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar'
            ? 'تتبع فتح الرسائل، النقرات، وتأثير التفاعل على حساب تقييم الذكاء الاصطناعي للعميل'
            : 'Track email opens, clicks, and live impact on automated AI lead scores.'}
        </p>
      </div>

      {/* Engagement KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between">
          <div>
            <div className="text-[#A39B94]">{language === 'ar' ? 'إجمالي الحملات والرسائل' : 'Total Sent'}</div>
            <div className="text-2xl font-bold text-[#F4F1EA] mt-1">{formatNumber(emailLogs.length)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#C6A052]/20 text-[#C6A052]">
            <Send className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between">
          <div>
            <div className="text-[#A39B94]">{language === 'ar' ? 'معدل فتح الرسائل' : 'Open Rate'}</div>
            <div className="text-2xl font-bold text-[#C6A052] mt-1">{formatNumber(openRate)}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-green-950/60 text-green-400 border border-green-500/30">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between">
          <div>
            <div className="text-[#A39B94]">{language === 'ar' ? 'النقرات والتفاعل المباشر' : 'Clicks'}</div>
            <div className="text-2xl font-bold text-[#F4F1EA] mt-1">{formatNumber(totalClicked)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1E293B] text-[#C6A052]">
            <MousePointer className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Send Campaign (Left) & Log List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Send Campaign Form */}
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/30 shadow-xl space-y-4">
          <div className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5 border-b border-[#C6A052]/20 pb-3">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'إرسال حملة مخصصة لعميل' : 'Send Campaign'}</span>
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block font-bold text-[#C6A052] mb-1">
                {language === 'ar' ? 'اختيار العميل المستهدف' : 'Select Target Customer'}
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
              >
                <option value="">{language === 'ar' ? '-- اختر العميل --' : '-- Select Customer --'}</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#C6A052] mb-1">
                {language === 'ar' ? 'موضوع الرسالة' : 'Campaign Subject'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عرض تشكيلة الصوف الإيطالي الجديدة' : 'Subject...'}
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#C6A052] mb-1">
                {language === 'ar' ? 'نص الرسالة' : 'Campaign Content'}
              </label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب مضمون الرسالة...' : 'Content...'}
                className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold rounded-xl hover:bg-[#C6A052]/90 flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'ar' ? 'إرسال وتنشيط التقييم' : 'Send & Trigger Tracking'}</span>
            </button>
          </form>
        </div>

        {/* Interaction Log Feed */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C6A052]/10 pb-3">
            <h2 className="font-bold text-sm text-[#C6A052]">
              {language === 'ar' ? 'سجل تتبع التفاعل المباشر' : 'Live Interaction Log'}
            </h2>

            <div className="flex items-center gap-2">
              {(['ALL', 'EMAIL', 'WHATSAPP'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                    filterType === t
                      ? 'bg-[#C6A052] text-[#2A1C14]'
                      : 'bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 space-y-1.5 hover:border-[#C6A052]/50 transition-all"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#F4F1EA]">{log.customerName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-400 font-mono">+{log.leadScoreImpact} pts</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] rounded font-bold ${
                        log.status === 'CLICKED'
                          ? 'bg-green-950 text-green-300 border border-green-500/30'
                          : log.status === 'OPENED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
                <div className="text-[#C6A052] font-medium">{log.subject}</div>
                <p className="text-[11px] text-[#A39B94] leading-relaxed">{log.content}</p>
                <div className="text-[10px] text-[#A39B94] text-left">{log.sentAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
