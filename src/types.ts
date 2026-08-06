export type Role =
  | 'OWNER'
  | 'MANAGER'
  | 'CASHIER'
  | 'TAILOR'
  | 'DESIGNER'
  | 'WAREHOUSE'
  | 'PURCHASING'
  | 'SALES'
  | 'ACCOUNTANT'
  | 'PRODUCTION_MGR';

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
  city: string;
}

export type LeadIntent = 'HOT' | 'WARM' | 'COLD';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  leadScore: number; // 0 to 100
  leadIntent: LeadIntent;
  conversionProbability?: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  emailOpens: number;
  emailClicks: number;
  measurementTaken: boolean;
  preferredFabric?: string;
  tags: string[];
  notes: string;
  branchId: string;
  createdAt: string;
}

export interface EmailTrackingLog {
  id: string;
  customerId: string;
  customerName: string;
  type: 'EMAIL' | 'WHATSAPP';
  subject: string;
  content: string;
  sentAt: string;
  status: 'DELIVERED' | 'OPENED' | 'CLICKED' | 'FAILED';
  leadScoreImpact: number;
}

export interface MeasurementProfile {
  id: string;
  customerId: string;
  customerName: string;
  garmentType: 'THOBE' | 'SUIT' | 'ABAYA' | 'JACKET' | 'TUXEDO';
  chest: number; // in cm
  waist: number; // in cm
  shoulder: number; // in cm
  sleeveLength: number; // in cm
  collarSize: number; // in cm
  overallLength: number; // in cm
  armhole?: number;
  wrist?: number;
  notes?: string;
  updatedAt: string;
}

export interface FabricRoll {
  id: string;
  rollCode: string;
  supplierId: string;
  supplierName: string;
  fabricType: string; // e.g. "Super 150s Wool", "Japanese Silk Blend", "Linen"
  composition: string;
  color: string;
  patternCode: string;
  width: number; // in inches
  totalMeters: number;
  remainingMeters: number;
  costPerMeter: number;
  pricePerMeter: number;
  branchId: string;
  status: 'AVAILABLE' | 'RESERVED' | 'DEPLETED';
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  nameAr: string;
  nameEn: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  stockByBranch: Record<string, number>;
  reorderPoint: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  outstandingPayable: number;
}

export type OrderStatus =
  | 'NEW'
  | 'FITTING'
  | 'CUTTING'
  | 'SEWING'
  | 'QC'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface TailoringOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  garmentStyle: string; // e.g. "Emirati Thobe", "Saudi Standard Thobe", "Double-Breasted Italian Suit"
  measurementProfileId?: string;
  fabricRollId?: string;
  fabricName?: string;
  metersUsed?: number;
  assignedTailorId?: string;
  assignedTailorName?: string;
  status: OrderStatus;
  totalAmount: number;
  depositPaid: number;
  balanceDue: number;
  dueDate: string;
  createdAt: string;
  branchId: string;
  notes?: string;
}

export type ProductionStage = 'CUTTING' | 'SEWING' | 'FINISHING' | 'QC' | 'READY';

export interface ProductionTask {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  garmentName: string;
  currentStage: ProductionStage;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  dueDate: string;
  daysInStage: number;
  notes?: string;
}

export interface LineItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'FABRIC' | 'PRODUCT' | 'TAILORING_SERVICE';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName: string;
  cashierName: string;
  items: LineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  paymentMethod: 'CASH' | 'CARD' | 'WALLET' | 'SPLIT';
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  createdAt: string;
  branchId: string;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  type: 'IN' | 'OUT';
  partyName: string;
  relatedEntity: 'INVOICE' | 'ORDER' | 'PO' | 'EXPENSE';
  relatedId: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'WALLET';
  reference: string;
  date: string;
  branchId: string;
}

export interface POLineItem {
  id: string;
  itemName: string;
  fabricType?: string;
  metersOrUnits: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: POLineItem[];
  totalAmount: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
  branchId: string;
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  branchId: string;
  attendanceRate: number; // %
  monthlyCommission: number;
  assignedTasksCount: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

export interface NotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type: 'SYSTEM' | 'INVENTORY' | 'PRODUCTION' | 'PAYMENT' | 'LEAD';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserTask {
  id: string;
  titleAr: string;
  titleEn: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  actionRequired: boolean;
  relatedModule: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userName: string;
  userRole: Role;
  timestamp: string;
  details?: string;
}

export interface Expense {
  id: string;
  category: 'RENT' | 'UTILITIES' | 'SALARIES_COMMISSIONS' | 'MARKETING' | 'MAINTENANCE' | 'SYSTEM_SOFTWARE' | 'LOGISTICS' | 'OTHER';
  descriptionAr: string;
  descriptionEn: string;
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'BANK_TRANSFER';
  date: string;
  branchId: string;
  vendorName?: string;
  recordedBy: string;
}

export interface TailorShopTenant {
  id: string;
  nameAr: string;
  nameEn: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  crNumber: string; // Commercial Registration / VAT Tax ID
  taxRatePct: number;
  currencySymbol: string; // e.g. 'ج.س', 'ر.س', 'د.إ', 'USD'
  currencyCode: string;
  logoUrl?: string;
  addressAr: string;
  addressEn: string;
  subscriptionPlan: 'PRO_SAAS' | 'ENTERPRISE' | 'STARTER';
  activeBranchesCount: number;
  joinedDate: string;
  primaryColorHex?: string;
  receiptHeaderAr?: string;
  receiptFooterAr?: string;
}


