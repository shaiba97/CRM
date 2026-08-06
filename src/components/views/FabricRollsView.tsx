import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, Plus, Search, Scissors, AlertTriangle, Check, X } from 'lucide-react';

export const FabricRollsView: React.FC = () => {
  const {
    fabricRolls,
    suppliers,
    addFabricRoll,
    language,
    formatCurrency,
    formatNumber,
    activeBranchId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [rollCode, setRollCode] = useState(`FAB-NEW-${Math.floor(100 + Math.random() * 900)}`);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [fabricType, setFabricType] = useState('Super 150s Wool');
  const [composition, setComposition] = useState('100% Virgin Wool');
  const [color, setColor] = useState('أزرق ملكي (Royal Blue)');
  const [patternCode, setPatternCode] = useState('PT-ROY-150');
  const [width, setWidth] = useState(58);
  const [totalMeters, setTotalMeters] = useState(100);
  const [costPerMeter, setCostPerMeter] = useState(300);
  const [pricePerMeter, setPricePerMeter] = useState(600);

  const filteredRolls = fabricRolls.filter(
    (f) =>
      f.rollCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId) || suppliers[0];

    addFabricRoll({
      rollCode,
      supplierId: sup.id,
      supplierName: sup.name,
      fabricType,
      composition,
      color,
      patternCode,
      width,
      totalMeters,
      remainingMeters: totalMeters,
      costPerMeter,
      pricePerMeter,
      branchId: activeBranchId,
      status: 'AVAILABLE',
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C6A052]" />
            <span>{language === 'ar' ? 'كتالوج لفات الأقمشة والمترية' : 'Fabric Rolls & Meterage Catalog'}</span>
          </h1>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'تتبع دقيق لرصيد المترية المتبقي في كل لفة قماش، المصنع والمورد، والأسعار'
              : 'Meterage tracking per roll, supplier attribution, and pricing.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#C6A052] text-[#2A1C14] font-bold text-xs rounded-xl hover:bg-[#C6A052]/90 shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'ar' ? 'تسجيل لفة قماش جديدة' : 'Add Fabric Roll'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#C6A052] absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بكود اللفة، نوع القماش، اللون...' : 'Search code, type, color...'}
            className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl pr-9 pl-3 py-2 text-xs text-[#F4F1EA]"
          />
        </div>
      </div>

      {/* Grid of Fabric Rolls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
        {filteredRolls.map((roll) => {
          const pct = Math.round((roll.remainingMeters / roll.totalMeters) * 100);

          return (
            <div
              key={roll.id}
              className="p-5 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 hover:border-[#C6A052] transition-all shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#C6A052] px-2 py-0.5 rounded bg-[#2A1C14] border border-[#C6A052]/30">
                    {roll.rollCode}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      roll.status === 'AVAILABLE'
                        ? 'bg-green-950 text-green-300 border border-green-500/30'
                        : roll.status === 'RESERVED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {roll.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#F4F1EA]">{roll.fabricType}</h3>
                <p className="text-[11px] text-[#A39B94]">{roll.composition} | {language === 'ar' ? 'اللون:' : 'Color:'} {roll.color}</p>
                <div className="text-[11px] text-[#A39B94]">{language === 'ar' ? 'المورد:' : 'Supplier:'} <span className="text-[#F4F1EA] font-semibold">{roll.supplierName}</span></div>
              </div>

              {/* Progress meter bar */}
              <div className="space-y-1.5 pt-2 border-t border-[#C6A052]/10">
                <div className="flex items-center justify-between font-bold">
                  <span>{language === 'ar' ? 'الرصيد المتبقي:' : 'Remaining:'}</span>
                  <span className="text-[#C6A052]">{formatNumber(roll.remainingMeters)}m / {formatNumber(roll.totalMeters)}m</span>
                </div>
                <div className="w-full bg-[#2A1C14] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-[#C6A052]'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              {/* Price footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#C6A052]/10 font-bold">
                <span className="text-[#A39B94]">{language === 'ar' ? 'سعر المتر للعميل:' : 'Price/m:'}</span>
                <span className="text-base text-[#C6A052]">{formatCurrency(roll.pricePerMeter)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Fabric Roll Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#36261C] border border-[#C6A052]/40 rounded-2xl shadow-2xl p-6 text-[#F4F1EA] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-3">
              <h3 className="font-bold text-sm text-[#C6A052] flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة لفة قماش جديدة' : 'Add New Fabric Roll'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#A39B94] hover:text-[#F4F1EA]">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'كود اللفة' : 'Roll Code'}</label>
                  <input
                    type="text"
                    required
                    value={rollCode}
                    onChange={(e) => setRollCode(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'المورد' : 'Supplier'}</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'نوع القماش' : 'Fabric Type'}</label>
                <input
                  type="text"
                  required
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'التركيبة والنسيج' : 'Composition'}</label>
                  <input
                    type="text"
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'اللون' : 'Color'}</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'إجمالي الأمتار' : 'Total Meters'}</label>
                  <input
                    type="number"
                    value={totalMeters}
                    onChange={(e) => setTotalMeters(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#C6A052] mb-1">{language === 'ar' ? 'سعر بيع المتر' : 'Price per Meter'}</label>
                  <input
                    type="number"
                    value={pricePerMeter}
                    onChange={(e) => setPricePerMeter(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl p-2.5 text-[#F4F1EA]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#2A1C14] rounded-xl text-[#F4F1EA]"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C6A052] text-[#2A1C14] font-bold rounded-xl"
                >
                  {language === 'ar' ? 'حفظ اللفة' : 'Save Roll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
