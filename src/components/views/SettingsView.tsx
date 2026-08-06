import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Languages, DollarSign, Sparkles, Building2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, useEasternNumerals, setUseEasternNumerals, branches } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#F4F1EA] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#C6A052]" />
          <span>إعدادات النظام والسمة الملكية (Settings)</span>
        </h1>
        <p className="text-xs text-[#A39B94] mt-1">
          تخصيص اللغة، الأرقام العربية/الإنجليزية، الفروع، وتنشيط خدمات الذكاء الاصطناعي
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow space-y-6 max-w-2xl">
        {/* Language & Numerals */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-2">
            <Languages className="w-4 h-4" />
            <span>اللغة والأرقام (Language & Numerals)</span>
          </h2>

          <div className="flex items-center justify-between p-3 bg-[#2A1C14] rounded-xl">
            <span>واجهة اللغة (Interface Language)</span>
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="px-4 py-2 bg-[#C6A052] text-[#2A1C14] font-bold rounded-lg"
            >
              {language === 'ar' ? 'العربية (Arabic)' : 'English'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#2A1C14] rounded-xl">
            <span>استخدام الأرقام الشرقية (١٢٣٤٥٦٧٨٩٠)</span>
            <input
              type="checkbox"
              checked={useEasternNumerals}
              onChange={(e) => setUseEasternNumerals(e.target.checked)}
              className="w-4 h-4 accent-[#C6A052]"
            />
          </div>
        </div>

        {/* AI Integration */}
        <div className="space-y-3 border-t border-[#C6A052]/10 pt-4">
          <h2 className="font-bold text-sm text-[#C6A052] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>تكامل خوارزميات الذكاء الاصطناعي (Gemini 2.5)</span>
          </h2>
          <p className="text-[11px] text-[#A39B94]">
            مفتاح Gemini API مفعل تلقائياً عبر بيئة AI Studio الآمنة لتقييم الذكاء الاصطناعي وصياغة البريد الإلكتروني.
          </p>
        </div>
      </div>
    </div>
  );
};
