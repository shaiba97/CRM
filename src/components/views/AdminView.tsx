import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, KeyRound, Clock } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { auditLogs = [], language } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'سجل التدقيق الأمني والصلاحيات' : 'Audit Logs & Permissions'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'تتبع كافة العمليات الحساسة، التغييرات المالية، وتعديلات القياسات' : 'System audit log for financial edits, measurement changes, and actions.'}
        </p>
      </div>

      <div className="rounded-2xl bg-[#36261C] border border-[#C6A052]/20 overflow-hidden shadow">
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 font-bold text-[#C6A052]">
          {language === 'ar' ? 'سجل أحداث النظام الحية' : 'Live System Activity Log'}
        </div>
        <div className="divide-y divide-[#C6A052]/10 p-4 space-y-2 max-h-96 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-[#2A1C14] flex items-center justify-between">
              <div>
                <div className="font-bold text-[#F4F1EA]">{log.action}</div>
                <div className="text-[11px] text-[#A39B94]">{log.userName} ({log.userRole})</div>
              </div>
              <span className="text-[10px] text-[#A39B94] font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
