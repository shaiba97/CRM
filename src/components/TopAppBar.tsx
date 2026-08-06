import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Search,
  Plus,
  Bell,
  CheckSquare,
  Globe,
  UserCheck,
  Store,
  LogOut,
  Sliders,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  UserPlus,
  Scissors,
  FileText,
} from 'lucide-react';
import { Role } from '../types';

interface TopAppBarProps {
  onOpenQuickNewOrder: () => void;
  onOpenQuickNewCustomer: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenQuickNewOrder,
  onOpenQuickNewCustomer,
}) => {
  const {
    language,
    setLanguage,
    numeralStyle,
    setNumeralStyle,
    activeBranchId,
    setActiveBranchId,
    branches = [],
    activeRole,
    setActiveRole,
    notifications = [],
    markNotificationRead,
    markAllNotificationsRead,
    userTasks = [],
    setIsSearchOpen,
    globalSearchQuery,
    setGlobalSearchQuery,
    setActiveTab,
    formatNumber,
  } = useApp();

  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState(false);
  const [showQuickActionMenu, setShowQuickActionMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const ROLES: { role: Role; labelAr: string; labelEn: string }[] = [
    { role: 'OWNER', labelAr: 'مالك المؤسسة (Owner)', labelEn: 'Owner' },
    { role: 'MANAGER', labelAr: 'مدير النظام (Manager)', labelEn: 'Manager' },
    { role: 'SALES', labelAr: 'مسؤول مبيعات (Sales)', labelEn: 'Sales' },
    { role: 'TAILOR', labelAr: 'أستايلست وخياط (Tailor)', labelEn: 'Tailor' },
    { role: 'CASHIER', labelAr: 'أمين الصندوق (Cashier)', labelEn: 'Cashier' },
    { role: 'WAREHOUSE', labelAr: 'أمناء المخازن (Warehouse)', labelEn: 'Warehouse' },
    { role: 'ACCOUNTANT', labelAr: 'محاسب (Accountant)', labelEn: 'Accountant' },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#36261C] border-b border-[#C6A052]/20 px-4 flex items-center justify-between text-[#F4F1EA]">
      {/* Right side in RTL / Left side in LTR: Logo & Branch Selector */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Logo
          variant="full"
          size="md"
          mode="dark"
          onClick={() => setActiveTab('dashboard')}
        />

        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1C14]/80 border border-[#C6A052]/20 hover:border-[#C6A052]/50 text-xs text-[#F4F1EA] transition-all"
            title={language === 'ar' ? 'تغيير الفرع' : 'Switch Branch'}
          >
            <Store className="w-3.5 h-3.5 text-[#C6A052]" />
            <span className="font-medium max-w-[120px] truncate">
              {language === 'ar' ? activeBranch.nameAr : activeBranch.nameEn}
            </span>
            <ChevronDown className="w-3 h-3 text-[#A39B94]" />
          </button>

          {showBranchMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#A39B94] border-b border-[#C6A052]/10 uppercase">
                {language === 'ar' ? 'اختيار الفرع المباشر' : 'Select Active Branch'}
              </div>
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBranchId(b.id);
                    setShowBranchMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-[#422F23] transition-colors ${
                    b.id === activeBranchId ? 'text-[#C6A052] font-bold bg-[#422F23]/60' : 'text-[#F4F1EA]'
                  }`}
                >
                  <span>{language === 'ar' ? b.nameAr : b.nameEn}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2A1C14] text-[#A39B94]">{b.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3.5 py-2 bg-[#2A1C14]/90 border border-[#C6A052]/20 hover:border-[#C6A052]/60 rounded-xl cursor-pointer text-xs text-[#A39B94] transition-all group"
        >
          <Search className="w-4 h-4 text-[#C6A052] group-hover:scale-110 transition-transform" />
          <span className="flex-1 truncate">
            {language === 'ar'
              ? 'بحث الذكاء الاصطناعي... (عميل، رقم ثوب، أقمشة، فاتورة، أو اضغط Ctrl+K)'
              : 'Search CRM... (Customers, Tailoring Orders, Fabric Rolls, Invoices - Ctrl+K)'}
          </span>
          <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] bg-[#36261C] border border-[#C6A052]/30 text-[#C6A052] rounded font-mono">
            ⌘K / Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Left side in RTL / Right side in LTR: Actions, Notifications, Role, Profile */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-lg bg-[#2A1C14] border border-[#C6A052]/20 text-[#C6A052]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Create Split Button */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActionMenu(!showQuickActionMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-lg hover:bg-[#C6A052]/90 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'إضافة جديدة' : 'New Record'}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showQuickActionMenu && (
            <div className="absolute left-0 sm:right-0 mt-2 w-56 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl py-2 z-50">
              <button
                onClick={() => {
                  onOpenQuickNewOrder();
                  setShowQuickActionMenu(false);
                }}
                className="w-full text-right px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-[#422F23] text-[#F4F1EA] transition-colors"
              >
                <Scissors className="w-4 h-4 text-[#C6A052]" />
                <div>
                  <div className="font-semibold">{language === 'ar' ? 'طلب تفصيل جديد' : 'New Tailoring Order'}</div>
                  <div className="text-[10px] text-[#A39B94]">{language === 'ar' ? 'اختيار العميل والأقمشة والقياسات' : 'Custom garment creation wizard'}</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenQuickNewCustomer();
                  setShowQuickActionMenu(false);
                }}
                className="w-full text-right px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-[#422F23] text-[#F4F1EA] transition-colors border-t border-[#C6A052]/10"
              >
                <UserPlus className="w-4 h-4 text-[#C6A052]" />
                <div>
                  <div className="font-semibold">{language === 'ar' ? 'عميل جديد (CRM)' : 'New Customer (CRM)'}</div>
                  <div className="text-[10px] text-[#A39B94]">{language === 'ar' ? 'إدخال البيانات وبدء التقييم الآلي' : 'Add prospect with lead tracking'}</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('pos');
                  setShowQuickActionMenu(false);
                }}
                className="w-full text-right px-3.5 py-2.5 text-xs flex items-center gap-2.5 hover:bg-[#422F23] text-[#F4F1EA] transition-colors border-t border-[#C6A052]/10"
              >
                <ShoppingBag className="w-4 h-4 text-[#C6A052]" />
                <div>
                  <div className="font-semibold">{language === 'ar' ? 'فتح نقطة البيع (POS)' : 'Open Point of Sale'}</div>
                  <div className="text-[10px] text-[#A39B94]">{language === 'ar' ? 'بيع أقمشة ومستلزمات فورية' : 'Quick cash/card checkout'}</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowTaskMenu(false);
            }}
            className="p-2 rounded-lg bg-[#2A1C14]/80 border border-[#C6A052]/20 hover:border-[#C6A052]/50 text-[#F4F1EA] relative"
            title={language === 'ar' ? 'الإشعارات' : 'Notifications'}
          >
            <Bell className="w-4 h-4 text-[#C6A052]" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {formatNumber(unreadNotifCount)}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute left-0 mt-2 w-80 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-2 mb-2">
                <span className="font-bold text-xs text-[#C6A052] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'تنبيهات النظام والتفاعل' : 'System Notifications'}
                </span>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-[#C6A052] hover:underline"
                  >
                    {language === 'ar' ? 'قراءة الكل' : 'Mark all read'}
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {notifications.length === 0 ? (
                  <p className="text-center text-[#A39B94] py-4">{language === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications'}</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) {
                          setActiveTab(n.link.replace('/', ''));
                        }
                        setShowNotifMenu(false);
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        n.read
                          ? 'bg-[#2A1C14]/40 border-[#C6A052]/10 text-[#A39B94]'
                          : 'bg-[#422F23] border-[#C6A052]/40 text-[#F4F1EA]'
                      }`}
                    >
                      <div className="font-semibold text-xs flex items-center justify-between">
                        <span className="text-[#C6A052]">{language === 'ar' ? n.titleAr : n.titleEn}</span>
                        <span className="text-[10px] text-[#A39B94]">{n.createdAt}</span>
                      </div>
                      <p className="text-[11px] mt-1 leading-relaxed">
                        {language === 'ar' ? n.messageAr : n.messageEn}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Tasks Checklist Icon */}
        <div className="relative">
          <button
            onClick={() => {
              setShowTaskMenu(!showTaskMenu);
              setShowNotifMenu(false);
            }}
            className="p-2 rounded-lg bg-[#2A1C14]/80 border border-[#C6A052]/20 hover:border-[#C6A052]/50 text-[#F4F1EA] relative"
            title={language === 'ar' ? 'مهام وقرارات الإدارة' : 'Manager Tasks'}
          >
            <CheckSquare className="w-4 h-4 text-[#C6A052]" />
            {userTasks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C6A052] rounded-full"></span>
            )}
          </button>

          {showTaskMenu && (
            <div className="absolute left-0 mt-2 w-80 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl p-3 z-50">
              <div className="font-bold text-xs text-[#C6A052] border-b border-[#C6A052]/10 pb-2 mb-2 flex items-center justify-between">
                <span>{language === 'ar' ? 'قائمة الموافقات والمهام العاجلة' : 'Action Required Queue'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2A1C14] text-[#C6A052]">
                  {formatNumber(userTasks.length)}
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {userTasks.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-lg bg-[#2A1C14] border border-[#C6A052]/20 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-[#F4F1EA]">{language === 'ar' ? t.titleAr : t.titleEn}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-bold uppercase">
                        {t.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A39B94]">{t.description}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setActiveTab(t.relatedModule);
                          setShowTaskMenu(false);
                        }}
                        className="text-[10px] text-[#C6A052] hover:underline font-bold"
                      >
                        {language === 'ar' ? 'إتخاذ إجراء ➔' : 'Take Action ➔'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language & Numeral Toggle */}
        <button
          onClick={() => {
            const nextLang = language === 'ar' ? 'en' : 'ar';
            setLanguage(nextLang);
            setNumeralStyle(nextLang);
          }}
          className="p-2 rounded-lg bg-[#2A1C14]/80 border border-[#C6A052]/20 hover:border-[#C6A052]/50 text-xs text-[#C6A052] flex items-center gap-1"
          title={language === 'ar' ? 'تغيير اللغة' : 'Switch Language'}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="font-bold uppercase text-[11px]">{language === 'ar' ? 'EN' : 'عربي'}</span>
        </button>

        {/* Role Switcher (For Demo & Multi-Role Testing) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1E293B] border border-[#C6A052]/30 text-xs text-[#C6A052] font-semibold"
            title={language === 'ar' ? 'تبديل الدور الوظيفي التجريبي' : 'Switch Active Role'}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">
              {ROLES.find((r) => r.role === activeRole)?.[language === 'ar' ? 'labelAr' : 'labelEn']}
            </span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showRoleMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] text-[#A39B94] border-b border-[#C6A052]/10 uppercase font-mono">
                {language === 'ar' ? 'تجربة صلاحيات الأدوار' : 'Role Simulator'}
              </div>
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    setActiveRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs transition-colors ${
                    r.role === activeRole ? 'bg-[#422F23] text-[#C6A052] font-bold' : 'text-[#F4F1EA] hover:bg-[#2A1C14]'
                  }`}
                >
                  {language === 'ar' ? r.labelAr : r.labelEn}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C6A052] to-[#422F23] border border-[#C6A052] flex items-center justify-center cursor-pointer shadow hover:scale-105 transition-transform"
          >
            <span className="font-bold text-xs text-[#2A1C14]">محمود</span>
          </div>

          {showUserMenu && (
            <div className="absolute left-0 mt-2 w-48 bg-[#36261C] border border-[#C6A052]/30 rounded-xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#C6A052]/10">
                <p className="font-bold text-[#F4F1EA]">محمود موسى العطاء</p>
                <p className="text-[10px] text-[#C6A052] uppercase font-mono">{activeRole}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-right px-3 py-2 text-[#F4F1EA] hover:bg-[#422F23] flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-[#C6A052]" />
                {language === 'ar' ? 'إعدادات النظام والبريد' : 'System Settings'}
              </button>
              <button
                onClick={() => {
                  alert(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out');
                  setShowUserMenu(false);
                }}
                className="w-full text-right px-3 py-2 text-red-400 hover:bg-[#422F23] flex items-center gap-2 border-t border-[#C6A052]/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
