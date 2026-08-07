import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../Logo';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Sparkles,
  X,
  Building2,
  ChevronRight,
  LogOut,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Role } from '../../types';

interface LoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    users,
    login,
    logout,
    language,
    isLoginModalOpen,
    setIsLoginModalOpen,
    activeTenant,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const show = isOpen ?? (isLoginModalOpen || !currentUser);

  if (!show) return null;

  const handleClose = () => {
    if (!currentUser) return; // Must be logged in to dismiss if unauthenticated
    if (onClose) onClose();
    setIsLoginModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed');
      } else {
        setEmail('');
        setPassword('');
        if (onClose) onClose();
      }
    }, 300);
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setErrorMessage(null);
    setLoading(true);
    setTimeout(() => {
      const res = login(userEmail, userPass);
      setLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Quick login failed');
      } else {
        if (onClose) onClose();
      }
    }, 200);
  };

  const ROLE_BADGES: Record<Role, { labelAr: string; labelEn: string; colorClass: string }> = {
    OWNER: { labelAr: 'مالك المؤسسة (Owner)', labelEn: 'Owner', colorClass: 'bg-[#C6A052]/20 text-[#C6A052] border-[#C6A052]/40' },
    MANAGER: { labelAr: 'مدير النظام (Manager)', labelEn: 'Manager', colorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    CASHIER: { labelAr: 'أمين الصندوق (Cashier)', labelEn: 'Cashier', colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    TAILOR: { labelAr: 'أستايلست وخياط (Tailor)', labelEn: 'Tailor', colorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    DESIGNER: { labelAr: 'مصمم أزياء (Designer)', labelEn: 'Designer', colorClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
    WAREHOUSE: { labelAr: 'أمناء المخازن (Warehouse)', labelEn: 'Warehouse', colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
    PURCHASING: { labelAr: 'مسؤول مشتريات (Purchasing)', labelEn: 'Purchasing', colorClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
    SALES: { labelAr: 'مسؤول مبيعات (Sales)', labelEn: 'Sales', colorClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
    ACCOUNTANT: { labelAr: 'محاسب رئيسي (Accountant)', labelEn: 'Accountant', colorClass: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
    PRODUCTION_MGR: { labelAr: 'مدير إنتاج (Production)', labelEn: 'Production Mgr', colorClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#36261C] border border-[#C6A052]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-[#F4F1EA]">
        {/* Dismiss button if user is already logged in */}
        {currentUser && (
          <button
            onClick={handleClose}
            className="absolute top-3 left-3 z-10 p-2 rounded-xl bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] hover:bg-[#422F23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Left Section: Branding & Identity */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#2A1C14] via-[#1E130D] to-[#36261C] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C6A052]/20">
          <div>
            <Logo variant="full" size="lg" mode="dark" />
            <div className="mt-6 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6A052]/20 border border-[#C6A052]/40 text-[#C6A052] text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ar' ? 'نظام المصادقة المشفر' : 'Encrypted Workspace Auth'}</span>
              </span>
              <h2 className="text-xl font-bold text-[#F4F1EA] leading-snug">
                {language === 'ar'
                  ? 'منظومة كوفادو الرقمية لإدارة الصلاحيات وحسابات المستخدمين'
                  : 'KOFADO Tailoring CRM User Authentication'}
              </h2>
              <p className="text-xs text-[#A39B94] leading-relaxed">
                {language === 'ar'
                  ? 'قم بتسجيل الدخول للوصول إلى أدوات الخياطة المتقنة، المبيعات المباشرة، وحسابات الوردية.'
                  : 'Sign in to access your bespoke tailoring workspace, POS cashier, and production board.'}
              </p>
            </div>
          </div>

          {/* Tenant Identity Pill */}
          <div className="mt-8 pt-4 border-t border-[#C6A052]/15">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C6A052]/20 border border-[#C6A052]/40 flex items-center justify-center text-[#C6A052]">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#F4F1EA]">
                  {language === 'ar' ? activeTenant?.nameAr : activeTenant?.nameEn}
                </p>
                <p className="text-[10px] text-[#A39B94]">
                  {language === 'ar' ? 'المؤسسة النشطة' : 'Active Organization Workspace'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form & Quick Demo Switcher */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Active User Card if logged in */}
          {currentUser && (
            <div className="p-3.5 rounded-xl bg-[#2A1C14] border border-[#C6A052]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#C6A052] text-[#2A1C14] font-black flex items-center justify-center text-sm shadow">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F4F1EA]">{currentUser.name}</p>
                  <p className="text-[10px] text-[#A39B94]">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#C6A052] uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الدخول بالحساب' : 'Account Login'}</span>
              </h3>
              <span className="text-[10px] text-[#A39B94]">
                {language === 'ar' ? 'أدخل اسم المستخدم وكلمة السر' : 'Enter registered credentials'}
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A39B94]">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-2.5 w-4 h-4 text-[#A39B94]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@kofado.com"
                  className="w-full pl-3 pr-10 py-2.5 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] placeholder-[#A39B94]/50 focus:outline-none focus:border-[#C6A052]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A39B94]">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-2.5 w-4 h-4 text-[#A39B94]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] placeholder-[#A39B94]/50 focus:outline-none focus:border-[#C6A052]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-2.5 text-[#A39B94] hover:text-[#F4F1EA]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#C6A052] hover:bg-[#B59042] text-[#2A1C14] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'ar' ? 'جاري التحقق...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>{language === 'ar' ? 'دخول للنظام' : 'Sign In Now'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-[#C6A052]/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C6A052] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'دخول سريع كـ (شخصيات الأدوار):' : 'Quick Demo Persona Switcher:'}</span>
              </span>
              <span className="text-[10px] text-[#A39B94]">
                {language === 'ar' ? 'نقرة واحدة لاختبار الصلاحيات' : '1-Click role preview'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {users.map((u) => {
                const badge = ROLE_BADGES[u.role] || {
                  labelAr: u.role,
                  labelEn: u.role,
                  colorClass: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
                };
                const isCurrent = currentUser?.id === u.id;

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.email, u.password || 'owner123')}
                    className={`p-2.5 rounded-xl border text-right text-xs transition-all flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-[#422F23] border-[#C6A052] text-[#C6A052]'
                        : 'bg-[#2A1C14] border-[#C6A052]/20 hover:border-[#C6A052]/50 text-[#F4F1EA]'
                    }`}
                  >
                    <div className="truncate pl-2">
                      <p className="font-bold truncate text-[11px] group-hover:text-[#C6A052]">
                        {u.name}
                      </p>
                      <p className="text-[9px] text-[#A39B94] font-mono truncate">{u.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold border shrink-0 ${badge.colorClass}`}
                    >
                      {language === 'ar' ? badge.labelAr.split(' ')[0] : badge.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
