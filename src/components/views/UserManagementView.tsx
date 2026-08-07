import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  KeyRound,
  Building2,
  Mail,
  Phone,
  Shield,
  UserCheck,
  AlertTriangle,
  X,
  Lock,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Role, User } from '../../types';

export const UserManagementView: React.FC = () => {
  const {
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    activeRole,
    branches = [],
    language,
    showToast,
  } = useApp();

  const isOwner = activeRole === 'OWNER' || currentUser?.role === 'OWNER';

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SALES' as Role,
    branchId: branches[0]?.id || 'b1',
    phone: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const [showFormPassword, setShowFormPassword] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'SALES' as Role,
      branchId: branches[0]?.id || 'b1',
      phone: '',
      status: 'ACTIVE',
    });
    setShowFormPassword(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      branchId: user.branchId || branches[0]?.id || 'b1',
      phone: user.phone || '',
      status: user.status,
    });
    setShowFormPassword(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast(language === 'ar' ? 'يرجى ملء كافة الحقول المطلوبة' : 'Please fill required fields', 'warning');
      return;
    }

    const res = addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim() || 'kofado123',
      role: formData.role,
      branchId: formData.branchId,
      phone: formData.phone.trim(),
      status: formData.status,
    });

    if (res.user) {
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role,
      branchId: formData.branchId,
      phone: formData.phone.trim(),
      status: formData.status,
    });

    setEditingUser(null);
    resetForm();
  };

  const handleDeleteUserConfirm = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    setDeletingUser(null);
  };

  const handleToggleStatus = (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateUser(user.id, { status: nextStatus });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesBranch = branchFilter === 'ALL' || u.branchId === branchFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesBranch && matchesStatus;
  });

  const ROLE_OPTIONS: { role: Role; labelAr: string; labelEn: string; color: string }[] = [
    { role: 'OWNER', labelAr: 'مالك المؤسسة (Owner)', labelEn: 'Owner', color: 'bg-[#C6A052]/20 text-[#C6A052] border-[#C6A052]/40' },
    { role: 'MANAGER', labelAr: 'مدير النظام (Manager)', labelEn: 'Manager', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    { role: 'CASHIER', labelAr: 'أمين الصندوق (Cashier)', labelEn: 'Cashier', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    { role: 'TAILOR', labelAr: 'أستايلست وخياط (Tailor)', labelEn: 'Tailor', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    { role: 'DESIGNER', labelAr: 'مصمم أزياء (Designer)', labelEn: 'Designer', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' },
    { role: 'WAREHOUSE', labelAr: 'أمناء المخازن (Warehouse)', labelEn: 'Warehouse', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
    { role: 'PURCHASING', labelAr: 'مسؤول مشتريات (Purchasing)', labelEn: 'Purchasing', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' },
    { role: 'SALES', labelAr: 'مسؤول مبيعات (Sales)', labelEn: 'Sales', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
    { role: 'ACCOUNTANT', labelAr: 'محاسب رئيسي (Accountant)', labelEn: 'Accountant', color: 'bg-teal-500/20 text-teal-400 border-teal-500/40' },
    { role: 'PRODUCTION_MGR', labelAr: 'مدير إنتاج (Production)', labelEn: 'Production Mgr', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs text-[#F4F1EA]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#36261C] p-5 rounded-2xl border border-[#C6A052]/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#C6A052]/20 text-[#C6A052] border border-[#C6A052]/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-[#F4F1EA]">
              {language === 'ar' ? 'إدارة المستخدمين والصلاحيات (Owner Control Center)' : 'User Management & Roles'}
            </h1>
          </div>
          <p className="text-xs text-[#A39B94] mt-1">
            {language === 'ar'
              ? 'إنشاء وتعديل وإلغاء حسابات الموظفين، تعيين الأدوار والصلاحيات، ومتابعة آخر تسجيل دخول.'
              : 'Create, update, and manage user accounts, assign roles, and monitor authentication.'}
          </p>
        </div>

        {/* Create User Button for OWNER */}
        {isOwner ? (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#C6A052] hover:bg-[#B59042] text-[#2A1C14] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة مستخدم جديد' : 'Create New User'}</span>
          </button>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{language === 'ar' ? 'عرض فقط (صلاحية الإضافة للمالك)' : 'View-only (Owner privilege required)'}</span>
          </div>
        )}
      </div>

      {/* Non-Owner Access Warning Banner */}
      {!isOwner && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold">
              {language === 'ar' ? 'تنبيه الصلاحيات (Owner Privilege Required)' : 'Access Notice'}
            </p>
            <p className="text-[#A39B94] text-[11px] mt-0.5">
              {language === 'ar'
                ? 'أنت تعمل حالياً بدور غير دور المالك. يمكنك تصفح المستخدمين، لكن إضافة أو تعديل أو حذف الحسابات محصورة لمالك المؤسسة.'
                : 'You are currently logged in with a non-Owner role. Modifications require Owner role.'}
            </p>
          </div>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#36261C] border border-[#C6A052]/20 shadow flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#A39B94]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، البريد أو الهاتف...' : 'Search name, email or phone...'}
            className="w-full pl-3 pr-9 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] placeholder-[#A39B94]/50 focus:outline-none focus:border-[#C6A052]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الأدوار الوظيفية' : 'All Roles'}</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.role} value={r.role}>
                {language === 'ar' ? r.labelAr : r.labelEn}
              </option>
            ))}
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الفروع' : 'All Branches'}</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {language === 'ar' ? b.nameAr : b.nameEn}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
          >
            <option value="ALL">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="ACTIVE">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
            <option value="INACTIVE">{language === 'ar' ? 'معطل (Inactive)' : 'Inactive'}</option>
          </select>
        </div>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const roleBadge = ROLE_OPTIONS.find((r) => r.role === user.role) || {
            labelAr: user.role,
            labelEn: user.role,
            color: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
          };
          const userBranch = branches.find((b) => b.id === user.branchId);
          const isSelf = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl bg-[#36261C] border transition-all shadow-lg flex flex-col justify-between space-y-4 ${
                isSelf ? 'border-[#C6A052] ring-1 ring-[#C6A052]/50' : 'border-[#C6A052]/20 hover:border-[#C6A052]/50'
              }`}
            >
              <div>
                {/* Header: Avatar, Name & Role */}
                <div className="flex items-start justify-between gap-2 border-b border-[#C6A052]/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A1C14] border border-[#C6A052]/40 text-[#C6A052] font-black flex items-center justify-center text-sm shadow">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#F4F1EA]">{user.name}</h3>
                        {isSelf && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C6A052] text-[#2A1C14]">
                            {language === 'ar' ? 'أنت' : 'You'}
                          </span>
                        )}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${roleBadge.color}`}>
                        {language === 'ar' ? roleBadge.labelAr : roleBadge.labelEn}
                      </span>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <button
                    onClick={() => isOwner && handleToggleStatus(user)}
                    disabled={!isOwner}
                    title={isOwner ? (language === 'ar' ? 'انقر لتعديل الحالة' : 'Click to toggle status') : ''}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 transition-all ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{language === 'ar' ? 'نشط' : 'Active'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>{language === 'ar' ? 'معطل' : 'Inactive'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* User Details */}
                <div className="mt-3 space-y-2 text-[#A39B94] text-xs">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C6A052] shrink-0" />
                    <span className="font-mono text-[#F4F1EA] truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C6A052] shrink-0" />
                    <span>{user.phone || (language === 'ar' ? 'غير مسجل' : 'N/A')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#C6A052] shrink-0" />
                    <span>
                      {userBranch ? (language === 'ar' ? userBranch.nameAr : userBranch.nameEn) : 'الفرع الرئيسي'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for OWNER */}
              <div className="pt-3 border-t border-[#C6A052]/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#A39B94]">
                  {language === 'ar' ? `تاريخ الإنشاء: ${user.createdAt}` : `Created: ${user.createdAt}`}
                </span>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="p-1.5 rounded-lg bg-[#2A1C14] border border-[#C6A052]/30 text-[#C6A052] hover:bg-[#422F23] transition-colors"
                      title={language === 'ar' ? 'تعديل المستخدم' : 'Edit user'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!isSelf && (
                      <button
                        onClick={() => setDeletingUser(user)}
                        className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 transition-colors"
                        title={language === 'ar' ? 'حذف الحساب' : 'Delete user'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-12 text-center bg-[#36261C] rounded-2xl border border-[#C6A052]/20 space-y-3">
          <Users className="w-10 h-10 text-[#C6A052] mx-auto opacity-50" />
          <p className="text-sm font-bold text-[#F4F1EA]">
            {language === 'ar' ? 'لم يتم العثور على أي حسابات مستخدمين مطابقة' : 'No users match the search filters'}
          </p>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#36261C] border border-[#C6A052]/30 rounded-2xl shadow-2xl p-6 space-y-5 text-[#F4F1EA]">
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-3">
              <h3 className="text-sm font-bold text-[#C6A052] flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>{language === 'ar' ? 'إنشاء حساب مستخدم جديد (Owner CRUD)' : 'Add New System User'}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'اسم الموظف الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="م. أحمد إبراهيم"
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'البريد الإلكتروني للتبادل *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmed@kofado.com"
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'كلمة المرور المشفرة *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="kofado123"
                      className="w-full pl-8 pr-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute left-2.5 top-2.5 text-[#A39B94]"
                    >
                      {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+249 91 000 0000"
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'الدور الوظيفي والصلاحيات *' : 'Role & Permissions *'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.role} value={r.role}>
                        {language === 'ar' ? r.labelAr : r.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'الفرع المخصص' : 'Assigned Branch'}
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {language === 'ar' ? b.nameAr : b.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#A39B94]">
                  {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="status"
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
                      className="accent-[#C6A052]"
                    />
                    <span className="text-emerald-400 font-bold">{language === 'ar' ? 'نشط (Active)' : 'Active'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="status"
                      value="INACTIVE"
                      checked={formData.status === 'INACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'INACTIVE' })}
                      className="accent-[#C6A052]"
                    />
                    <span className="text-rose-400 font-bold">{language === 'ar' ? 'معطل (Inactive)' : 'Inactive'}</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C6A052]/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#A39B94] hover:text-[#F4F1EA]"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A052] hover:bg-[#B59042] text-[#2A1C14] font-bold text-xs rounded-xl shadow"
                >
                  {language === 'ar' ? 'حفظ وإنشاء الحساب' : 'Save & Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#36261C] border border-[#C6A052]/30 rounded-2xl shadow-2xl p-6 space-y-5 text-[#F4F1EA]">
            <div className="flex items-center justify-between border-b border-[#C6A052]/20 pb-3">
              <h3 className="text-sm font-bold text-[#C6A052] flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <span>{language === 'ar' ? `تعديل بيانات: ${editingUser.name}` : `Edit User: ${editingUser.name}`}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-lg bg-[#2A1C14] text-[#A39B94] hover:text-[#F4F1EA]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showFormPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="اتركه دون تغيير للتجاهل"
                      className="w-full pl-8 pr-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="absolute left-2.5 top-2.5 text-[#A39B94]"
                    >
                      {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'الدور الوظيفي' : 'Role'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.role} value={r.role}>
                        {language === 'ar' ? r.labelAr : r.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A39B94]">
                    {language === 'ar' ? 'الفرع المخصص' : 'Assigned Branch'}
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#F4F1EA] focus:outline-none focus:border-[#C6A052]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {language === 'ar' ? b.nameAr : b.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#A39B94]">
                  {language === 'ar' ? 'حالة الحساب' : 'Status'}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="edit_status"
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'ACTIVE' })}
                      className="accent-[#C6A052]"
                    />
                    <span className="text-emerald-400 font-bold">{language === 'ar' ? 'نشط' : 'Active'}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="edit_status"
                      value="INACTIVE"
                      checked={formData.status === 'INACTIVE'}
                      onChange={() => setFormData({ ...formData, status: 'INACTIVE' })}
                      className="accent-[#C6A052]"
                    />
                    <span className="text-rose-400 font-bold">{language === 'ar' ? 'معطل' : 'Inactive'}</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#C6A052]/20 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#A39B94]"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C6A052] hover:bg-[#B59042] text-[#2A1C14] font-bold text-xs rounded-xl shadow"
                >
                  {language === 'ar' ? 'تحديث البيانات' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#36261C] border border-rose-500/40 rounded-2xl shadow-2xl p-6 space-y-4 text-[#F4F1EA]">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-full bg-rose-500/20 border border-rose-500/40">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-rose-300">
                {language === 'ar' ? 'تأكيد حذف حساب المستخدم' : 'Confirm Delete User'}
              </h3>
            </div>

            <p className="text-xs text-[#A39B94] leading-relaxed">
              {language === 'ar'
                ? `هل أنت أفق يقيناً من حذف حساب المستخدم (${deletingUser.name}) بدور (${deletingUser.role})؟ لن يتمكن من الوصول للنظام مجدداً.`
                : `Are you sure you want to permanently delete user (${deletingUser.name})?`}
            </p>

            <div className="pt-3 border-t border-[#C6A052]/20 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-[#2A1C14] border border-[#C6A052]/30 rounded-xl text-xs text-[#A39B94]"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow"
              >
                {language === 'ar' ? 'نعم، تأكيد الحذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
