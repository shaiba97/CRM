import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Scissors, Award, ShieldCheck, Users, Percent, Phone, Building2 } from 'lucide-react';
import { UserManagementView } from './UserManagementView';

export const EmployeesView: React.FC = () => {
  const { employees = [], language, formatCurrency, formatNumber, branches = [] } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'tailors'>('users');

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs text-[#F4F1EA]">
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-[#C6A052] text-[#2A1C14] shadow-lg'
              : 'text-[#A39B94] hover:text-[#F4F1EA] hover:bg-[#2A1C14]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {language === 'ar'
              ? 'حسابات المستخدمين والصلاحيات (User Auth CRUD)'
              : 'User Auth Accounts & Permissions'}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('tailors')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'tailors'
              ? 'bg-[#C6A052] text-[#2A1C14] shadow-lg'
              : 'text-[#A39B94] hover:text-[#F4F1EA] hover:bg-[#2A1C14]'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>
            {language === 'ar'
              ? 'فريق الخياطين والعمولات والإنتاجية (HR)'
              : 'Tailors & Piece-Rate Commissions'}
          </span>
        </button>
      </div>

      {/* Subtab Content */}
      {activeSubTab === 'users' ? (
        <UserManagementView />
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#F4F1EA] flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#C6A052]" />
              <span>{language === 'ar' ? 'فريق الخياطين والمصممين والعمولات' : 'Tailors & HR Commissions'}</span>
            </h2>
            <p className="text-xs text-[#A39B94] mt-1">
              {language === 'ar'
                ? 'متابعة نسبة إنجاز طلبات التفصيل، العمولات المستحقة ومعدلات الحضور للكوادر الفنية.'
                : 'Track garment output, piece-rate commissions earned, and attendance logs.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((e) => {
              const empBranch = branches.find((b) => b.id === e.branchId);
              const totalCommission = (e.monthlyCommission || (e.commissionRate || 0.05) * 1500);

              return (
                <div
                  key={e.id}
                  className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow hover:border-[#C6A052]/50 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between font-bold border-b border-[#C6A052]/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] font-black flex items-center justify-center text-sm">
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#F4F1EA]">{e.name}</h3>
                        <p className="text-[10px] text-[#A39B94]">{e.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] uppercase">
                      {e.role}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#A39B94]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C6A052]" />
                        <span>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                      </span>
                      <span className="text-[#F4F1EA]">{e.phone || 'N/A'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#C6A052]" />
                        <span>{language === 'ar' ? 'الفرع:' : 'Branch:'}</span>
                      </span>
                      <span className="text-[#F4F1EA]">
                        {empBranch ? (language === 'ar' ? empBranch.nameAr : empBranch.nameEn) : 'الفرع الرئيسي'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#C6A052]" />
                        <span>{language === 'ar' ? 'نسبة الحضور:' : 'Attendance Rate:'}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">{formatNumber(e.attendanceRate || 98)}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-[#C6A052]" />
                        <span>{language === 'ar' ? 'الطلبات المنجزة:' : 'Assigned Orders:'}</span>
                      </span>
                      <span className="text-[#F4F1EA] font-bold">{formatNumber(e.assignedTasksCount || 12)} {language === 'ar' ? 'طلب' : 'orders'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#C6A052]/10 flex items-center justify-between font-bold text-xs">
                    <span className="text-[#A39B94]">{language === 'ar' ? 'العمولة المستحقة:' : 'Commission Earned:'}</span>
                    <span className="text-lg text-[#C6A052] font-black">{formatCurrency(totalCommission)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
