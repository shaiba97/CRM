import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Layers,
  Scissors,
  Ruler,
  Kanban,
  ShoppingBag,
  Receipt,
  Truck,
  Wallet,
  TrendingUp,
  UserCheck,
  BarChart3,
  ShieldAlert,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
} from 'lucide-react';
import { Role } from '../types';

interface NavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ElementType;
  badge?: number;
  roles: Role[]; // Roles allowed to view
}

export const SideNav: React.FC = () => {
  const {
    language,
    activeTab,
    setActiveTab,
    sidebarExpanded,
    setSidebarExpanded,
    activeRole,
    customers = [],
    tailoringOrders = [],
    productionTasks = [],
    fabricRolls = [],
  } = useApp();

  const hotLeadsCount = customers.filter((c) => c.leadIntent === 'HOT').length;
  const activeOrdersCount = tailoringOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
  const lowStockRolls = fabricRolls.filter((r) => r.remainingMeters < 20).length;

  const NAV_ITEMS: NavItem[] = [
    {
      id: 'dashboard',
      labelAr: 'الرئيسية (Dashboard)',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['OWNER', 'MANAGER', 'CASHIER', 'TAILOR', 'DESIGNER', 'WAREHOUSE', 'PURCHASING', 'SALES', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'customers',
      labelAr: 'العملاء وتقييم الذكاء الاصطناعي',
      labelEn: 'Customers & AI Lead Scoring',
      icon: Users,
      badge: hotLeadsCount > 0 ? hotLeadsCount : undefined,
      roles: ['OWNER', 'MANAGER', 'SALES', 'CASHIER', 'ACCOUNTANT', 'TAILOR', 'DESIGNER'],
    },
    {
      id: 'email-tracking',
      labelAr: 'تتبع البريد والواتساب',
      labelEn: 'Email & WhatsApp Tracking',
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
      id: 'inventory',
      labelAr: 'لوحة المنتجات والمخزون',
      labelEn: 'Products & Inventory',
      icon: Package,
      roles: ['OWNER', 'MANAGER', 'WAREHOUSE', 'PURCHASING', 'SALES', 'CASHIER', 'TAILOR', 'DESIGNER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
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
      id: 'tailoring',
      labelAr: 'طلبات التفصيل والأزياء',
      labelEn: 'Tailoring Orders & Styles',
      icon: Scissors,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
      roles: ['OWNER', 'MANAGER', 'SALES', 'CASHIER', 'TAILOR', 'DESIGNER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
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
      id: 'pos',
      labelAr: 'نقطة البيع المباشرة (POS)',
      labelEn: 'Point of Sale (POS)',
      icon: ShoppingBag,
      roles: ['OWNER', 'MANAGER', 'CASHIER', 'SALES', 'ACCOUNTANT'],
    },
    {
      id: 'sales',
      labelAr: 'المبيعات والفواتير',
      labelEn: 'Sales & Invoices',
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
      labelEn: 'Accounting & Till Reconciliation',
      icon: Wallet,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'CASHIER'],
    },
    {
      id: 'financial',
      labelAr: 'الأداء والقوائم المالية الأربع',
      labelEn: 'Financial Performance & 4 Statements',
      icon: TrendingUp,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'SALES', 'PURCHASING'],
    },
    {
      id: 'employees',
      labelAr: 'الموظفون والعمولات',
      labelEn: 'Employees & Commissions',
      icon: UserCheck,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'PRODUCTION_MGR'],
    },
    {
      id: 'reports',
      labelAr: 'التقارير المخصصة والتحليلات',
      labelEn: 'Customizable Reports',
      icon: BarChart3,
      roles: ['OWNER', 'MANAGER', 'ACCOUNTANT', 'PURCHASING', 'SALES', 'WAREHOUSE', 'PRODUCTION_MGR'],
    },
    {
      id: 'admin',
      labelAr: 'سجل التدقيق والصلاحيات',
      labelEn: 'Audit Log & Permissions',
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

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(activeRole));

  return (
    <aside
      className={`relative z-30 bg-[#36261C] border-l border-[#C6A052]/20 transition-all duration-300 flex flex-col justify-between select-none shrink-0 h-full overflow-hidden ${
        sidebarExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Toggle Pin */}
      <div className="p-3 border-b border-[#C6A052]/10 flex items-center justify-between">
        {sidebarExpanded && (
          <span className="text-[11px] font-bold text-[#C6A052] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ar' ? 'القائمة الرئيسية' : 'NAVIGATION'}
          </span>
        )}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="p-1.5 rounded-lg bg-[#2A1C14] border border-[#C6A052]/20 text-[#C6A052] hover:bg-[#422F23] transition-colors mx-auto"
          title={sidebarExpanded ? 'طي القائمة' : 'توسيع القائمة'}
        >
          {sidebarExpanded ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                isActive
                  ? 'bg-[#422F23] text-[#C6A052] border border-[#C6A052]/40 shadow-lg'
                  : 'text-[#F4F1EA]/80 hover:bg-[#2A1C14] hover:text-[#F4F1EA]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C6A052]' : 'text-[#A39B94] group-hover:text-[#C6A052]'}`} />

              {sidebarExpanded && (
                <span className="flex-1 text-right truncate">
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </span>
              )}

              {/* Badge counter */}
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white bg-[#C6A052] ${
                    !sidebarExpanded ? 'absolute top-1 right-1' : ''
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed mode */}
              {!sidebarExpanded && (
                <div className="absolute right-full mr-2 hidden group-hover:block bg-[#2A1C14] text-[#F4F1EA] text-xs px-2.5 py-1.5 rounded-md border border-[#C6A052]/30 whitespace-nowrap shadow-xl z-50">
                  {language === 'ar' ? item.labelAr : item.labelEn}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info in sidebar */}
      {sidebarExpanded && (
        <div className="p-3 border-t border-[#C6A052]/10 text-[10px] text-[#A39B94] bg-[#2A1C14]/50">
          <div className="flex items-center justify-between">
            <span>{language === 'ar' ? 'إصدار النظام:' : 'System Version:'}</span>
            <span className="font-mono text-[#C6A052]">v2026.8.5</span>
          </div>
          <div className="mt-1 text-[9px] text-[#A39B94]/80 flex items-center justify-between">
            <span>{language === 'ar' ? 'كوفادو | نظام الخياطة والأقمشة' : 'KOFADO Tailoring System'}</span>
          </div>
        </div>
      )}
    </aside>
  );
};
