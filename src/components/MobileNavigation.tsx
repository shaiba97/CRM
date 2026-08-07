import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Scissors,
  ShoppingBag,
  Users,
  Menu,
  X,
  Building2,
  Store,
  Globe,
  ChevronDown,
  Mail,
  Package,
  Layers,
  Ruler,
  Kanban,
  Receipt,
  Truck,
  Wallet,
  TrendingUp,
  UserCheck,
  BarChart3,
  ShieldAlert,
  Sliders,
  Search,
  Sparkles,
} from 'lucide-react';
import { Role } from '../types';

export const MobileNavigation: React.FC = () => {
  const {
    language,
    setLanguage,
    numeralStyle,
    setNumeralStyle,
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeRole,
    setActiveRole,
    activeTenant,
    branches = [],
    activeBranchId,
    setActiveBranchId,
    customers = [],
    tailoringOrders = [],
    fabricRolls = [],
    productionTasks = [],
    setIsSearchOpen,
  } = useApp();

  const hotLeadsCount = customers.filter((c) => c.leadIntent === 'HOT').length;
  const activeOrdersCount = tailoringOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
  const lowStockRolls = fabricRolls.filter((r) => r.remainingMeters < 20).length;
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const ROLES: { role: Role; labelAr: string; labelEn: string }[] = [
    { role: 'OWNER', labelAr: 'مالك المؤسسة (Owner)', labelEn: 'Owner' },
    { role: 'MANAGER', labelAr: 'مدير النظام (Manager)', labelEn: 'Manager' },
    { role: 'SALES', labelAr: 'مسؤول مبيعات (Sales)', labelEn: 'Sales' },
    { role: 'TAILOR', labelAr: 'أستايلست وخياط (Tailor)', labelEn: 'Tailor' },
    { role: 'CASHIER', labelAr: 'أمين الصندوق (Cashier)', labelEn: 'Cashier' },
    { role: 'WAREHOUSE', labelAr: 'أمناء المخازن (Warehouse)', labelEn: 'Warehouse' },
    { role: 'ACCOUNTANT', labelAr: 'محاسب (Accountant)', labelEn: 'Accountant' },
  ];

  const ALL_NAV_ITEMS = [
    {
      id: 'dashboard',
      labelAr: 'الرئيسية (Dashboard)',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['OWNER', 'MANAGER', 'CASHIER', 'TAILOR', 'DESIGNER', 'WAREHOUSE', 'PURCHASING', 'SALES', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'tailoring',
      labelAr: 'طلبات التفصيل والأزياء',
      labelEn: 'Tailoring Orders',
      icon: Scissors,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      roles: ['OWNER', 'MANAGER', 'SALES', 'CASHIER', 'TAILOR', 'DESIGNER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'pos',
      labelAr: 'نقطة البيع المباشرة (POS)',
      labelEn: 'Point of Sale (POS)',
      icon: ShoppingBag,
      roles: ['OWNER', 'MANAGER', 'CASHIER', 'SALES', 'ACCOUNTANT'],
    },
    {
      id: 'customers',
      labelAr: 'العملاء وتقييم الذكاء الاصطناعي',
      labelEn: 'Customers & CRM',
      icon: Users,
      badge: hotLeadsCount > 0 ? hotLeadsCount : undefined,
      roles: ['OWNER', 'MANAGER', 'SALES', 'CASHIER', 'ACCOUNTANT', 'TAILOR', 'DESIGNER'],
    },
    {
      id: 'fabric-rolls',
      labelAr: 'لفات الأقمشة والمترية',
      labelEn: 'Fabric Rolls Catalog',
      icon: Layers,
      badge: lowStockRolls > 0 ? lowStockRolls : undefined,
      roles: ['OWNER', 'MANAGER', 'WAREHOUSE', 'PURCHASING', 'TAILOR', 'DESIGNER', 'SALES', 'PRODUCTION_MGR'],
    },
    {
      id: 'measurements',
      labelAr: 'ملفات القياسات المتقنة',
      labelEn: 'Measurement Profiles',
      icon: Ruler,
      roles: ['OWNER', 'MANAGER', 'SALES', 'TAILOR', 'DESIGNER', 'CASHIER'],
    },
    {
      id: 'production',
      labelAr: 'لوحة مرحلة الإنتاج (Kanban)',
      labelEn: 'Production Board',
      badge: productionTasks.length > 0 ? productionTasks.length : undefined,
      icon: Kanban,
      roles: ['OWNER', 'MANAGER', 'TAILOR', 'PRODUCTION_MGR', 'DESIGNER'],
    },
    {
      id: 'inventory',
      labelAr: 'لوحة المنتجات والمخزون',
      labelEn: 'Products & Inventory',
      icon: Package,
      roles: ['OWNER', 'MANAGER', 'WAREHOUSE', 'PURCHASING', 'SALES', 'CASHIER', 'TAILOR', 'DESIGNER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'email-tracking',
      labelAr: 'تتبع البريد والواتساب',
      labelEn: 'Communication Log',
      icon: Mail,
      roles: ['OWNER', 'MANAGER', 'SALES', 'ACCOUNTANT'],
    },
    {
      id: 'suppliers',
      labelAr: 'الموردون والمصانع',
      labelEn: 'Suppliers & Vendors',
      icon: Building2,
      roles: ['OWNER', 'MANAGER', 'PURCHASING', 'WAREHOUSE', 'ACCOUNTANT'],
    },
    {
      id: 'sales',
      labelAr: 'المبيعات والفواتير',
      labelEn: 'Sales Invoices',
      icon: Receipt,
      roles: ['OWNER', 'MANAGER', 'SALES', 'CASHIER', 'ACCOUNTANT'],
    },
    {
      id: 'purchasing',
      labelAr: 'المشتريات واستلام البضائع',
      labelEn: 'Purchase Orders',
      icon: Truck,
      roles: ['OWNER', 'MANAGER', 'PURCHASING', 'WAREHOUSE', 'ACCOUNTANT'],
    },
    {
      id: 'accounting',
      labelAr: 'الحسابات ومطابقة الصندوق',
      labelEn: 'Accounting & Till',
      icon: Wallet,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'CASHIER'],
    },
    {
      id: 'financial',
      labelAr: 'الأداء والقوائم المالية الأربع',
      labelEn: 'Financial Reports',
      icon: TrendingUp,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'SALES', 'PURCHASING'],
    },
    {
      id: 'employees',
      labelAr: 'الموظفون والعمولات',
      labelEn: 'Employees & Payroll',
      icon: UserCheck,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'reports',
      labelAr: 'التقارير المخصصة والتحليلات',
      labelEn: 'Custom Reports',
      icon: BarChart3,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'PURCHASING', 'SALES', 'WAREHOUSE', 'PRODUCTION_MGR'],
    },
    {
      id: 'admin',
      labelAr: 'سجل التدقيق والصلاحيات',
      labelEn: 'Audit Log',
      icon: ShieldAlert,
      roles: ['OWNER'],
    },
    {
      id: 'settings',
      labelAr: 'إعدادات النظام والسمة',
      labelEn: 'Settings & Branding',
      icon: Sliders,
      roles: ['OWNER', 'MANAGER'],
    },
  ];

  const visibleItems = ALL_NAV_ITEMS.filter((item) => item.roles.includes(activeRole));

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#36261C]/95 backdrop-blur-md border-t border-[#C6A052]/30 px-2 py-1.5 flex items-center justify-around shadow-2xl select-none">
        {/* Dashboard */}
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
            activeTab === 'dashboard' && !isMobileMenuOpen
              ? 'text-[#C6A052] font-bold bg-[#422F23]/80'
              : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </span>
        </button>

        {/* Tailoring */}
        <button
          onClick={() => {
            setActiveTab('tailoring');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl relative transition-all ${
            activeTab === 'tailoring' && !isMobileMenuOpen
              ? 'text-[#C6A052] font-bold bg-[#422F23]/80'
              : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Scissors className="w-5 h-5 mb-0.5" />
          {activeOrdersCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-[#C6A052] text-[#2A1C14] text-[9px] font-black flex items-center justify-center shadow">
              {activeOrdersCount}
            </span>
          )}
          <span className="text-[10px] truncate max-w-full">
            {language === 'ar' ? 'التفصيل' : 'Tailoring'}
          </span>
        </button>

        {/* POS */}
        <button
          onClick={() => {
            setActiveTab('pos');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
            activeTab === 'pos' && !isMobileMenuOpen
              ? 'text-[#C6A052] font-bold bg-[#422F23]/80'
              : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <div className="p-1 rounded-full bg-[#C6A052] text-[#2A1C14] shadow-md -mt-3 mb-0.5 border border-[#F4F1EA]/20">
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-[#C6A052]">
            {language === 'ar' ? 'POS' : 'POS'}
          </span>
        </button>

        {/* Customers */}
        <button
          onClick={() => {
            setActiveTab('customers');
            setIsMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl relative transition-all ${
            activeTab === 'customers' && !isMobileMenuOpen
              ? 'text-[#C6A052] font-bold bg-[#422F23]/80'
              : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          {hotLeadsCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center shadow">
              {hotLeadsCount}
            </span>
          )}
          <span className="text-[10px] truncate max-w-full">
            {language === 'ar' ? 'العملاء' : 'Clients'}
          </span>
        </button>

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
            isMobileMenuOpen
              ? 'text-[#C6A052] font-bold bg-[#422F23]/80'
              : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-full">
            {language === 'ar' ? 'المزيد' : 'Menu'}
          </span>
        </button>
      </nav>

      {/* Slide-over Full Drawer Sheet on Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#2A1C14]/80 backdrop-blur-md animate-fadeIn">
          {/* Drawer Inner Modal */}
          <div className="flex-1 bg-[#36261C] border-r border-[#C6A052]/30 flex flex-col overflow-hidden max-w-md w-full ml-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
              <Logo variant="full" size="sm" mode="dark" onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-[#36261C] border border-[#C6A052]/30 text-[#C6A052] hover:bg-[#422F23] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Mobile Info & Action Strip */}
            <div className="p-3 bg-[#2A1C14]/60 border-b border-[#C6A052]/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#C6A052]/20 border border-[#C6A052]/40 flex items-center justify-center text-[#C6A052]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#F4F1EA] truncate max-w-[140px]">
                    {language === 'ar' ? activeTenant?.nameAr : activeTenant?.nameEn}
                  </p>
                  <p className="text-[10px] text-[#A39B94] flex items-center gap-1">
                    <Store className="w-3 h-3 text-[#C6A052]" />
                    <span>{language === 'ar' ? activeBranch?.nameAr : activeBranch?.nameEn}</span>
                  </p>
                </div>
              </div>

              {/* Language Toggle in Drawer */}
              <button
                onClick={() => {
                  const nextLang = language === 'ar' ? 'en' : 'ar';
                  setLanguage(nextLang);
                  setNumeralStyle(nextLang);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#36261C] border border-[#C6A052]/30 text-xs font-bold text-[#C6A052] flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>
            </div>

            {/* Search Launcher in Mobile Drawer */}
            <div className="p-3 border-b border-[#C6A052]/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#A39B94]"
              >
                <Search className="w-4 h-4 text-[#C6A052]" />
                <span>{language === 'ar' ? 'بحث ذكي سريع...' : 'Quick CRM search...'}</span>
              </button>
            </div>

            {/* Scrollable Module List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="px-2 py-1 text-[11px] font-bold text-[#C6A052] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'جميع الوحدات والخدمات' : 'All Modules'}</span>
              </p>

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#422F23] text-[#C6A052] border border-[#C6A052]/40 shadow'
                        : 'text-[#F4F1EA]/80 hover:bg-[#2A1C14] hover:text-[#F4F1EA]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C6A052]' : 'text-[#A39B94]'}`} />
                    <span className="flex-1 text-right truncate">
                      {language === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full text-white bg-[#C6A052]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Role Simulator Pill in Drawer Footer */}
            <div className="p-3 bg-[#2A1C14] border-t border-[#C6A052]/20 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A39B94]">{language === 'ar' ? 'الدور الوظيفي الحالي:' : 'Active Role:'}</span>
                <span className="font-bold text-[#C6A052]">{activeRole}</span>
              </div>
              <div className="text-[10px] text-[#A39B94]/70 text-center">
                كوفادو © 2026 - KOFADO Smart Tailoring Ecosystem
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
