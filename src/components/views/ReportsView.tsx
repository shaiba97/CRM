import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  Sparkles,
  Layers,
  Users,
  Scissors,
  DollarSign,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const ReportsView: React.FC = () => {
  const {
    customers,
    tailoringOrders,
    fabricRolls,
    invoices,
    language,
    formatCurrency,
    formatNumber,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'SALES' | 'LEADS' | 'INVENTORY' | 'PRODUCTION'>('SALES');
  const [dateRange, setDateRange] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');

  // Lead distribution pie data
  const hotCount = customers.filter((c) => c.leadIntent === 'HOT').length;
  const warmCount = customers.filter((c) => c.leadIntent === 'WARM').length;
  const coldCount = customers.filter((c) => c.leadIntent === 'COLD').length;

  const leadDistributionData = [
    { name: language === 'ar' ? 'HOT Leads (عالية)' : 'HOT Leads', value: hotCount, color: '#EF4444' },
    { name: language === 'ar' ? 'WARM Leads (متوسطة)' : 'WARM Leads', value: warmCount, color: '#F59E0B' },
    { name: language === 'ar' ? 'COLD Leads (منخفضة)' : 'COLD Leads', value: coldCount, color: '#6B7280' },
  ];

  // Sales breakdown by fabric style
  const fabricSalesData = [
    { fabric: 'Super 150s Wool', revenue: 68000, meters: 112 },
    { fabric: 'Japanese Silk Cotton', revenue: 42000, meters: 85 },
    { fabric: 'British Cashmere', revenue: 95000, meters: 64 },
    { fabric: 'Linen Supreme', revenue: 31000, meters: 90 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#C6A052]" />
            <span>{language === 'ar' ? 'وحدات التقارير المخصصة والتحليلات' : 'Customizable Reporting Modules'}</span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'تقارير أداء المبيعات، تحليلات تحويل الذكاء الاصطناعي، إنتاجية الخياطين ورصيد المخزون'
              : 'Sales performance, AI lead conversion analytics, production throughput, and stock valuation.'}
          </p>
        </div>

        <button
          onClick={() => alert(language === 'ar' ? 'تم تصدير التقرير بصيغة PDF/Excel بنجاح' : 'Report exported successfully')}
          className="px-4 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'ar' ? 'تصدير التقرير (PDF / Excel)' : 'Export Report'}</span>
        </button>
      </div>

      {/* Module Selector Nav Tabs */}
      <div className="p-2 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveReportTab('SALES')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'SALES' ? 'bg-[#C6A052] text-[#2A1C14]' : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{language === 'ar' ? 'تقرير المبيعات والإيرادات' : 'Sales & Revenue'}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('LEADS')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'LEADS' ? 'bg-[#C6A052] text-[#2A1C14]' : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'ar' ? 'تحليلات الذكاء الاصطناعي والعملاء' : 'AI Lead Conversion'}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('INVENTORY')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'INVENTORY' ? 'bg-[#C6A052] text-[#2A1C14]' : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'ar' ? 'تقييم الأقمشة والمخزون' : 'Fabric Inventory'}</span>
        </button>

        <button
          onClick={() => setActiveReportTab('PRODUCTION')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeReportTab === 'PRODUCTION' ? 'bg-[#C6A052] text-[#2A1C14]' : 'text-[#A39B94] hover:text-[#F4F1EA]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>{language === 'ar' ? 'إنتاجية الخياطين والمصنع' : 'Tailoring Throughput'}</span>
        </button>
      </div>

      {/* Module 1: Sales & Revenue */}
      {activeReportTab === 'SALES' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
            <h2 className="font-bold text-sm text-[#C6A052]">
              {language === 'ar' ? 'إجمالي المبيعات الإيجارية والتفصيل حسب الأقمشة' : 'Revenue Breakdown by Fabric Category'}
            </h2>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fabricSalesData}>
                  <XAxis dataKey="fabric" stroke="#A39B94" fontSize={11} />
                  <YAxis stroke="#A39B94" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2A1C14',
                      borderColor: '#C6A052',
                      borderRadius: '12px',
                      color: '#F4F1EA',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#C6A052" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Module 2: AI Lead Conversion Analytics */}
      {activeReportTab === 'LEADS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn text-xs">
          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
            <h2 className="font-bold text-sm text-[#C6A052]">
              {language === 'ar' ? 'توزيع درجات التقييم الآلي (AI Lead Score)' : 'AI Lead Distribution'}
            </h2>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={leadDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>

                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4">
            <h2 className="font-bold text-sm text-[#C6A052]">
              {language === 'ar' ? 'معدلات تحويل العملاء من التفاعلات' : 'Conversion Rate Metrics'}
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#2A1C14] border border-red-500/30">
                <div className="font-bold text-red-400">HOT Leads (&gt;80/100)</div>
                <div className="text-xl font-bold text-[#F4F1EA] mt-1">88.5% {language === 'ar' ? 'معدل إغلاق صفقات' : 'Conversion'}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#2A1C14] border border-amber-500/30">
                <div className="font-bold text-amber-400">WARM Leads (50-79/100)</div>
                <div className="text-xl font-bold text-[#F4F1EA] mt-1">45.2% {language === 'ar' ? 'معدل إغلاق صفقات' : 'Conversion'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 3: Inventory Valuation */}
      {activeReportTab === 'INVENTORY' && (
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4 animate-fadeIn text-xs">
          <h2 className="font-bold text-sm text-[#C6A052]">
            {language === 'ar' ? 'تقرير تقييم مخزون الأقمشة الحالية' : 'Fabric Roll Valuation Summary'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#2A1C14]">
              <div className="text-[#A39B94]">{language === 'ar' ? 'إجمالي الأمتار بالمستودع' : 'Total Meters'}</div>
              <div className="text-xl font-bold text-[#F4F1EA] mt-1">
                {formatNumber(fabricRolls.reduce((s, r) => s + r.remainingMeters, 0))}m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#2A1C14]">
              <div className="text-[#A39B94]">{language === 'ar' ? 'القيمة التقديرية بالبيع' : 'Retail Value'}</div>
              <div className="text-xl font-bold text-[#C6A052] mt-1">
                {formatCurrency(fabricRolls.reduce((s, r) => s + r.remainingMeters * r.pricePerMeter, 0))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 4: Tailoring Throughput */}
      {activeReportTab === 'PRODUCTION' && (
        <div className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow-md space-y-4 animate-fadeIn text-xs">
          <h2 className="font-bold text-sm text-[#C6A052]">
            {language === 'ar' ? 'معدل إنجاز الخياطين والأودرات الجاهزة' : 'Tailor Productivity Rates'}
          </h2>

          <div className="p-4 rounded-xl bg-[#2A1C14] space-y-2">
            <div className="font-bold text-[#F4F1EA]">{language === 'ar' ? 'متوسط وقت تفصيل الثوب الواحد:' : 'Average tailoring time:'} 3.2 days</div>
            <div className="text-[#A39B94]">{language === 'ar' ? 'الأودرات المنجزة هذا الأسبوع:' : 'Orders finished this week:'} 18 orders</div>
          </div>
        </div>
      )}
    </div>
  );
};
