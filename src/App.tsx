import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ClientList } from './components/Clients/ClientList';
import { ProductList } from './components/Products/ProductList';
import { DocumentList } from './components/Documents/DocumentList';
import { DocumentEditor } from './components/Documents/DocumentEditor';
import { DocumentPreview } from './components/Documents/DocumentPreview';
import { CompanySettings } from './components/Settings/CompanySettings';
import { useAppData } from './store/AppDataContext';

export type View =
  | { page: 'dashboard' }
  | { page: 'invoices' }
  | { page: 'quotations' }
  | { page: 'clients' }
  | { page: 'products' }
  | { page: 'settings' }
  | { page: 'document-edit'; id: string }
  | { page: 'document-preview'; id: string };

function App() {
  const [view, setView] = useState<View>({ page: 'dashboard' });
  const { data, createDocument } = useAppData();

  const activeNavPage = view.page === 'document-edit' || view.page === 'document-preview' ? 'dashboard' : view.page;

  const renderContent = () => {
    switch (view.page) {
      case 'dashboard':
        return <Dashboard onPreview={(id) => setView({ page: 'document-preview', id })} />;
      case 'invoices':
        return (
          <DocumentList
            type="invoice"
            onNew={() => setView({ page: 'document-edit', id: createDocument('invoice').id })}
            onOpen={(id) => setView({ page: 'document-edit', id })}
            onPreview={(id) => setView({ page: 'document-preview', id })}
          />
        );
      case 'quotations':
        return (
          <DocumentList
            type="quotation"
            onNew={() => setView({ page: 'document-edit', id: createDocument('quotation').id })}
            onOpen={(id) => setView({ page: 'document-edit', id })}
            onPreview={(id) => setView({ page: 'document-preview', id })}
          />
        );
      case 'clients':
        return <ClientList />;
      case 'products':
        return <ProductList />;
      case 'settings':
        return <CompanySettings />;
      case 'document-edit': {
        const doc = data.documents.find((d) => d.id === view.id);
        if (!doc) return <p className="text-sm text-gray-500">Document not found.</p>;
        return (
          <DocumentEditor
            doc={doc}
            onDone={() => setView({ page: doc.type === 'invoice' ? 'invoices' : 'quotations' })}
            onPreview={(id) => setView({ page: 'document-preview', id })}
          />
        );
      }
      case 'document-preview': {
        const doc = data.documents.find((d) => d.id === view.id);
        if (!doc) return <p className="text-sm text-gray-500">Document not found.</p>;
        const client = data.clients.find((c) => c.id === doc.clientId);
        return (
          <DocumentPreview
            doc={doc}
            client={client}
            company={data.company}
            onBack={() => setView({ page: doc.type === 'invoice' ? 'invoices' : 'quotations' })}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <div className="no-print">
        <Sidebar view={{ page: activeNavPage } as View} onNavigate={setView} />
      </div>
      <div className="flex-1">
        <div className="no-print">
          <TopBar />
        </div>
        <main className="p-4 md:p-8">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
