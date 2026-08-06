import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Scissors, UserCheck, Layers, Ruler, DollarSign, Check, Sparkles } from 'lucide-react';

interface NewTailoringOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTailoringOrderModal: React.FC<NewTailoringOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    customers,
    fabricRolls,
    measurements,
    employees,
    addTailoringOrder,
    language,
    formatCurrency,
    activeBranchId,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [garmentStyle, setGarmentStyle] = useState<string>('ثوب إماراتي فاخر - أكمام كبك');
  const [selectedFabricRollId, setSelectedFabricRollId] = useState<string>('');
  const [metersUsed, setMetersUsed] = useState<number>(3.5);
  const [selectedTailorId, setSelectedTailorId] = useState<string>('e2');
  const [totalAmount, setTotalAmount] = useState<number>(3200);
  const [depositPaid, setDepositPaid] = useState<number>(1600);
  const [dueDate, setDueDate] = useState<string>('2026-08-15');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const selectedFabric = fabricRolls.find((f) => f.id === selectedFabricRollId) || fabricRolls[0];
  const selectedTailor = employees.find((e) => e.id === selectedTailorId) || employees[0];
  const customerMeasurement = measurements.find((m) => m.customerId === selectedCustomerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    addTailoringOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      garmentStyle,
      measurementProfileId: customerMeasurement?.id,
      fabricRollId: selectedFabric?.id,
      fabricName: selectedFabric?.fabricType,
      metersUsed,
      assignedTailorId: selectedTailor?.id,
      assignedTailorName: selectedTailor?.name,
      status: 'CUTTING',
      totalAmount,
      depositPaid,
      balanceDue: Math.max(0, totalAmount - depositPaid),
      dueDate,
      notes,
      branchId: activeBranchId,
    });

    onClose();
  };

  const STYLES = [
    'ثوب إماراتي فاخر - أكمام كبك',
    'ثوب سعودي كلاسيك - ياقة إيطالية',
    'بدلة رسمية إيطالية سليم فيت (صوف 150s)',
    'بشت ملكي مطرز بالزري الذهبي الأصلي',
    'عباءة فاخرة بالدانتيل الفرنسي',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F4F1EA] max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-[#2A1C14] border-b border-[#C6A052]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#C6A052]/20 text-[#C6A052]">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#C6A052]">
                {language === 'ar' ? 'معالج إنشاء طلب تفصيل جديد' : 'New Tailoring Order Wizard'}
              </h2>
              <p className="text-[11px] text-[#A39B94]">
                {language === 'ar' ? 'خطوة ' + step + ' من 4: تخصيص الأقمشة والقياسات' : `Step ${step} of 4`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#422F23] text-[#A39B94] hover:text-[#F4F1EA]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#2A1C14]/50 px-6 py-3 border-b border-[#C6A052]/10 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#C6A052] font-bold' : 'text-[#A39B94]'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
            <span>{language === 'ar' ? 'العميل والأزياء' : 'Customer'}</span>
          </div>
          <div className="w-8 h-[1px] bg-[#C6A052]/20"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#C6A052] font-bold' : 'text-[#A39B94]'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
            <span>{language === 'ar' ? 'القماش والمترية' : 'Fabric'}</span>
          </div>
          <div className="w-8 h-[1px] bg-[#C6A052]/20"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#C6A052] font-bold' : 'text-[#A39B94]'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
            <span>{language === 'ar' ? 'القياسات والأسعار' : 'Measurements'}</span>
          </div>
          <div className="w-8 h-[1px] bg-[#C6A052]/20"></div>
          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-[#C6A052] font-bold' : 'text-[#A39B94]'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">4</span>
            <span>{language === 'ar' ? 'المراجعة والاعتماد' : 'Review'}</span>
          </div>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-[#C6A052] mb-1.5">
                  {language === 'ar' ? 'اختيار العميل من سجلات CRM' : 'Select CRM Customer'}
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                >
                  <option value="">{language === 'ar' ? '-- اختر العميل --' : '-- Select Customer --'}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.leadIntent} ({c.leadScore}/100)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C6A052] mb-1.5">
                  {language === 'ar' ? 'نمط وأسلوب التفصيل' : 'Garment Style'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STYLES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGarmentStyle(st)}
                      className={`p-3 rounded-xl border text-right text-xs transition-all ${
                        garmentStyle === st
                          ? 'bg-[#422F23] border-[#C6A052] text-[#C6A052] font-bold'
                          : 'bg-[#2A1C14] border-[#C6A052]/20 text-[#F4F1EA] hover:border-[#C6A052]/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-[#C6A052] mb-1.5">
                  {language === 'ar' ? 'اختيار لفة القماش من المستودع' : 'Select Fabric Roll'}
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {fabricRolls.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setSelectedFabricRollId(f.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        selectedFabricRollId === f.id
                          ? 'bg-[#422F23] border-[#C6A052] font-bold'
                          : 'bg-[#2A1C14] border-[#C6A052]/20 hover:border-[#C6A052]/50'
                      }`}
                    >
                      <div>
                        <div className="text-[#C6A052] font-mono">{f.rollCode} - {f.fabricType}</div>
                        <div className="text-[11px] text-[#A39B94]">
                          {language === 'ar' ? 'اللون:' : 'Color:'} {f.color} | {language === 'ar' ? 'المتبقي:' : 'Available:'} {f.remainingMeters}m
                        </div>
                      </div>
                      <span className="font-bold text-[#C6A052]">{formatCurrency(f.pricePerMeter)}/m</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C6A052] mb-1.5">
                  {language === 'ar' ? 'المترية المطلوبة للتفصيل (بالمتر)' : 'Meters Required'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={metersUsed}
                  onChange={(e) => setMetersUsed(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-xs text-[#F4F1EA]"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Measurement Status */}
              <div className="p-3 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs">
                <div className="font-bold text-[#C6A052] mb-1 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4" />
                  {language === 'ar' ? 'سجل القياسات الحالية للعميل' : 'Customer Measurement Status'}
                </div>
                {customerMeasurement ? (
                  <p className="text-[11px] text-green-400">
                    {language === 'ar'
                      ? `قياسات متوفرة: الصدر ${customerMeasurement.chest}cm، الخصر ${customerMeasurement.waist}cm، الكتف ${customerMeasurement.shoulder}cm`
                      : 'Measurements on file'}
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-400">
                    {language === 'ar'
                      ? 'لا توجد قياسات مسجلة حالياً - سيقوم الأستايلست بأخذها فوراً'
                      : 'No measurement profile yet - tailor will take measurements during fitting'}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">
                    {language === 'ar' ? 'إجمالي سعر الطلب' : 'Total Price'}
                  </label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">
                    {language === 'ar' ? 'العربون / الدفعة المقدمة' : 'Deposit Amount'}
                  </label>
                  <input
                    type="number"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">
                    {language === 'ar' ? 'الخياط والأستايلست المسؤول' : 'Assigned Tailor'}
                  </label>
                  <select
                    value={selectedTailorId}
                    onChange={(e) => setSelectedTailorId(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                  >
                    {employees.filter((e) => e.role === 'TAILOR').map((e) => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">
                    {language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Due Delivery Date'}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="p-4 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl space-y-2">
                <div className="text-sm font-bold text-[#C6A052] border-b border-[#C6A052]/20 pb-2">
                  {language === 'ar' ? 'ملخص طلب التفصيل المعتمد' : 'Order Confirmation Summary'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[#A39B94]">
                  <div>{language === 'ar' ? 'العميل:' : 'Customer:'} <span className="font-bold text-[#F4F1EA]">{selectedCustomer?.name}</span></div>
                  <div>{language === 'ar' ? 'الهاتف:' : 'Phone:'} <span className="font-bold text-[#F4F1EA]">{selectedCustomer?.phone}</span></div>
                  <div>{language === 'ar' ? 'الأزياء:' : 'Garment:'} <span className="font-bold text-[#F4F1EA]">{garmentStyle}</span></div>
                  <div>{language === 'ar' ? 'القماش:' : 'Fabric:'} <span className="font-bold text-[#F4F1EA]">{selectedFabric?.fabricType}</span></div>
                  <div>{language === 'ar' ? 'المترية:' : 'Meters:'} <span className="font-bold text-[#F4F1EA]">{metersUsed}m</span></div>
                  <div>{language === 'ar' ? 'تاريخ التسليم:' : 'Due Date:'} <span className="font-bold text-[#F4F1EA]">{dueDate}</span></div>
                  <div>{language === 'ar' ? 'إجمالي المبلغ:' : 'Total:'} <span className="font-bold text-[#C6A052]">{formatCurrency(totalAmount)}</span></div>
                  <div>{language === 'ar' ? 'العربون المدفوع:' : 'Deposit:'} <span className="font-bold text-green-400">{formatCurrency(depositPaid)}</span></div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C6A052] mb-1">
                  {language === 'ar' ? 'ملاحظات خاصة بالتفصيل والتطريز' : 'Custom Tailoring Notes'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل أي ملاحظات حول الياقة، الكبك، الخياطة المخفية...' : 'Add custom notes...'}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-3 text-[#F4F1EA]"
                ></textarea>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#C6A052]/20">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-[#2A1C14] border border-[#C6A052]/30 text-[#F4F1EA] rounded-xl text-xs hover:bg-[#422F23]"
              >
                {language === 'ar' ? 'السابق' : 'Back'}
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow"
              >
                {language === 'ar' ? 'التالي ➔' : 'Next ➔'}
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow-lg flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                {language === 'ar' ? 'اعتماد وإنشاء الأودر' : 'Confirm & Create Order'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
