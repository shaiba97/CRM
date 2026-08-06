import React from 'react';
import { useApp } from '../../context/AppContext';
import { Kanban, Scissors, ArrowRight, ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { OrderStatus } from '../../types';

export const ProductionBoardView: React.FC = () => {
  const {
    tailoringOrders,
    updateOrderStatus,
    employees,
    language,
    formatCurrency,
  } = useApp();

  const STAGES: { key: OrderStatus; labelAr: string; labelEn: string; color: string }[] = [
    { key: 'CUTTING', labelAr: '1. قص الأقمشة', labelEn: '1. Fabric Cutting', color: 'border-amber-500/50' },
    { key: 'SEWING', labelAr: '2. الخياطة والتطريز', labelEn: '2. Sewing & Embroidery', color: 'border-blue-500/50' },
    { key: 'QC', labelAr: '3. فحص الجودة والتطابق', labelEn: '3. Quality Inspection', color: 'border-purple-500/50' },
    { key: 'READY', labelAr: '4. جاهز للتسليم والكي', labelEn: '4. Ready for Delivery', color: 'border-green-500/50' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Kanban className="w-5 h-5 text-[#C6A052]" />
          <span>{language === 'ar' ? 'لوحة مرحلة الإنتاج المباشرة (Kanban Board)' : 'Real-time Production Board'}</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          {language === 'ar' ? 'متابعة حركة الأودرات عبر خطوط الإنتاج والقص والخياطة والجودة' : 'Track orders across cutting, sewing, quality inspection, and ready stages.'}
        </p>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {STAGES.map((stage) => {
          const stageOrders = tailoringOrders.filter((o) => o.status === stage.key);

          return (
            <div
              key={stage.key}
              className={`p-4 rounded-2xl bg-[#36261C] border ${stage.color} shadow-lg space-y-3 flex flex-col justify-between min-h-[400px]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-2">
                  <h2 className="font-bold text-xs text-[#C6A052]">
                    {language === 'ar' ? stage.labelAr : stage.labelEn}
                  </h2>
                  <span className="w-5 h-5 rounded-full bg-[#2A1C14] text-[#C6A052] font-bold flex items-center justify-center text-[10px]">
                    {stageOrders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageOrders.length === 0 ? (
                    <div className="py-12 text-center text-[#A39B94] text-[11px] italic">
                      {language === 'ar' ? 'لا توجد طلبات حالياً في هذه المرحلة' : 'No active orders in stage'}
                    </div>
                  ) : (
                    stageOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/20 space-y-2 shadow"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#C6A052] font-mono">{ord.orderNumber}</span>
                          <span className="text-[#F4F1EA] text-[11px]">{ord.customerName}</span>
                        </div>

                        <div className="text-[11px] text-[#A39B94]">{ord.garmentStyle}</div>
                        <div className="text-[10px] text-[#A39B94]">
                          {language === 'ar' ? 'الخياط:' : 'Tailor:'} <span className="text-[#F4F1EA] font-semibold">{ord.assignedTailorName}</span>
                        </div>

                        {/* Stage transition controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10">
                          {stage.key === 'CUTTING' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'SEWING')}
                              className="w-full py-1.5 bg-[#C6A052] text-[#2A1C14] font-bold rounded-lg text-[10px] hover:bg-[#C6A052]/90 flex items-center justify-center gap-1"
                            >
                              <span>{language === 'ar' ? 'تحويل للخياطة ➔' : 'To Sewing ➔'}</span>
                            </button>
                          )}
                          {stage.key === 'SEWING' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'QC')}
                              className="w-full py-1.5 bg-[#C6A052] text-[#2A1C14] font-bold rounded-lg text-[10px] hover:bg-[#C6A052]/90 flex items-center justify-center gap-1"
                            >
                              <span>{language === 'ar' ? 'تحويل للفحص ➔' : 'To QC ➔'}</span>
                            </button>
                          )}
                          {stage.key === 'QC' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'READY')}
                              className="w-full py-1.5 bg-green-500 text-black font-bold rounded-lg text-[10px] flex items-center justify-center gap-1"
                            >
                              <span>{language === 'ar' ? 'اعتماد الجاهزية ➔' : 'Mark Ready ➔'}</span>
                            </button>
                          )}
                          {stage.key === 'READY' && (
                            <span className="text-[10px] text-green-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {language === 'ar' ? 'جاهز للتسليم والتحصيل' : 'Ready for pickup'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
