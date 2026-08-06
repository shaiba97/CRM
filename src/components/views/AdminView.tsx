import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Building2,
  Users,
  CheckCircle2,
  Plus,
  KeyRound,
  Store,
  DollarSign,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    auditLogs = [],
    language,
    tenants = [],
    activeTenant,
    switchTenant,
    setIsNewTenantModalOpen,
  } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs text-[#F4F1EA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#F4F1EA] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C6A052]" />
            <span>
              {language === 'ar'
                ? 'مركز إدارة الدور التجارية والمؤسسات (Multi-Tenant Admin)'
                : 'Multi-Tenant Enterprise SaaS Management'}
            </span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'إدارة حسابات ملاك دور الخياطة، متابعة الاشتراكات، عزل البيانات وسجل التدقيق الأمني'
              : 'Manage tailor shop owners, SaaS subscriptions, data isolation, and security logs.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewTenantModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A052] to-amber-600 hover:from-amber-500 hover:to-amber-600 text-[#2A1C14] font-black flex items-center gap-2 shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {language === 'ar'
              ? 'تسجيل دار خياطة جديدة'
              : 'Register New Tailor Shop'}
          </span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] text-[#A39B94] font-semibold">
              {language === 'ar' ? 'إجمالي دور الخياطة' : 'Total Tailor Shops'}
            </div>
            <div className="text-2xl font-black text-[#F4F1EA] mt-1">
              {tenants.length}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              {language === 'ar' ? 'نشطة في السحابة' : 'Active Multi-Tenants'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C6A052]/20 border border-[#C6A052]/40 flex items-center justify-center text-[#C6A052]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] text-[#A39B94] font-semibold">
              {language === 'ar' ? 'الدار النشطة حالياً' : 'Active Shop Workspace'}
            </div>
            <div className="text-sm font-black text-[#C6A052] mt-1 max-w-[150px] truncate">
              {activeTenant?.nameAr}
            </div>
            <div className="text-[10px] text-[#A39B94] mt-0.5">
              {activeTenant?.ownerName}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] text-[#A39B94] font-semibold">
              {language === 'ar' ? 'العملة والضريبة الحالية' : 'Active Currency & VAT'}
            </div>
            <div className="text-xl font-black text-[#F4F1EA] mt-1">
              {activeTenant?.currencySymbol} ({activeTenant?.taxRatePct}%)
            </div>
            <div className="text-[10px] text-[#A39B94] mt-0.5">
              {activeTenant?.crNumber}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C6A052]/20 border border-[#C6A052]/40 flex items-center justify-center text-[#C6A052]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] text-[#A39B94] font-semibold">
              {language === 'ar' ? 'خطة الاشتراك' : 'SaaS Subscription Tier'}
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {activeTenant?.subscriptionPlan}
            </div>
            <div className="text-[10px] text-[#A39B94] mt-0.5">
              {language === 'ar' ? 'تجديد تلقائي آمن' : 'Auto-renewing'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C6A052]/20 border border-[#C6A052]/40 flex items-center justify-center text-[#C6A052]">
            <Store className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tailor Shops Table */}
      <div className="rounded-2xl bg-[#36261C] border border-[#C6A052]/20 overflow-hidden shadow">
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
          <h2 className="font-extrabold text-sm text-[#C6A052] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C6A052]" />
            <span>
              {language === 'ar'
                ? 'قائمة ملاك ودور الخياطة المسجلة في المنصة'
                : 'Registered Tailor Shop Enterprises'}
            </span>
          </h2>

          <button
            onClick={() => setIsNewTenantModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-[#C6A052]/20 hover:bg-[#C6A052]/30 text-[#C6A052] font-bold text-xs flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة دار خياطة' : 'Add Shop'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right ltr:text-left border-collapse">
            <thead>
              <tr className="bg-[#2A1C14]/60 border-b border-[#C6A052]/10 text-[#A39B94] font-bold text-[11px]">
                <th className="p-3">دار الخياطة / العلامة</th>
                <th className="p-3">مالك الدار</th>
                <th className="p-3">الهاتف والبريد</th>
                <th className="p-3">العملة والضريبة</th>
                <th className="p-3">الاشتراك</th>
                <th className="p-3 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C6A052]/10">
              {tenants.map((tenant) => {
                const isCurrent = tenant.id === activeTenant?.id;
                return (
                  <tr
                    key={tenant.id}
                    className={`hover:bg-[#422F23]/40 transition-colors ${
                      isCurrent ? 'bg-[#422F23]/60' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="font-extrabold text-[#F4F1EA] flex items-center gap-2">
                        <span>{language === 'ar' ? tenant.nameAr : tenant.nameEn}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                            مساحة العمل النشطة
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#A39B94] mt-0.5">{tenant.crNumber} • {tenant.addressAr}</div>
                    </td>

                    <td className="p-3 font-semibold text-[#F4F1EA]">
                      {tenant.ownerName}
                    </td>

                    <td className="p-3 text-[#A39B94]">
                      <div>{tenant.ownerPhone}</div>
                      <div className="text-[10px] opacity-80">{tenant.ownerEmail}</div>
                    </td>

                    <td className="p-3 font-mono font-bold text-[#C6A052]">
                      {tenant.currencySymbol} ({tenant.taxRatePct}%)
                    </td>

                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] font-bold text-[10px]">
                        {tenant.subscriptionPlan}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      {isCurrent ? (
                        <span className="text-emerald-400 font-extrabold text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>نشط الان</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => switchTenant(tenant.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#C6A052] hover:bg-amber-500 text-[#2A1C14] font-black text-xs transition-all active:scale-95 shadow"
                        >
                          انتقال للمؤسسة
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="rounded-2xl bg-[#36261C] border border-[#C6A052]/20 overflow-hidden shadow">
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 font-bold text-[#C6A052] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'ar' ? 'سجل التدقيق الأمني للعمليات والتنقلات' : 'System Security & Access Audit Log'}</span>
          </span>
          <span className="text-[10px] text-[#A39B94]">
            {auditLogs.length} {language === 'ar' ? 'أحداث مسجلة' : 'events'}
          </span>
        </div>

        <div className="divide-y divide-[#C6A052]/10 p-4 space-y-2 max-h-80 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-[#2A1C14] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#F4F1EA]">{log.action}</div>
                <div className="text-[11px] text-[#A39B94]">
                  {log.userName} ({log.userRole})
                </div>
              </div>
              <span className="text-[10px] text-[#A39B94] font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
