import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ruler, Scissors, UserCheck, Plus } from 'lucide-react';

export const MeasurementsView: React.FC = () => {
  const { measurements, customers, language } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Ruler className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'سجل ملفات القياسات المتقنة' : 'Precision Measurement Profiles'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'قياسات الصدر، الخصر، الكتف، الكم، وملاحظات خياطة الجيوب' : 'Chest, waist, shoulder, sleeve, and custom fitting notes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {measurements.map((m) => {
          const cust = customers.find((c) => c.id === m.customerId);

          return (
            <div key={m.id} className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-3">
              <div className="flex items-center justify-between border-b border-[#C6A052]/10 pb-2">
                <span className="font-bold text-sm text-[#F4F1EA]">{cust?.name || 'عميل'}</span>
                <span className="text-[10px] text-[#A39B94]">{m.updatedAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#2A1C14] p-3 rounded-xl">
                <div>{language === 'ar' ? 'الصدر:' : 'Chest:'} <span className="font-bold text-[#C6A052]">{m.chest}cm</span></div>
                <div>{language === 'ar' ? 'الخصر:' : 'Waist:'} <span className="font-bold text-[#C6A052]">{m.waist}cm</span></div>
                <div>{language === 'ar' ? 'الكتف:' : 'Shoulder:'} <span className="font-bold text-[#C6A052]">{m.shoulder}cm</span></div>
                <div>{language === 'ar' ? 'الكم:' : 'Sleeve:'} <span className="font-bold text-[#C6A052]">{m.sleeveLength}cm</span></div>
                <div>{language === 'ar' ? 'طول الثوب:' : 'Length:'} <span className="font-bold text-[#C6A052]">{m.garmentLength}cm</span></div>
                <div>{language === 'ar' ? 'الياقة:' : 'Collar:'} <span className="font-bold text-[#C6A052]">{m.collar}cm</span></div>
              </div>

              {m.fittingNotes && (
                <p className="text-[11px] text-[#A39B94] italic bg-[#2A1C14]/50 p-2 rounded-lg">
                  "{m.fittingNotes}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
