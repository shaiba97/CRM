import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getDbPool, initializeDatabaseSchema } from "./src/db/index";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Helper function for safe db queries
  const safeQuery = async (db: any, sql: string) => {
    try {
      return await db.query(sql);
    } catch (err: any) {
      if (err?.message?.includes("does not exist")) {
        console.warn(`Table missing during query '${sql}'. Initializing schema...`);
        await initializeDatabaseSchema();
        try {
          return await db.query(sql);
        } catch (retryErr) {
          console.error(`Retry query failed for '${sql}':`, retryErr);
          return { rows: [] };
        }
      }
      console.error(`Query error for '${sql}':`, err);
      return { rows: [] };
    }
  };

  // Attempt Neon PostgreSQL schema initialization
  try {
    const res = await initializeDatabaseSchema();
    if (res.success) {
      console.log("Connected to Neon PostgreSQL database & schema verified.");
    }
  } catch (initErr) {
    console.error("Database schema init error on startup:", initErr);
  }

  // Shared Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Neon PostgreSQL Database Health & Info Endpoint
  app.get("/api/db/health", async (_req, res) => {
    try {
      const db = getDbPool();
      const result = await db.query("SELECT NOW() as current_time, current_database(), version()");
      res.json({
        status: "connected",
        provider: "Neon PostgreSQL",
        endpoint: "ep-super-lab-az4auhbi-pooler.c-3.ap-southeast-1.aws.neon.tech",
        database: result.rows[0]?.current_database,
        currentTime: result.rows[0]?.current_time,
        serverVersion: result.rows[0]?.version,
      });
    } catch (err: any) {
      res.status(500).json({ status: "error", error: err?.message || "Database connection failed" });
    }
  });

  // GET All Live CRM Data from Neon PostgreSQL
  app.get("/api/db/data", async (_req, res) => {
    try {
      const db = getDbPool();

      const [
        tenantsRes,
        branchesRes,
        customersRes,
        emailLogsRes,
        measurementsRes,
        suppliersRes,
        fabricRollsRes,
        productsRes,
        ordersRes,
        productionTasksRes,
        invoicesRes,
        paymentsRes,
        purchaseOrdersRes,
        employeesRes,
        notificationsRes,
        userTasksRes,
        auditLogsRes,
        expensesRes,
      ] = await Promise.all([
        safeQuery(db, "SELECT * FROM tenants ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM branches"),
        safeQuery(db, "SELECT * FROM customers ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM email_logs ORDER BY sent_at DESC"),
        safeQuery(db, "SELECT * FROM measurements"),
        safeQuery(db, "SELECT * FROM suppliers"),
        safeQuery(db, "SELECT * FROM fabric_rolls"),
        safeQuery(db, "SELECT * FROM products"),
        safeQuery(db, "SELECT * FROM orders ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM production_tasks"),
        safeQuery(db, "SELECT * FROM invoices ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM payments ORDER BY date DESC"),
        safeQuery(db, "SELECT * FROM purchase_orders ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM employees"),
        safeQuery(db, "SELECT * FROM notifications ORDER BY created_at DESC"),
        safeQuery(db, "SELECT * FROM user_tasks"),
        safeQuery(db, "SELECT * FROM audit_logs ORDER BY timestamp DESC"),
        safeQuery(db, "SELECT * FROM expenses ORDER BY date DESC"),
      ]);

      const tenants = tenantsRes.rows.map((r) => ({
        id: r.id,
        nameAr: r.name_ar,
        nameEn: r.name_en,
        ownerName: r.owner_name,
        ownerEmail: r.owner_email,
        ownerPhone: r.owner_phone,
        crNumber: r.cr_number,
        taxRatePct: Number(r.tax_rate_pct),
        currencySymbol: r.currency_symbol,
        currencyCode: r.currency_code,
        addressAr: r.address_ar,
        addressEn: r.address_en,
        subscriptionPlan: r.subscription_plan,
        activeBranchesCount: Number(r.active_branches_count),
        joinedDate: r.joined_date,
        primaryColorHex: r.primary_color_hex,
        receiptHeaderAr: r.receipt_header_ar,
        receiptFooterAr: r.receipt_footer_ar,
      }));

      const branches = branchesRes.rows.map((r) => ({
        id: r.id,
        nameAr: r.name_ar,
        nameEn: r.name_en,
        code: r.code,
        city: r.city,
      }));

      const customers = customersRes.rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        city: r.city,
        preferredFabric: r.preferred_fabric,
        totalSpent: Number(r.total_spent || 0),
        orderCount: Number(r.orders_count || 0),
        leadScore: Number(r.lead_score || 50),
        leadIntent: r.lead_intent || 'WARM',
        conversionProbability: r.conversion_probability || '50%',
        lastOrderDate: r.last_order_date || 'N/A',
        emailOpens: Number(r.email_opens || 0),
        emailClicks: Number(r.email_clicks || 0),
        measurementTaken: Boolean(r.measurement_taken),
        tags: r.tags_json ? JSON.parse(r.tags_json) : [],
        notes: r.notes || '',
        branchId: r.branch_id || 'b1',
        createdAt: r.created_at || new Date().toISOString().split('T')[0],
      }));

      const emailLogs = emailLogsRes.rows.map((r) => ({
        id: r.id,
        customerId: r.customer_id,
        customerName: r.customer_name,
        type: r.type,
        subject: r.subject,
        content: r.content,
        sentAt: r.sent_at,
        status: r.status,
        leadScoreImpact: Number(r.lead_score_impact || 0),
      }));

      const measurements = measurementsRes.rows.map((r) => ({
        id: r.id,
        customerId: r.customer_id,
        customerName: r.customer_name,
        garmentType: r.garment_type,
        chest: Number(r.chest || 0),
        waist: Number(r.waist || 0),
        shoulder: Number(r.shoulder || 0),
        sleeveLength: Number(r.sleeve_length || 0),
        collarSize: Number(r.collar_size || 0),
        overallLength: Number(r.overall_length || 0),
        armhole: Number(r.armhole || 0),
        wrist: Number(r.wrist || 0),
        notes: r.notes || '',
        updatedAt: r.updated_at,
      }));

      const suppliers = suppliersRes.rows.map((r) => ({
        id: r.id,
        name: r.name,
        contactPerson: r.contact_person,
        phone: r.phone,
        email: r.email,
        category: r.category,
        outstandingPayable: Number(r.outstanding_payable || 0),
      }));

      const fabricRolls = fabricRollsRes.rows.map((r) => ({
        id: r.id,
        rollCode: r.roll_code,
        supplierId: r.supplier_id,
        supplierName: r.supplier_name,
        fabricType: r.fabric_type,
        composition: r.composition,
        color: r.color,
        patternCode: r.pattern_code,
        width: Number(r.width || 0),
        totalMeters: Number(r.total_meters || 0),
        remainingMeters: Number(r.remaining_meters || 0),
        costPerMeter: Number(r.cost_per_meter || 0),
        pricePerMeter: Number(r.price_per_meter || 0),
        branchId: r.branch_id || 'b1',
        status: r.status || 'AVAILABLE',
      }));

      const products = productsRes.rows.map((r) => ({
        id: r.id,
        sku: r.sku,
        barcode: r.barcode,
        nameAr: r.name_ar,
        nameEn: r.name_en,
        category: r.category,
        costPrice: Number(r.cost_price || 0),
        sellingPrice: Number(r.selling_price || 0),
        stockByBranch: r.stock_json ? JSON.parse(r.stock_json) : {},
        reorderPoint: Number(r.reorder_point || 10),
      }));

      const orders = ordersRes.rows.map((r) => ({
        id: r.id,
        orderNumber: r.order_number,
        customerId: r.customer_id,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        garmentStyle: r.garment_style,
        measurementProfileId: r.measurement_profile_id,
        fabricRollId: r.fabric_roll_id,
        fabricName: r.fabric_name,
        metersUsed: Number(r.meters_used || 0),
        assignedTailorId: r.assigned_tailor_id,
        assignedTailorName: r.assigned_tailor_name,
        status: r.status,
        totalAmount: Number(r.total_amount || 0),
        depositPaid: Number(r.deposit_paid || 0),
        balanceDue: Number(r.balance_due || 0),
        dueDate: r.due_date,
        createdAt: r.created_at,
        branchId: r.branch_id || 'b1',
        notes: r.notes || '',
      }));

      const productionTasks = productionTasksRes.rows.map((r) => ({
        id: r.id,
        orderId: r.order_id,
        orderNumber: r.order_number,
        customerName: r.customer_name,
        garmentName: r.garment_name,
        currentStage: r.current_stage,
        assignedEmployeeId: r.assigned_employee_id,
        assignedEmployeeName: r.assigned_employee_name,
        dueDate: r.due_date,
        daysInStage: Number(r.days_in_stage || 0),
        notes: r.notes || '',
      }));

      const invoices = invoicesRes.rows.map((r) => ({
        id: r.id,
        invoiceNumber: r.invoice_number,
        customerId: r.customer_id,
        customerName: r.customer_name,
        cashierName: r.cashier_name,
        items: r.items_json ? JSON.parse(r.items_json) : [],
        subtotal: Number(r.subtotal || 0),
        discount: Number(r.discount || 0),
        tax: Number(r.tax || 0),
        total: Number(r.total || 0),
        paidAmount: Number(r.paid_amount || 0),
        paymentMethod: r.payment_method,
        status: r.status,
        createdAt: r.created_at,
        branchId: r.branch_id || 'b1',
      }));

      const payments = paymentsRes.rows.map((r) => ({
        id: r.id,
        paymentNumber: r.payment_number,
        type: r.type,
        partyName: r.party_name,
        relatedEntity: r.related_entity,
        relatedId: r.related_id,
        amount: Number(r.amount || 0),
        method: r.method,
        reference: r.reference,
        date: r.date,
        branchId: r.branch_id || 'b1',
      }));

      const purchaseOrders = purchaseOrdersRes.rows.map((r) => ({
        id: r.id,
        poNumber: r.po_number,
        supplierId: r.supplier_id,
        supplierName: r.supplier_name,
        items: r.items_json ? JSON.parse(r.items_json) : [],
        totalAmount: Number(r.total_amount || 0),
        status: r.status,
        createdAt: r.created_at,
        branchId: r.branch_id || 'b1',
      }));

      const employees = employeesRes.rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        phone: r.phone,
        email: r.email,
        branchId: r.branch_id || 'b1',
        attendanceRate: Number(r.attendance_rate || 100),
        monthlyCommission: Number(r.monthly_commission || 0),
        assignedTasksCount: Number(r.assigned_tasks_count || 0),
        status: r.status,
      }));

      const notifications = notificationsRes.rows.map((r) => ({
        id: r.id,
        titleAr: r.title_ar,
        titleEn: r.title_en,
        messageAr: r.message_ar,
        messageEn: r.message_en,
        type: r.type,
        read: Boolean(r.read),
        createdAt: r.created_at,
        link: r.link,
      }));

      const userTasks = userTasksRes.rows.map((r) => ({
        id: r.id,
        titleAr: r.title_ar,
        titleEn: r.title_en,
        description: r.description,
        priority: r.priority,
        dueDate: r.due_date,
        actionRequired: Boolean(r.action_required),
        relatedModule: r.related_module,
      }));

      const auditLogs = auditLogsRes.rows.map((r) => ({
        id: r.id,
        action: r.action,
        userName: r.user_name,
        userRole: r.user_role,
        timestamp: r.timestamp,
        details: r.details,
      }));

      const expenses = expensesRes.rows.map((r) => ({
        id: r.id,
        category: r.category,
        descriptionAr: r.description_ar,
        descriptionEn: r.description_en,
        amount: Number(r.amount || 0),
        paymentMethod: r.payment_method,
        date: r.date,
        branchId: r.branch_id || 'b1',
        vendorName: r.vendor_name,
        recordedBy: r.recorded_by,
      }));

      res.json({
        source: "Neon PostgreSQL",
        tenants,
        branches,
        customers,
        emailLogs,
        measurements,
        suppliers,
        fabricRolls,
        products,
        orders,
        productionTasks,
        invoices,
        payments,
        purchaseOrders,
        employees,
        notifications,
        userTasks,
        auditLogs,
        expenses,
      });
    } catch (err: any) {
      console.error("Failed to fetch Neon DB data:", err);
      res.status(500).json({ error: err?.message || "Failed to query database" });
    }
  });

  // POST Add Customer
  app.post("/api/db/customers", async (req, res) => {
    try {
      const db = getDbPool();
      const c = req.body;
      const tenantId = c.tenantId || 'tenant_kofado_main';
      const id = c.id || `c_${Date.now()}`;
      const createdAt = c.createdAt || new Date().toISOString().split('T')[0];

      await db.query(
        `INSERT INTO customers (
          id, tenant_id, name, phone, email, city, preferred_fabric, total_spent, orders_count,
          lead_score, lead_intent, conversion_probability, last_order_date, email_opens, email_clicks,
          measurement_taken, tags_json, notes, branch_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        [
          id, tenantId, c.name, c.phone, c.email || '', c.city || 'الخرطوم', c.preferredFabric || 'غير محدد',
          c.totalSpent || 0, c.orderCount || 0, c.leadScore || 50, c.leadIntent || 'WARM', c.conversionProbability || '50%',
          c.lastOrderDate || 'N/A', c.emailOpens || 0, c.emailClicks || 0, c.measurementTaken || false,
          JSON.stringify(c.tags || []), c.notes || '', c.branchId || 'b1', createdAt
        ]
      );

      res.json({ success: true, customer: { ...c, id, tenantId, createdAt } });
    } catch (err: any) {
      console.error("Save customer error:", err);
      res.status(500).json({ error: err?.message || "Failed to save customer to Neon DB" });
    }
  });

  // PUT Update Customer
  app.put("/api/db/customers/:id", async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      const updates = req.body;

      await db.query(
        `UPDATE customers SET
          name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          email = COALESCE($3, email),
          preferred_fabric = COALESCE($4, preferred_fabric),
          lead_score = COALESCE($5, lead_score),
          lead_intent = COALESCE($6, lead_intent),
          notes = COALESCE($7, notes)
        WHERE id = $8`,
        [updates.name, updates.phone, updates.email, updates.preferredFabric, updates.leadScore, updates.leadIntent, updates.notes, id]
      );

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to update customer" });
    }
  });

  // POST Save Measurement
  app.post("/api/db/measurements", async (req, res) => {
    try {
      const db = getDbPool();
      const m = req.body;
      const id = m.id || `m_${Date.now()}`;
      const tenantId = m.tenantId || 'tenant_kofado_main';
      const updatedAt = new Date().toISOString().split('T')[0];

      await db.query(
        `INSERT INTO measurements (
          id, tenant_id, customer_id, customer_name, garment_type, chest, waist, shoulder,
          sleeve_length, collar_size, overall_length, armhole, wrist, notes, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          chest = EXCLUDED.chest,
          waist = EXCLUDED.waist,
          shoulder = EXCLUDED.shoulder,
          sleeve_length = EXCLUDED.sleeve_length,
          collar_size = EXCLUDED.collar_size,
          overall_length = EXCLUDED.overall_length,
          notes = EXCLUDED.notes,
          updated_at = EXCLUDED.updated_at`,
        [
          id, tenantId, m.customerId, m.customerName, m.garmentType || 'THOBE', m.chest || 0, m.waist || 0, m.shoulder || 0,
          m.sleeveLength || 0, m.collarSize || 0, m.overallLength || 0, m.armhole || 0, m.wrist || 0, m.notes || '', updatedAt
        ]
      );

      // Mark measurement_taken = true in customers
      if (m.customerId) {
        await db.query("UPDATE customers SET measurement_taken = TRUE WHERE id = $1", [m.customerId]);
      }

      res.json({ success: true, measurement: { ...m, id, updatedAt } });
    } catch (err: any) {
      console.error("Save measurement error:", err);
      res.status(500).json({ error: err?.message || "Failed to save measurement" });
    }
  });

  // POST Add Tailoring Order
  app.post("/api/db/orders", async (req, res) => {
    try {
      const db = getDbPool();
      const o = req.body;
      const id = o.id || `ord_${Date.now()}`;
      const tenantId = o.tenantId || 'tenant_kofado_main';
      const createdAt = o.createdAt || new Date().toISOString().split('T')[0];
      const orderNumber = o.orderNumber || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      await db.query(
        `INSERT INTO orders (
          id, tenant_id, order_number, customer_id, customer_name, customer_phone, garment_style,
          measurement_profile_id, fabric_roll_id, fabric_name, meters_used, assigned_tailor_id, assigned_tailor_name,
          status, total_amount, deposit_paid, balance_due, due_date, created_at, branch_id, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
        [
          id, tenantId, orderNumber, o.customerId, o.customerName, o.customerPhone, o.garmentStyle,
          o.measurementProfileId || '', o.fabricRollId || '', o.fabricName || '', o.metersUsed || 3.5,
          o.assignedTailorId || 'e2', o.assignedTailorName || 'الأستايلست أحمد خياط', o.status || 'CUTTING',
          o.totalAmount, o.depositPaid, o.balanceDue, o.dueDate, createdAt, o.branchId || 'b1', o.notes || ''
        ]
      );

      // Create matching production task
      const taskId = `pt_${Date.now()}`;
      await db.query(
        `INSERT INTO production_tasks (
          id, tenant_id, order_id, order_number, customer_name, garment_name, current_stage,
          assigned_employee_id, assigned_employee_name, due_date, days_in_stage, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          taskId, tenantId, id, orderNumber, o.customerName, o.garmentStyle, o.status || 'CUTTING',
          o.assignedTailorId || 'e2', o.assignedTailorName || 'الأستايلست أحمد خياط', o.dueDate, 0, o.notes || ''
        ]
      );

      res.json({ success: true, order: { ...o, id, orderNumber, createdAt } });
    } catch (err: any) {
      console.error("Save order error:", err);
      res.status(500).json({ error: err?.message || "Failed to save order" });
    }
  });

  // PUT Update Order Status
  app.put("/api/db/orders/:id/status", async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      const { status } = req.body;

      await db.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
      await db.query("UPDATE production_tasks SET current_stage = $1 WHERE order_id = $2", [status, id]);

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to update order status" });
    }
  });

  // POST Add Tenant
  app.post("/api/db/tenants", async (req, res) => {
    try {
      const db = getDbPool();
      const t = req.body;
      const id = t.id || `tenant_${Date.now()}`;
      const joinedDate = new Date().toISOString().split('T')[0];

      await db.query(
        `INSERT INTO tenants (
          id, name_ar, name_en, owner_name, owner_email, owner_phone, cr_number, tax_rate_pct,
          currency_symbol, currency_code, address_ar, address_en, subscription_plan, active_branches_count,
          joined_date, primary_color_hex, receipt_header_ar, receipt_footer_ar
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
        [
          id, t.nameAr, t.nameEn, t.ownerName, t.ownerEmail, t.ownerPhone, t.crNumber, t.taxRatePct || 15,
          t.currencySymbol || 'ج.س', t.currencyCode || 'SDG', t.addressAr, t.addressEn, t.subscriptionPlan || 'PRO_SAAS',
          t.activeBranchesCount || 1, joinedDate, t.primaryColorHex || '#C6A052', t.receiptHeaderAr || '', t.receiptFooterAr || ''
        ]
      );

      res.json({ success: true, tenant: { ...t, id, joinedDate } });
    } catch (err: any) {
      console.error("Save tenant error:", err);
      res.status(500).json({ error: err?.message || "Failed to save tenant" });
    }
  });

  // PUT Update Tenant Settings
  app.put("/api/db/tenants/:id", async (req, res) => {
    try {
      const db = getDbPool();
      const { id } = req.params;
      const updates = req.body;

      await db.query(
        `UPDATE tenants SET
          name_ar = COALESCE($1, name_ar),
          name_en = COALESCE($2, name_en),
          owner_name = COALESCE($3, owner_name),
          owner_phone = COALESCE($4, owner_phone),
          cr_number = COALESCE($5, cr_number),
          tax_rate_pct = COALESCE($6, tax_rate_pct),
          currency_symbol = COALESCE($7, currency_symbol),
          currency_code = COALESCE($8, currency_code),
          receipt_header_ar = COALESCE($9, receipt_header_ar),
          receipt_footer_ar = COALESCE($10, receipt_footer_ar)
        WHERE id = $11`,
        [
          updates.nameAr, updates.nameEn, updates.ownerName, updates.ownerPhone, updates.crNumber,
          updates.taxRatePct, updates.currencySymbol, updates.currencyCode, updates.receiptHeaderAr,
          updates.receiptFooterAr, id
        ]
      );

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to update tenant" });
    }
  });

  // POST Add Expense
  app.post("/api/db/expenses", async (req, res) => {
    try {
      const db = getDbPool();
      const ex = req.body;
      const id = ex.id || `exp_${Date.now()}`;
      const tenantId = ex.tenantId || 'tenant_kofado_main';

      await db.query(
        `INSERT INTO expenses (id, tenant_id, category, description_ar, description_en, amount, payment_method, date, branch_id, vendor_name, recorded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [id, tenantId, ex.category, ex.descriptionAr, ex.descriptionEn, ex.amount, ex.paymentMethod, ex.date, ex.branchId || 'b1', ex.vendorName, ex.recordedBy]
      );

      res.json({ success: true, expense: { ...ex, id } });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Failed to save expense" });
    }
  });

  // AI Automated Lead Scoring Endpoint
  app.post("/api/ai/lead-score", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const customerData = req.body;

      if (!ai) {
        // Fallback intelligent lead scoring logic if no API key
        const baseScore = Math.min(
          100,
          (customerData.totalSpent || 0) / 10 +
            (customerData.emailOpens || 0) * 12 +
            (customerData.orderCount || 0) * 20 +
            (customerData.measurementTaken ? 25 : 0)
        );
        const score = Math.round(baseScore);
        const intent = score >= 75 ? "HOT" : score >= 40 ? "WARM" : "COLD";
        return res.json({
          score,
          intent,
          conversionProbability: `${Math.min(98, score + 10)}%`,
          keyFactors: [
            customerData.measurementTaken ? "Body measurements on file" : "No measurements yet",
            `${customerData.emailOpens || 0} emails opened in last 30 days`,
            `Historical spend: ${customerData.totalSpent || 0} SDG`,
          ],
          recommendedAction:
            score >= 75
              ? "Send personalized fitting appointment invite via WhatsApp"
              : "Send seasonal Italian wool fabric collection showcase",
          summaryArabic:
            score >= 75
              ? "عميل محتمل عالي الأهمية - لديه قياسات مسجلة وتفاعل مرتفع مع البريد الإلكتروني"
              : "عميل محتمل متوسط - يحتاج لمتابعة بعروض الأقمشة الجديدة",
        });
      }

      const prompt = `Analyze this CRM customer lead for a high-end Tailoring & Fabric shop ("Moussa Tailoring & CRM").
Customer Details:
- Name: ${customerData.name || "N/A"}
- Total Spent: ${customerData.totalSpent || 0} SDG
- Orders Count: ${customerData.orderCount || 0}
- Email Opens: ${customerData.emailOpens || 0}
- Email Clicks: ${customerData.emailClicks || 0}
- Measurements Profile Recorded: ${customerData.measurementTaken ? "Yes" : "No"}
- Preferred Fabric Category: ${customerData.preferredFabric || "Italian Wool"}
- Last Interaction: ${customerData.lastInteraction || "Recently"}
- Days Since Last Response: ${customerData.daysInactive || 2}

Calculate an automated lead score (0 to 100), categorize as HOT / WARM / COLD, identify top 3 key factors, recommend actionable next steps for the sales/tailoring team, and provide a 1-sentence Arabic executive summary.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              intent: { type: Type.STRING, description: "HOT, WARM, or COLD" },
              conversionProbability: { type: Type.STRING },
              keyFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedAction: { type: Type.STRING },
              summaryArabic: { type: Type.STRING },
            },
            required: ["score", "intent", "conversionProbability", "keyFactors", "recommendedAction", "summaryArabic"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (err: any) {
      console.error("Lead scoring error:", err);
      res.status(500).json({ error: err?.message || "Failed to score lead" });
    }
  });

  // AI Personalized Email & WhatsApp Message Drafter Endpoint
  app.post("/api/ai/draft-message", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const { customerName, messageType, garmentType, orderStatus, fabricType, language } = req.body;

      if (!ai) {
        const lang = language === "en" ? "en" : "ar";
        if (messageType === "FITTING_REMINDER") {
          return res.json({
            subject: lang === "ar" ? `تذكير بموعد القياس/التجربة - الخياطة الرفيعة` : `Fitting Appointment Reminder - Tailoring`,
            body: lang === "ar"
              ? `عزيزنا ${customerName}، يسعدنا إعلامك بأن ثوبك (${garmentType || "التفصيل"}) جاهز لجلسة قياس وقص متقنة. ننتظر زيارتك في الفرع.`
              : `Dear ${customerName}, your custom ${garmentType || "garment"} is ready for your fitting session. We look forward to seeing you at our shop.`,
          });
        }
        return res.json({
          subject: lang === "ar" ? `عرض خاص لأحدث تشكيلة أقمشة إيطالية` : `Exclusive New Fabric Collection Showcase`,
          body: lang === "ar"
            ? `مرحباً ${customerName}، وصلت لدينا تشكيلة حصرية من أقمشة ${fabricType || "الصوف الإيطالي"}. يسعدنا استقبالك لاختيار نمطك المفضل.`
            : `Hello ${customerName}, a new premium batch of ${fabricType || "Italian Wool"} fabrics has arrived. Visit us to customize your next suit or thobe.`,
        });
      }

      const isArabic = language !== "en";
      const prompt = `You are an AI sales assistant for "Moussa Tailoring & Fabric Shop". Draft a professional, elegant ${messageType} message for customer "${customerName}".
Details:
- Garment: ${garmentType || "Thobe / Suit"}
- Order Status: ${orderStatus || "In Production"}
- Fabric: ${fabricType || "Premium Italian Silk/Wool"}
- Language: ${isArabic ? "Arabic (العربية)" : "English"}

Generate both subject line (for email) and body (suitable for both email and WhatsApp).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ["subject", "body"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (err: any) {
      console.error("Draft message error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate message" });
    }
  });

  // AI Fabric & Style Recommendation Endpoint
  app.post("/api/ai/fabric-recommendation", async (req, res) => {
    try {
      const ai = getGeminiClient();
      const { customerRequirements, budget, occasion } = req.body;

      if (!ai) {
        return res.json({
          recommendations: [
            {
              fabricName: "Super 150s Italian Wool (صوف إيطالي فاخر)",
              reason: "مثالي للمناسبات الرسمية، ملمس ناعم ومقاوم للتجعد",
              suggestedGarment: "ثوب رسمي / بدلة فاخرة",
              matchingRollCode: "FAB-IT-102",
            },
            {
              fabricName: "Japanese Cotton Silk Blend (قطن ياباني حريري)",
              reason: "مريح ومناسب للاستخدام اليومي والطقس الحار",
              suggestedGarment: "ثوب يومي خفيف",
              matchingRollCode: "FAB-JP-405",
            },
          ],
        });
      }

      const prompt = `Recommend 2-3 tailored fabric rolls and design styles for a customer inquiring with:
- Requirements: ${customerRequirements || "Formal thobe/suit"}
- Budget Range: ${budget || "Medium to Premium"}
- Occasion: ${occasion || "Wedding / Business"}

Provide response in JSON format.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fabricName: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    suggestedGarment: { type: Type.STRING },
                    matchingRollCode: { type: Type.STRING },
                  },
                  required: ["fabricName", "reason", "suggestedGarment", "matchingRollCode"],
                },
              },
            },
            required: ["recommendations"],
          },
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (err: any) {
      console.error("Fabric recommendation error:", err);
      res.status(500).json({ error: err?.message || "Failed to generate recommendation" });
    }
  });

  // Vite middleware for dev or static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
