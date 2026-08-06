import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
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

dotenv.config();

const DEFAULT_NEON_URL =
  'postgresql://neondb_owner:npg_62lZJXHqhbmp@ep-super-lab-az4auhbi-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || DEFAULT_NEON_URL;
    pool = new Pool({ connectionString });
  }
  return pool;
}

/**
 * Creates tables in Neon PostgreSQL if they do not exist, and seeds initial data if empty.
 */
export async function initializeDatabaseSchema() {
  const db = getDbPool();

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id TEXT PRIMARY KEY,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        owner_name TEXT NOT NULL,
        owner_email TEXT,
        owner_phone TEXT NOT NULL,
        cr_number TEXT,
        tax_rate_pct NUMERIC DEFAULT 15,
        currency_symbol TEXT DEFAULT 'ج.س',
        currency_code TEXT DEFAULT 'SDG',
        address_ar TEXT,
        address_en TEXT,
        subscription_plan TEXT DEFAULT 'PRO_SAAS',
        active_branches_count INT DEFAULT 1,
        joined_date TEXT,
        primary_color_hex TEXT,
        receipt_header_ar TEXT,
        receipt_footer_ar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS branches (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        code TEXT NOT NULL,
        city TEXT
      );

      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        city TEXT,
        preferred_fabric TEXT,
        total_spent NUMERIC DEFAULT 0,
        orders_count INT DEFAULT 0,
        lead_score INT DEFAULT 50,
        lead_intent TEXT DEFAULT 'WARM',
        conversion_probability TEXT,
        last_order_date TEXT,
        email_opens INT DEFAULT 0,
        email_clicks INT DEFAULT 0,
        measurement_taken BOOLEAN DEFAULT FALSE,
        tags_json TEXT,
        notes TEXT,
        branch_id TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
        customer_name TEXT,
        type TEXT,
        subject TEXT,
        content TEXT,
        sent_at TEXT,
        status TEXT,
        lead_score_impact INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS measurements (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
        customer_name TEXT,
        garment_type TEXT,
        chest NUMERIC,
        waist NUMERIC,
        shoulder NUMERIC,
        sleeve_length NUMERIC,
        collar_size NUMERIC,
        overall_length NUMERIC,
        armhole NUMERIC,
        wrist NUMERIC,
        notes TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        category TEXT,
        outstanding_payable NUMERIC DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS fabric_rolls (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        roll_code TEXT NOT NULL,
        supplier_id TEXT,
        supplier_name TEXT,
        fabric_type TEXT,
        composition TEXT,
        color TEXT,
        pattern_code TEXT,
        width NUMERIC,
        total_meters NUMERIC,
        remaining_meters NUMERIC,
        cost_per_meter NUMERIC,
        price_per_meter NUMERIC,
        branch_id TEXT,
        status TEXT DEFAULT 'AVAILABLE'
      );

      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        sku TEXT NOT NULL,
        barcode TEXT,
        name_ar TEXT NOT NULL,
        name_en TEXT NOT NULL,
        category TEXT,
        cost_price NUMERIC,
        selling_price NUMERIC,
        stock_json TEXT,
        reorder_point INT DEFAULT 10
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        order_number TEXT NOT NULL,
        customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
        customer_name TEXT,
        customer_phone TEXT,
        garment_style TEXT,
        measurement_profile_id TEXT,
        fabric_roll_id TEXT,
        fabric_name TEXT,
        meters_used NUMERIC,
        assigned_tailor_id TEXT,
        assigned_tailor_name TEXT,
        status TEXT DEFAULT 'NEW',
        total_amount NUMERIC NOT NULL,
        deposit_paid NUMERIC DEFAULT 0,
        balance_due NUMERIC DEFAULT 0,
        due_date TEXT,
        created_at TEXT,
        branch_id TEXT,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS production_tasks (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
        order_number TEXT,
        customer_name TEXT,
        garment_name TEXT,
        current_stage TEXT,
        assigned_employee_id TEXT,
        assigned_employee_name TEXT,
        due_date TEXT,
        days_in_stage INT DEFAULT 0,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        invoice_number TEXT NOT NULL,
        customer_id TEXT,
        customer_name TEXT,
        cashier_name TEXT,
        items_json TEXT,
        subtotal NUMERIC,
        discount NUMERIC,
        tax NUMERIC,
        total NUMERIC,
        paid_amount NUMERIC,
        payment_method TEXT,
        status TEXT,
        created_at TEXT,
        branch_id TEXT
      );

      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        payment_number TEXT NOT NULL,
        type TEXT,
        party_name TEXT,
        related_entity TEXT,
        related_id TEXT,
        amount NUMERIC,
        method TEXT,
        reference TEXT,
        date TEXT,
        branch_id TEXT
      );

      CREATE TABLE IF NOT EXISTS purchase_orders (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        po_number TEXT NOT NULL,
        supplier_id TEXT,
        supplier_name TEXT,
        items_json TEXT,
        total_amount NUMERIC,
        status TEXT,
        created_at TEXT,
        branch_id TEXT
      );

      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        branch_id TEXT,
        attendance_rate NUMERIC,
        monthly_commission NUMERIC,
        assigned_tasks_count INT DEFAULT 0,
        status TEXT DEFAULT 'ACTIVE'
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        title_ar TEXT,
        title_en TEXT,
        message_ar TEXT,
        message_en TEXT,
        type TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TEXT,
        link TEXT
      );

      CREATE TABLE IF NOT EXISTS user_tasks (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        title_ar TEXT,
        title_en TEXT,
        description TEXT,
        priority TEXT,
        due_date TEXT,
        action_required BOOLEAN DEFAULT TRUE,
        related_module TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_role TEXT NOT NULL,
        timestamp TEXT,
        details TEXT
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
        category TEXT NOT NULL,
        description_ar TEXT,
        description_en TEXT,
        amount NUMERIC NOT NULL,
        payment_method TEXT,
        date TEXT,
        branch_id TEXT,
        vendor_name TEXT,
        recorded_by TEXT
      );
    `);

    // Seed mock data into Neon PostgreSQL if tables are empty
    await seedDatabaseIfEmpty(db);

    console.log('✅ Neon PostgreSQL database schema and initial mock data verified & seeded successfully.');
    return { success: true };
  } catch (err: any) {
    console.error('❌ Neon PostgreSQL initialization error:', err?.message || err);
    return { success: false, error: err?.message };
  }
}

/**
 * Populate Neon PostgreSQL tables with initial data if empty.
 */
async function seedDatabaseIfEmpty(db: Pool) {
  const defaultTenantId = 'tenant_kofado_main';

  // Seed Tenants
  const tenantCheck = await db.query('SELECT COUNT(*) FROM tenants');
  if (parseInt(tenantCheck.rows[0].count, 10) === 0) {
    for (const t of INITIAL_TENANTS) {
      await db.query(
        `INSERT INTO tenants (
          id, name_ar, name_en, owner_name, owner_email, owner_phone, cr_number, tax_rate_pct,
          currency_symbol, currency_code, address_ar, address_en, subscription_plan, active_branches_count,
          joined_date, primary_color_hex, receipt_header_ar, receipt_footer_ar
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO NOTHING`,
        [
          t.id, t.nameAr, t.nameEn, t.ownerName, t.ownerEmail, t.ownerPhone, t.crNumber, t.taxRatePct,
          t.currencySymbol, t.currencyCode, t.addressAr, t.addressEn, t.subscriptionPlan, t.activeBranchesCount,
          t.joinedDate, t.primaryColorHex, t.receiptHeaderAr, t.receiptFooterAr
        ]
      );
    }
  }

  // Seed Branches
  const branchCheck = await db.query('SELECT COUNT(*) FROM branches');
  if (parseInt(branchCheck.rows[0].count, 10) === 0) {
    for (const b of INITIAL_BRANCHES) {
      await db.query(
        `INSERT INTO branches (id, tenant_id, name_ar, name_en, code, city) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [b.id, defaultTenantId, b.nameAr, b.nameEn, b.code, b.city]
      );
    }
  }

  // Seed Customers
  const custCheck = await db.query('SELECT COUNT(*) FROM customers');
  if (parseInt(custCheck.rows[0].count, 10) === 0) {
    for (const c of INITIAL_CUSTOMERS) {
      await db.query(
        `INSERT INTO customers (
          id, tenant_id, name, phone, email, city, preferred_fabric, total_spent, orders_count,
          lead_score, lead_intent, conversion_probability, last_order_date, email_opens, email_clicks,
          measurement_taken, tags_json, notes, branch_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) ON CONFLICT (id) DO NOTHING`,
        [
          c.id, defaultTenantId, c.name, c.phone, c.email, (c as any).city || 'الخرطوم', c.preferredFabric,
          c.totalSpent, c.orderCount, c.leadScore, c.leadIntent, c.conversionProbability,
          c.lastOrderDate, c.emailOpens, c.emailClicks, c.measurementTaken, JSON.stringify(c.tags || []),
          c.notes, c.branchId, c.createdAt
        ]
      );
    }
  }

  // Seed Email Logs
  const emailCheck = await db.query('SELECT COUNT(*) FROM email_logs');
  if (parseInt(emailCheck.rows[0].count, 10) === 0) {
    for (const e of INITIAL_EMAIL_LOGS) {
      await db.query(
        `INSERT INTO email_logs (id, tenant_id, customer_id, customer_name, type, subject, content, sent_at, status, lead_score_impact)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [e.id, defaultTenantId, e.customerId, e.customerName, e.type, e.subject, e.content, e.sentAt, e.status, e.leadScoreImpact]
      );
    }
  }

  // Seed Measurements
  const mCheck = await db.query('SELECT COUNT(*) FROM measurements');
  if (parseInt(mCheck.rows[0].count, 10) === 0) {
    for (const m of INITIAL_MEASUREMENTS) {
      await db.query(
        `INSERT INTO measurements (
          id, tenant_id, customer_id, customer_name, garment_type, chest, waist, shoulder,
          sleeve_length, collar_size, overall_length, armhole, wrist, notes, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT (id) DO NOTHING`,
        [
          m.id, defaultTenantId, m.customerId, m.customerName, m.garmentType, m.chest, m.waist, m.shoulder,
          m.sleeveLength, m.collarSize, m.overallLength, m.armhole, m.wrist, m.notes, m.updatedAt
        ]
      );
    }
  }

  // Seed Suppliers
  const sCheck = await db.query('SELECT COUNT(*) FROM suppliers');
  if (parseInt(sCheck.rows[0].count, 10) === 0) {
    for (const s of INITIAL_SUPPLIERS) {
      await db.query(
        `INSERT INTO suppliers (id, tenant_id, name, contact_person, phone, email, category, outstanding_payable)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
        [s.id, defaultTenantId, s.name, s.contactPerson, s.phone, s.email, s.category, s.outstandingPayable]
      );
    }
  }

  // Seed Fabric Rolls
  const frCheck = await db.query('SELECT COUNT(*) FROM fabric_rolls');
  if (parseInt(frCheck.rows[0].count, 10) === 0) {
    for (const fr of INITIAL_FABRIC_ROLLS) {
      await db.query(
        `INSERT INTO fabric_rolls (
          id, tenant_id, roll_code, supplier_id, supplier_name, fabric_type, composition, color,
          pattern_code, width, total_meters, remaining_meters, cost_per_meter, price_per_meter, branch_id, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (id) DO NOTHING`,
        [
          fr.id, defaultTenantId, fr.rollCode, fr.supplierId, fr.supplierName, fr.fabricType, fr.composition, fr.color,
          fr.patternCode, fr.width, fr.totalMeters, fr.remainingMeters, fr.costPerMeter, fr.pricePerMeter, fr.branchId, fr.status
        ]
      );
    }
  }

  // Seed Products
  const pCheck = await db.query('SELECT COUNT(*) FROM products');
  if (parseInt(pCheck.rows[0].count, 10) === 0) {
    for (const p of INITIAL_PRODUCTS) {
      await db.query(
        `INSERT INTO products (id, tenant_id, sku, barcode, name_ar, name_en, category, cost_price, selling_price, stock_json, reorder_point)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
        [p.id, defaultTenantId, p.sku, p.barcode, p.nameAr, p.nameEn, p.category, p.costPrice, p.sellingPrice, JSON.stringify(p.stockByBranch), p.reorderPoint]
      );
    }
  }

  // Seed Orders
  const ordCheck = await db.query('SELECT COUNT(*) FROM orders');
  if (parseInt(ordCheck.rows[0].count, 10) === 0) {
    for (const o of INITIAL_ORDERS) {
      await db.query(
        `INSERT INTO orders (
          id, tenant_id, order_number, customer_id, customer_name, customer_phone, garment_style,
          measurement_profile_id, fabric_roll_id, fabric_name, meters_used, assigned_tailor_id, assigned_tailor_name,
          status, total_amount, deposit_paid, balance_due, due_date, created_at, branch_id, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) ON CONFLICT (id) DO NOTHING`,
        [
          o.id, defaultTenantId, o.orderNumber, o.customerId, o.customerName, o.customerPhone, o.garmentStyle,
          o.measurementProfileId, o.fabricRollId, o.fabricName, o.metersUsed, o.assignedTailorId, o.assignedTailorName,
          o.status, o.totalAmount, o.depositPaid, o.balanceDue, o.dueDate, o.createdAt, o.branchId, o.notes
        ]
      );
    }
  }

  // Seed Production Tasks
  const ptCheck = await db.query('SELECT COUNT(*) FROM production_tasks');
  if (parseInt(ptCheck.rows[0].count, 10) === 0) {
    for (const pt of INITIAL_PRODUCTION_TASKS) {
      await db.query(
        `INSERT INTO production_tasks (
          id, tenant_id, order_id, order_number, customer_name, garment_name, current_stage,
          assigned_employee_id, assigned_employee_name, due_date, days_in_stage, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
        [
          pt.id, defaultTenantId, pt.orderId, pt.orderNumber, pt.customerName, pt.garmentName, pt.currentStage,
          pt.assignedEmployeeId, pt.assignedEmployeeName, pt.dueDate, pt.daysInStage, pt.notes
        ]
      );
    }
  }

  // Seed Invoices
  const invCheck = await db.query('SELECT COUNT(*) FROM invoices');
  if (parseInt(invCheck.rows[0].count, 10) === 0) {
    for (const inv of INITIAL_INVOICES) {
      await db.query(
        `INSERT INTO invoices (
          id, tenant_id, invoice_number, customer_id, customer_name, cashier_name, items_json,
          subtotal, discount, tax, total, paid_amount, payment_method, status, created_at, branch_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) ON CONFLICT (id) DO NOTHING`,
        [
          inv.id, defaultTenantId, inv.invoiceNumber, inv.customerId, inv.customerName, inv.cashierName, JSON.stringify(inv.items),
          inv.subtotal, inv.discount, inv.tax, inv.total, inv.paidAmount, inv.paymentMethod, inv.status, inv.createdAt, inv.branchId
        ]
      );
    }
  }

  // Seed Payments
  const payCheck = await db.query('SELECT COUNT(*) FROM payments');
  if (parseInt(payCheck.rows[0].count, 10) === 0) {
    for (const pay of INITIAL_PAYMENTS) {
      await db.query(
        `INSERT INTO payments (
          id, tenant_id, payment_number, type, party_name, related_entity, related_id,
          amount, method, reference, date, branch_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING`,
        [
          pay.id, defaultTenantId, pay.paymentNumber, pay.type, pay.partyName, pay.relatedEntity, pay.relatedId,
          pay.amount, pay.method, pay.reference, pay.date, pay.branchId
        ]
      );
    }
  }

  // Seed Purchase Orders
  const poCheck = await db.query('SELECT COUNT(*) FROM purchase_orders');
  if (parseInt(poCheck.rows[0].count, 10) === 0) {
    for (const po of INITIAL_PURCHASE_ORDERS) {
      await db.query(
        `INSERT INTO purchase_orders (id, tenant_id, po_number, supplier_id, supplier_name, items_json, total_amount, status, created_at, branch_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [po.id, defaultTenantId, po.poNumber, po.supplierId, po.supplierName, JSON.stringify(po.items), po.totalAmount, po.status, po.createdAt, po.branchId]
      );
    }
  }

  // Seed Employees
  const empCheck = await db.query('SELECT COUNT(*) FROM employees');
  if (parseInt(empCheck.rows[0].count, 10) === 0) {
    for (const emp of INITIAL_EMPLOYEES) {
      await db.query(
        `INSERT INTO employees (id, tenant_id, name, role, phone, email, branch_id, attendance_rate, monthly_commission, assigned_tasks_count, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
        [emp.id, defaultTenantId, emp.name, emp.role, emp.phone, emp.email, emp.branchId, emp.attendanceRate, emp.monthlyCommission, emp.assignedTasksCount, emp.status]
      );
    }
  }

  // Seed Notifications
  const notifCheck = await db.query('SELECT COUNT(*) FROM notifications');
  if (parseInt(notifCheck.rows[0].count, 10) === 0) {
    for (const n of INITIAL_NOTIFICATIONS) {
      await db.query(
        `INSERT INTO notifications (id, tenant_id, title_ar, title_en, message_ar, message_en, type, read, created_at, link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [n.id, defaultTenantId, n.titleAr, n.titleEn, n.messageAr, n.messageEn, n.type, n.read, n.createdAt, n.link]
      );
    }
  }

  // Seed User Tasks
  const utCheck = await db.query('SELECT COUNT(*) FROM user_tasks');
  if (parseInt(utCheck.rows[0].count, 10) === 0) {
    for (const ut of INITIAL_USER_TASKS) {
      await db.query(
        `INSERT INTO user_tasks (id, tenant_id, title_ar, title_en, description, priority, due_date, action_required, related_module)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
        [ut.id, defaultTenantId, ut.titleAr, ut.titleEn, ut.description, ut.priority, ut.dueDate, ut.actionRequired, ut.relatedModule]
      );
    }
  }

  // Seed Audit Logs
  const alCheck = await db.query('SELECT COUNT(*) FROM audit_logs');
  if (parseInt(alCheck.rows[0].count, 10) === 0) {
    for (const al of INITIAL_AUDIT_LOGS) {
      await db.query(
        `INSERT INTO audit_logs (id, tenant_id, action, user_name, user_role, timestamp, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [al.id, defaultTenantId, al.action, al.userName, al.userRole, al.timestamp, al.details || '']
      );
    }
  }

  // Seed Expenses
  const expCheck = await db.query('SELECT COUNT(*) FROM expenses');
  if (parseInt(expCheck.rows[0].count, 10) === 0) {
    for (const ex of INITIAL_EXPENSES) {
      await db.query(
        `INSERT INTO expenses (id, tenant_id, category, description_ar, description_en, amount, payment_method, date, branch_id, vendor_name, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
        [ex.id, defaultTenantId, ex.category, ex.descriptionAr, ex.descriptionEn, ex.amount, ex.paymentMethod, ex.date, ex.branchId, ex.vendorName, ex.recordedBy]
      );
    }
  }
}
