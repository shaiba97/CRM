import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import {
  Users,
  Scissors,
  DollarSign,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowUpRight,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Kanban,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    customers = [],
    tailoringOrders = [],
    fabricRolls = [],
    invoices = [],
    productionTasks = [],
    language,
    formatCurrency,
    formatNumber,
    activeRole,
    setActiveTab,
  } = useApp();

  // Metrics
  const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0);
  const hotLeads = customers.filter((c) => c.leadIntent === 'HOT');
  const totalActiveOrders = tailoringOrders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  );
  const totalMetersInStock = fabricRolls.reduce((sum, r) => sum + r.remainingMeters, 0);

  // Revenue chart data
  const revenueData = [
    { day: language === 'ar' ? 'السبت' : 'Sat', sales: 14500, orders: 4 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', sales: 22000, orders: 7 },
    { day: language === 'ar' ? 'الإثنين' : 'Mon', sales: 18400, orders: 5 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', sales: 31000, orders: 9 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', sales: 27500, orders: 8 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', sales: 42000, orders: 12 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', sales: 38000, orders: 10 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#36261C] via-[#2A1C14] to-[#1E293B] border border-[#C6A052]/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#C6A052] font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>
              {language === 'ar'
                ? `لوحة التحكم المباشرة | الدور الحالي: ${activeRole}`
                : `Operational Cockpit | Role: ${activeRole}`}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Logo variant="full" size="md" mode="dark" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F4F1EA]">
            {language === 'ar'
              ? 'مرحباً بك في كوفادو | نظام إدارة الخياطة والأقمشة الذكي'
              : 'Welcome to KOFADO | Smart Tailoring & Fabric Operations'}
          </h1>
          <p className="text-xs text-[#A39B94] mt-1 max-w-2xl leading-relaxed">
            {language === 'ar'
              ? 'تتبع شامل للعملاء، تقييم الذكاء الاصطناعي التلقائي، رصيد لفات الأقمشة، ومراحل الإنتاج اليومية لمصنع الخياطة.'
              : 'Real-time sales CRM, AI lead scoring, fabric roll meterage, and tailoring production queue.'}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('customers')}
            className="px-4 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow flex items-center gap-2 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>{language === 'ar' ? 'إدارة العملاء والتقييم' : 'Manage Leads'}</span>
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className="px-4 py-2.5 bg-[#1E293B] border border-[#C6A052]/40 text-[#F4F1EA] font-semibold text-xs rounded-xl hover:bg-[#2A1C14] shadow flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 text-[#C6A052]" />
            <span>{language === 'ar' ? 'نقطة البيع (POS)' : 'Open POS'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#A39B94]">
            <span>{language === 'ar' ? 'إجمالي المبيعات' : 'Total Sales'}</span>
            <div className="p-2 rounded-xl bg-[#C6A052]/20 text-[#C6A052]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#F4F1EA]">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-green-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% {language === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs last week'}</span>
          </div>
        </div>

        {/* KPI 2: AI Hot Leads */}
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#A39B94]">
            <span>{language === 'ar' ? 'العملاء المؤهلين (AI Hot Leads)' : 'AI Hot Leads'}</span>
            <div className="p-2 rounded-xl bg-red-950/60 text-red-400 border border-red-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <span>{formatNumber(hotLeads.length)}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-semibold">
              HOT (80+)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#A39B94]">
            {language === 'ar' ? 'معدل التحويل المتوقع 88%' : 'Expected conversion 88%'}
          </div>
        </div>

        {/* KPI 3: Active Orders */}
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#A39B94]">
            <span>{language === 'ar' ? 'طلبات التفصيل قيد التنفيذ' : 'Active Tailoring Orders'}</span>
            <div className="p-2 rounded-xl bg-[#C6A052]/20 text-[#C6A052]">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#F4F1EA]">
            {formatNumber(totalActiveOrders.length)} {language === 'ar' ? 'طلب' : 'orders'}
          </div>
          <div className="mt-2 text-[11px] text-[#C6A052] font-semibold">
            {language === 'ar' ? 'في مراحل القص والخياطة' : 'In cutting & sewing stages'}
          </div>
        </div>

        {/* KPI 4: Fabric Meterage */}
        <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052]/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs text-[#A39B94]">
            <span>{language === 'ar' ? 'رصيد الأقمشة المتاح' : 'Available Fabric Meters'}</span>
            <div className="p-2 rounded-xl bg-[#C6A052]/20 text-[#C6A052]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#F4F1EA]">
            {formatNumber(totalMetersInStock)}m
          </div>
          <div className="mt-2 text-[11px] text-[#A39B94]">
            {language === 'ar' ? 'موزعة على 4 لفات فاخرة' : 'Across 4 premium rolls'}
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trend & Production Kanban Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Revenue Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[#C6A052]">
                {language === 'ar' ? 'تحليل المبيعات اليومية والأوامر' : 'Daily Revenue & Order Volume'}
              </h2>
              <p className="text-[11px] text-[#A39B94]">
                {language === 'ar' ? 'تتبع الإيرادات الأسبوعية بالجنيه السوداني' : 'Weekly revenue breakdown'}
              </p>
            </div>
            <span className="text-xs font-mono text-[#C6A052] px-2.5 py-1 bg-[#2A1C14] rounded-lg border border-[#C6A052]/30">
              SDG Currency
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A052" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#C6A052" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#A39B94" fontSize={11} tickLine={false} />
                <YAxis stroke="#A39B94" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2A1C14',
                    borderColor: '#C6A052',
                    borderRadius: '12px',
                    color: '#F4F1EA',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#C6A052"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top AI Rated Prospects */}
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'أعلى العملاء تقييماً (AI Leads)' : 'Top AI Rated Leads'}
            </h2>
            <button
              onClick={() => setActiveTab('customers')}
              className="text-[11px] text-[#C6A052] hover:underline"
            >
              {language === 'ar' ? 'عرض الكل' : 'View all'}
            </button>
          </div>

          <div className="space-y-3">
            {customers.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveTab('customers')}
                className="p-3 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 hover:border-[#C6A052] cursor-pointer transition-all space-y-1 text-xs"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#F4F1EA]">{c.name}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${
                      c.leadIntent === 'HOT'
                        ? 'bg-red-950 text-red-300 border border-red-500/30'
                        : c.leadIntent === 'WARM'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {c.leadScore}/100 ({c.leadIntent})
                  </span>
                </div>
                <div className="text-[11px] text-[#A39B94] flex items-center justify-between">
                  <span>{c.phone}</span>
                  <span>{formatCurrency(c.totalSpent)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production & Fabric Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Tailoring Pipeline */}
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-3">
            <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5">
              <Kanban className="w-4 h-4" />
              {language === 'ar' ? 'حالة أودرات الخياطة والقص المباشرة' : 'Active Tailoring Queue'}
            </h2>
            <button
              onClick={() => setActiveTab('production')}
              className="text-xs text-[#C6A052] hover:underline"
            >
              {language === 'ar' ? 'فتح لوحة الإنتاج ➔' : 'Open Board ➔'}
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {tailoringOrders.slice(0, 3).map((o) => (
              <div key={o.id} className="p-3 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F4F1EA] flex items-center gap-2">
                    <span className="text-[#C6A052]">{o.orderNumber}</span>
                    <span>- {o.customerName}</span>
                  </div>
                  <div className="text-[11px] text-[#A39B94] mt-0.5">
                    {o.garmentStyle} | {language === 'ar' ? 'تاريخ التسليم:' : 'Due:'} {o.dueDate}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#36261C] border border-[#C6A052]/30 text-[#C6A052] font-semibold text-[10px] uppercase">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fabric Rolls Stock Alert */}
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-3">
            <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              {language === 'ar' ? 'حالة رصيد الأقمشة الحية' : 'Fabric Stock Levels'}
            </h2>
            <button
              onClick={() => setActiveTab('fabric-rolls')}
              className="text-xs text-[#C6A052] hover:underline"
            >
              {language === 'ar' ? 'كتالوج الأقمشة ➔' : 'Catalog ➔'}
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {fabricRolls.map((f) => {
              const pct = Math.round((f.remainingMeters / f.totalMeters) * 100);
              return (
                <div key={f.id} className="p-3 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#F4F1EA]">{f.rollCode} - {f.fabricType}</span>
                    <span className="text-[#C6A052]">{f.remainingMeters}m / {f.totalMeters}m</span>
                  </div>
                  <div className="w-full bg-[#36261C] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-[#C6A052]'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
