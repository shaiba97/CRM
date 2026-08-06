import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopAppBar } from './components/TopAppBar';
import { SideNav } from './components/SideNav';
import { CommandPaletteOverlay } from './components/CommandPaletteOverlay';
import { ToastContainer } from './components/ToastContainer';
import { NewTailoringOrderModal } from './components/modals/NewTailoringOrderModal';
import { NewCustomerModal } from './components/modals/NewCustomerModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { CustomersView } from './components/views/CustomersView';
import { EmailTrackingView } from './components/views/EmailTrackingView';
import { SuppliersView } from './components/views/SuppliersView';
import { InventoryView } from './components/views/InventoryView';
import { FabricRollsView } from './components/views/FabricRollsView';
import { TailoringOrdersView } from './components/views/TailoringOrdersView';
import { MeasurementsView } from './components/views/MeasurementsView';
import { ProductionBoardView } from './components/views/ProductionBoardView';
import { PosView } from './components/views/PosView';
import { SalesInvoicesView } from './components/views/SalesInvoicesView';
import { PurchasingView } from './components/views/PurchasingView';
import { AccountingView } from './components/views/AccountingView';
import { FinancialView } from './components/views/FinancialView';
import { EmployeesView } from './components/views/EmployeesView';
import { ReportsView } from './components/views/ReportsView';
import { AdminView } from './components/views/AdminView';
import { SettingsView } from './components/views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, activeRole } = useApp();

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView onOpenNewCustomer={() => setIsNewCustomerOpen(true)} />;
      case 'email-tracking':
        return <EmailTrackingView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'inventory':
        return <InventoryView />;
      case 'fabric-rolls':
        return <FabricRollsView />;
      case 'tailoring':
        return <TailoringOrdersView onOpenNewOrder={() => setIsNewOrderOpen(true)} />;
      case 'measurements':
        return <MeasurementsView />;
      case 'production':
        return <ProductionBoardView />;
      case 'pos':
        return <PosView />;
      case 'sales':
        return <SalesInvoicesView />;
      case 'purchasing':
        return <PurchasingView />;
      case 'accounting':
        return <AccountingView />;
      case 'financial':
        return <FinancialView />;
      case 'employees':
        return <EmployeesView />;
      case 'reports':
        return <ReportsView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#2A1C14] text-[#F4F1EA] flex flex-col font-sans antialiased selection:bg-[#C6A052] selection:text-[#2A1C14]">
      {/* Top Bar */}
      <TopAppBar
        onOpenNewOrder={() => setIsNewOrderOpen(true)}
        onOpenNewCustomer={() => setIsNewCustomerOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <SideNav />

        {/* Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#2A1C14] via-[#241710] to-[#1E130D]">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Overlays & Modals */}
      <CommandPaletteOverlay
        onOpenQuickNewOrder={() => setIsNewOrderOpen(true)}
        onOpenQuickNewCustomer={() => setIsNewCustomerOpen(true)}
      />

      <NewTailoringOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
      />

      <NewCustomerModal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
