import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Branch,
  Customer,
  EmailTrackingLog,
  MeasurementProfile,
  FabricRoll,
  Product,
  Supplier,
  TailoringOrder,
  ProductionStage,
  ProductionTask,
  Invoice,
  Payment,
  PurchaseOrder,
  Employee,
  NotificationItem,
  UserTask,
  LineItem,
  AuditLog,
  Expense,
  TailorShopTenant,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_CUSTOMERS,
  INITIAL_EMAIL_LOGS,
  INITIAL_MEASUREMENTS,
  INITIAL_FABRIC_ROLLS,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTION_TASKS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_TASKS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EXPENSES,
  INITIAL_TENANTS,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  // Config & Shell State
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  dir: 'rtl' | 'ltr';
  numeralStyle: 'ar' | 'en';
  setNumeralStyle: (style: 'ar' | 'en') => void;
  useEasternNumerals: boolean;
  setUseEasternNumerals: (useAr: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  // Multi-Tenant CRM State
  tenants: TailorShopTenant[];
  activeTenantId: string;
  activeTenant: TailorShopTenant;
  switchTenant: (tenantId: string) => void;
  addTenant: (tenantData: Omit<TailorShopTenant, 'id' | 'joinedDate'>) => TailorShopTenant;
  updateTenant: (tenantId: string, updates: Partial<TailorShopTenant>) => void;
  isNewTenantModalOpen: boolean;
  setIsNewTenantModalOpen: (open: boolean) => void;

  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  branches: Branch[];

  // Global Search Overlay & Command Palette
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;

  // Toast Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Domain Entities
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  calculateAILeadScore: (customerId: string) => Promise<void>;

  emailLogs: EmailTrackingLog[];
  sendCustomerCommunication: (
    customerId: string,
    type: 'EMAIL' | 'WHATSAPP',
    subject: string,
    content: string
  ) => void;

  measurements: MeasurementProfile[];
  saveMeasurement: (m: Omit<MeasurementProfile, 'id' | 'updatedAt'>) => void;

  fabricRolls: FabricRoll[];
  addFabricRoll: (roll: Omit<FabricRoll, 'id'>) => void;
  updateFabricRoll: (id: string, roll: Partial<FabricRoll>) => void;

  products: Product[];
  suppliers: Supplier[];

  tailoringOrders: TailoringOrder[];
  addTailoringOrder: (order: Omit<TailoringOrder, 'id' | 'orderNumber' | 'createdAt'>) => TailoringOrder;
  updateOrderStatus: (orderId: string, status: TailoringOrder['status']) => void;

  productionTasks: ProductionTask[];
  updateTaskStage: (taskId: string, newStage: ProductionTask['currentStage']) => void;

  invoices: Invoice[];
  payments: Payment[];
  purchaseOrders: PurchaseOrder[];
  employees: Employee[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  userTasks: UserTask[];
  auditLogs: AuditLog[];
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  // POS State
  posCart: LineItem[];
  addToPosCart: (item: LineItem) => void;
  removeFromPosCart: (itemId: string) => void;
  updatePosCartQty: (itemId: string, qty: number) => void;
  clearPosCart: () => void;
  checkoutPosCart: (
    customerName: string,
    paymentMethod: 'CASH' | 'CARD' | 'WALLET' | 'SPLIT',
    discount?: number
  ) => Invoice;
  completePosCheckout: (
    customerName: string,
    paymentMethod: 'CASH' | 'CARD' | 'WALLET' | 'SPLIT',
    discount?: number
  ) => Invoice;

  // Utility helper for formatting numbers according to locale preference
  formatNumber: (val?: number | string | null) => string;
  formatCurrency: (amount?: number | null) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const [numeralStyle, setNumeralStyle] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeBranchId, setActiveBranchId] = useState<string>('b1');
  const [activeRole, setActiveRole] = useState<Role>('OWNER');

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Entities
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [emailLogs, setEmailLogs] = useState<EmailTrackingLog[]>(INITIAL_EMAIL_LOGS);
  const [measurements, setMeasurements] = useState<MeasurementProfile[]>(INITIAL_MEASUREMENTS);
  const [fabricRolls, setFabricRolls] = useState<FabricRoll[]>(INITIAL_FABRIC_ROLLS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [tailoringOrders, setTailoringOrders] = useState<TailoringOrder[]>(INITIAL_ORDERS);
  const [productionTasks, setProductionTasks] = useState<ProductionTask[]>(INITIAL_PRODUCTION_TASKS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [userTasks, setUserTasks] = useState<UserTask[]>(INITIAL_USER_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);

  // POS Cart
  const [posCart, setPosCart] = useState<LineItem[]>([]);

  // Load Live Data from Neon PostgreSQL Database
  useEffect(() => {
    async function loadNeonData() {
      try {
        const res = await fetch('/api/db/data');
        if (res.ok) {
          const data = await res.json();
          if (data.tenants && data.tenants.length > 0) setTenants(data.tenants);
          if (data.branches) setBranches(data.branches);
          if (data.customers) setCustomers(data.customers);
          if (data.emailLogs) setEmailLogs(data.emailLogs);
          if (data.measurements) setMeasurements(data.measurements);
          if (data.fabricRolls) setFabricRolls(data.fabricRolls);
          if (data.products) setProducts(data.products);
          if (data.suppliers) setSuppliers(data.suppliers);
          if (data.orders) setTailoringOrders(data.orders);
          if (data.productionTasks) setProductionTasks(data.productionTasks);
          if (data.invoices) setInvoices(data.invoices);
          if (data.payments) setPayments(data.payments);
          if (data.purchaseOrders) setPurchaseOrders(data.purchaseOrders);
          if (data.employees) setEmployees(data.employees);
          if (data.notifications) setNotifications(data.notifications);
          if (data.userTasks) setUserTasks(data.userTasks);
          if (data.expenses) setExpenses(data.expenses);
        }
      } catch (err) {
        console.error('Failed to load data from Neon PostgreSQL database:', err);
      }
    }
    loadNeonData();
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const generateUniqueId = (prefix: string = '') =>
    `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const showToast = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = generateUniqueId('t_');
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Multi-Tenant State
  const [tenants, setTenants] = useState<TailorShopTenant[]>(INITIAL_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState<string>('tenant_kofado_main');
  const [isNewTenantModalOpen, setIsNewTenantModalOpen] = useState<boolean>(false);

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const switchTenant = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (target) {
      setActiveTenantId(tenantId);
      showToast(
        language === 'ar'
          ? `تم الانتقال بنجاح إلى مؤسسة: ${target.nameAr}`
          : `Switched to tailor shop: ${target.nameEn}`,
        'info'
      );
    }
  };

  const addTenant = (tenantData: Omit<TailorShopTenant, 'id' | 'joinedDate'>): TailorShopTenant => {
    const newTenant: TailorShopTenant = {
      ...tenantData,
      id: generateUniqueId('tenant_'),
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setTenants((prev) => [newTenant, ...prev]);
    setActiveTenantId(newTenant.id);

    fetch('/api/db/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTenant),
    }).catch((e) => console.error('Failed to save tenant to Neon PostgreSQL:', e));

    showToast(
      language === 'ar'
        ? `تم تسجيل دار الخياطة الجديدة وحفظها في قاعدة البيانات: ${newTenant.nameAr}`
        : `Registered new tailor shop in database: ${newTenant.nameEn}`
    );
    return newTenant;
  };

  const updateTenant = (tenantId: string, updates: Partial<TailorShopTenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, ...updates } : t)));

    fetch(`/api/db/tenants/${tenantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch((e) => console.error('Failed to update tenant in Neon PostgreSQL:', e));

    showToast(language === 'ar' ? 'تم تحديث إعدادات دار الخياطة في قاعدة البيانات' : 'Tailor shop updated in database');
  };

  // Convert Western numerals to Arabic-Indic numerals if numeralStyle === 'ar'
  const formatNumber = (val?: number | string | null): string => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    if (numeralStyle !== 'ar') return str;
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return str.replace(/\d/g, (d) => arabicDigits[parseInt(d, 10)]);
  };

  const formatCurrency = (amount?: number | null): string => {
    const sym = activeTenant?.currencySymbol || 'ج.س';
    const code = activeTenant?.currencyCode || 'SDG';
    if (amount === undefined || amount === null || typeof amount !== 'number' || isNaN(amount)) {
      const zeroStr = formatNumber(0);
      return language === 'ar' ? `${zeroStr} ${sym}` : `${zeroStr} ${code}`;
    }
    const formattedVal = formatNumber(amount.toLocaleString());
    return language === 'ar' ? `${formattedVal} ${sym}` : `${formattedVal} ${code}`;
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const id = generateUniqueId('c_');
    const newCust: Customer = {
      ...custData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);

    fetch('/api/db/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCust, tenantId: activeTenantId }),
    }).catch((e) => console.error('Failed to save customer to Neon PostgreSQL:', e));

    showToast(language === 'ar' ? 'تم إضافة العميل بنجاح في قاعدة البيانات' : 'Customer saved to database');
    return newCust;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    fetch(`/api/db/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.error('Failed to update customer in Neon PostgreSQL:', e));

    showToast(language === 'ar' ? 'تم تحديث بيانات العميل' : 'Customer updated');
  };

  const calculateAILeadScore = async (customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    showToast(language === 'ar' ? 'جاري حساب تقييم الذكاء الاصطناعي للعميل...' : 'Calculating AI Lead Score...', 'info');

    try {
      const res = await fetch('/api/ai/lead-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cust.name,
          totalSpent: cust.totalSpent,
          orderCount: cust.orderCount,
          emailOpens: cust.emailOpens,
          emailClicks: cust.emailClicks,
          measurementTaken: cust.measurementTaken,
          preferredFabric: cust.preferredFabric,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateCustomer(customerId, {
          leadScore: data.score,
          leadIntent: data.intent,
          conversionProbability: data.conversionProbability,
        });

        // Add notification
        const newNotif: NotificationItem = {
          id: generateUniqueId('n_'),
          titleAr: `تحديث التقييم: ${cust.name}`,
          titleEn: `Score Updated: ${cust.name}`,
          messageAr: `حسب الذكاء الاصطناعي: النتيجة ${data.score}/100 (${data.intent}). ${data.summaryArabic}`,
          messageEn: `AI Lead Score: ${data.score}/100 (${data.intent}). ${data.recommendedAction}`,
          type: 'LEAD',
          read: false,
          createdAt: 'الآن',
          link: '/customers',
        };
        setNotifications((prev) => [newNotif, ...prev]);
        showToast(language === 'ar' ? `تم حساب التقييم: ${data.score}/100 (${data.intent})` : `Score: ${data.score}/100 (${data.intent})`);
      }
    } catch (e) {
      console.error(e);
      showToast(language === 'ar' ? 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' : 'AI scoring failed', 'error');
    }
  };

  const sendCustomerCommunication = (
    customerId: string,
    type: 'EMAIL' | 'WHATSAPP',
    subject: string,
    content: string
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return;

    const newLog: EmailTrackingLog = {
      id: generateUniqueId('el_'),
      customerId,
      customerName: cust.name,
      type,
      subject,
      content,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'DELIVERED',
      leadScoreImpact: type === 'EMAIL' ? +5 : +10,
    };

    setEmailLogs((prev) => [newLog, ...prev]);

    // Update customer stats
    const updatedOpens = cust.emailOpens + 1;
    const newScore = Math.min(100, cust.leadScore + (type === 'EMAIL' ? 5 : 10));
    const newIntent = newScore >= 75 ? 'HOT' : newScore >= 40 ? 'WARM' : 'COLD';

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              emailOpens: updatedOpens,
              leadScore: newScore,
              leadIntent: newIntent,
            }
          : c
      )
    );

    showToast(
      language === 'ar'
        ? `تم إرسال ${type === 'EMAIL' ? 'البريد الإلكتروني' : 'رسالة الواتساب'} بنجاح وحُسب التفاعل`
        : `${type} message sent successfully and tracked`
    );
  };

  const saveMeasurement = (mData: Omit<MeasurementProfile, 'id' | 'updatedAt'>) => {
    const existing = measurements.find((m) => m.customerId === mData.customerId && m.garmentType === mData.garmentType);
    const updatedAt = new Date().toISOString().split('T')[0];
    const id = existing ? existing.id : generateUniqueId('m_');

    const newM: MeasurementProfile = {
      ...mData,
      id,
      updatedAt,
    };

    if (existing) {
      setMeasurements((prev) =>
        prev.map((m) => (m.id === existing.id ? { ...m, ...mData, updatedAt } : m))
      );
    } else {
      setMeasurements((prev) => [newM, ...prev]);
    }

    // Mark measurement taken on customer
    setCustomers((prev) =>
      prev.map((c) => (c.id === mData.customerId ? { ...c, measurementTaken: true } : c))
    );

    fetch('/api/db/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newM, tenantId: activeTenantId }),
    }).catch((e) => console.error('Failed to save measurement to Neon PostgreSQL:', e));

    showToast(language === 'ar' ? 'تم حفظ ملف القياسات المتقنة في قاعدة البيانات' : 'Measurement profile saved to database');
  };

  const addFabricRoll = (rollData: Omit<FabricRoll, 'id'>) => {
    const newRoll: FabricRoll = {
      ...rollData,
      id: generateUniqueId('fr_'),
    };
    setFabricRolls((prev) => [newRoll, ...prev]);
    showToast(language === 'ar' ? 'تم تسجيل لفة قماش جديدة' : 'New fabric roll added');
  };

  const updateFabricRoll = (id: string, updated: Partial<FabricRoll>) => {
    setFabricRolls((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const addTailoringOrder = (
    orderData: Omit<TailoringOrder, 'id' | 'orderNumber' | 'createdAt'>
  ): TailoringOrder => {
    const id = generateUniqueId('ord_');
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString().split('T')[0];

    const newOrder: TailoringOrder = {
      ...orderData,
      id,
      orderNumber,
      createdAt,
    };

    setTailoringOrders((prev) => [newOrder, ...prev]);

    // Create initial production task
    const newTask: ProductionTask = {
      id: generateUniqueId('pt_'),
      orderId: id,
      orderNumber,
      customerName: orderData.customerName,
      garmentName: orderData.garmentStyle,
      currentStage: 'CUTTING',
      assignedEmployeeId: orderData.assignedTailorId || 'e2',
      assignedEmployeeName: orderData.assignedTailorName || 'الأستايلست أحمد خياط',
      dueDate: orderData.dueDate,
      daysInStage: 0,
      notes: orderData.notes,
    };
    setProductionTasks((prev) => [newTask, ...prev]);

    // Decrement meters on fabric roll if selected
    if (orderData.fabricRollId && orderData.metersUsed) {
      setFabricRolls((prev) =>
        prev.map((r) =>
          r.id === orderData.fabricRollId
            ? {
                ...r,
                remainingMeters: Math.max(0, r.remainingMeters - (orderData.metersUsed || 0)),
              }
            : r
        )
      );
    }

    // Update customer stats
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === orderData.customerId
          ? {
              ...c,
              totalSpent: c.totalSpent + orderData.totalAmount,
              orderCount: c.orderCount + 1,
              lastOrderDate: createdAt,
              leadScore: Math.min(100, c.leadScore + 20),
              leadIntent: 'HOT',
            }
          : c
      )
    );

    fetch('/api/db/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newOrder, tenantId: activeTenantId }),
    }).catch((e) => console.error('Failed to save order to Neon PostgreSQL:', e));

    showToast(language === 'ar' ? `تم إنشاء طلب التفصيل رقم ${orderNumber} وحفظه في قاعدة البيانات` : `Tailoring order ${orderNumber} created and saved to database`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: TailoringOrder['status']) => {
    setTailoringOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    fetch(`/api/db/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((e) => console.error('Failed to update order status in Neon PostgreSQL:', e));

    showToast(language === 'ar' ? `تم تحديث حالة الطلب إلى: ${status}` : `Order status updated to ${status}`);
  };

  const updateTaskStage = (taskId: string, newStage: ProductionStage) => {
    setProductionTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, currentStage: newStage, daysInStage: 0 } : t))
    );

    // Sync back to order status if applicable
    const task = productionTasks.find((t) => t.id === taskId);
    if (task) {
      const mappedOrderStatus: TailoringOrder['status'] =
        newStage === 'CUTTING'
          ? 'CUTTING'
          : newStage === 'SEWING'
          ? 'SEWING'
          : newStage === 'QC'
          ? 'QC'
          : newStage === 'READY'
          ? 'READY'
          : 'SEWING';

      setTailoringOrders((prev) =>
        prev.map((o) => (o.id === task.orderId ? { ...o, status: mappedOrderStatus } : o))
      );
    }

    showToast(language === 'ar' ? `تم نقل المهمة إلى مرحلة: ${newStage}` : `Task moved to stage ${newStage}`);
  };

  const addToPosCart = (item: LineItem) => {
    setPosCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      const unitPrice = item.unitPrice || 0;
      const quantity = item.quantity || 1;
      const totalPrice = item.totalPrice ?? (quantity * unitPrice);

      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].quantity + quantity;
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          totalPrice: newQty * updated[idx].unitPrice,
        };
        return updated;
      }
      return [...prev, { ...item, quantity, unitPrice, totalPrice }];
    });
  };

  const removeFromPosCart = (itemId: string) => {
    setPosCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updatePosCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromPosCart(itemId);
      return;
    }
    setPosCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: qty, totalPrice: qty * i.unitPrice } : i))
    );
  };

  const clearPosCart = () => setPosCart([]);

  const checkoutPosCart = (
    customerName: string,
    paymentMethod: 'CASH' | 'CARD' | 'WALLET' | 'SPLIT',
    discount: number = 0
  ): Invoice => {
    const subtotal = posCart.reduce((sum, i) => sum + (i.totalPrice || 0), 0);
    const total = Math.max(0, subtotal - discount);
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: Invoice = {
      id: generateUniqueId('inv_'),
      invoiceNumber,
      customerName: customerName || 'عميل نقدي (Walk-in)',
      cashierName: 'فاطمة النور (أمين الصندوق)',
      items: [...posCart],
      subtotal,
      discount,
      tax: 0,
      total,
      paidAmount: total,
      paymentMethod,
      status: 'PAID',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      branchId: activeBranchId,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Record payment
    const newPayment: Payment = {
      id: generateUniqueId('pay_'),
      paymentNumber: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'IN',
      partyName: customerName || 'عميل نقدي',
      relatedEntity: 'INVOICE',
      relatedId: newInvoice.id,
      amount: total,
      method: paymentMethod === 'SPLIT' ? 'CARD' : paymentMethod,
      reference: `POS-TXN-${generateUniqueId().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      branchId: activeBranchId,
    };
    setPayments((prev) => [newPayment, ...prev]);

    clearPosCart();
    showToast(language === 'ar' ? `تم إكمال عملية البيع وإصدار الفاتورة ${invoiceNumber}` : `Invoice ${invoiceNumber} issued`);
    return newInvoice;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addExpense = (expData: Omit<Expense, 'id'>) => {
    const newExp: Expense = {
      ...expData,
      id: generateUniqueId('exp_'),
    };
    setExpenses((prev) => [newExp, ...prev]);

    fetch('/api/db/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newExp, tenantId: activeTenantId }),
    }).catch((e) => console.error('Failed to save expense in Neon PostgreSQL:', e));

    // Record an outgoing payment entry
    const newPayment: Payment = {
      id: generateUniqueId('pay_'),
      paymentNumber: `PAY-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'OUT',
      partyName: expData.vendorName || expData.descriptionAr,
      relatedEntity: 'EXPENSE',
      relatedId: newExp.id,
      amount: expData.amount,
      method: expData.paymentMethod === 'CARD' ? 'CARD' : expData.paymentMethod === 'BANK_TRANSFER' ? 'BANK_TRANSFER' : 'CASH',
      reference: `EXP-REF-${generateUniqueId().slice(-6)}`,
      date: expData.date,
      branchId: expData.branchId || activeBranchId,
    };
    setPayments((prev) => [newPayment, ...prev]);

    showToast(
      language === 'ar'
        ? `تم تسجيل المصروف بقيمة ${formatCurrency(expData.amount)} بنجاح`
        : `Expense recorded: ${formatCurrency(expData.amount)}`
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        numeralStyle,
        setNumeralStyle,
        useEasternNumerals: numeralStyle === 'ar',
        setUseEasternNumerals: (useAr: boolean) => setNumeralStyle(useAr ? 'ar' : 'en'),
        theme,
        setTheme,
        activeBranchId,
        setActiveBranchId,
        activeRole,
        setActiveRole,
        branches,

        tenants,
        activeTenantId,
        activeTenant,
        switchTenant,
        addTenant,
        updateTenant,
        isNewTenantModalOpen,
        setIsNewTenantModalOpen,

        isSearchOpen,
        setIsSearchOpen,
        globalSearchQuery,
        setGlobalSearchQuery,

        activeTab,
        setActiveTab,
        sidebarExpanded,
        setSidebarExpanded,

        toasts,
        showToast,
        removeToast,

        customers,
        addCustomer,
        updateCustomer,
        calculateAILeadScore,

        emailLogs,
        sendCustomerCommunication,

        measurements,
        saveMeasurement,

        fabricRolls,
        addFabricRoll,
        updateFabricRoll,

        products,
        suppliers,

        tailoringOrders,
        addTailoringOrder,
        updateOrderStatus,

        productionTasks,
        updateTaskStage,

        invoices,
        payments,
        purchaseOrders,
        employees,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        userTasks,
        auditLogs,
        expenses,
        addExpense,

        posCart,
        addToPosCart,
        removeFromPosCart,

        updatePosCartQty,
        clearPosCart,
        checkoutPosCart,
        completePosCheckout: checkoutPosCart,

        formatNumber,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
