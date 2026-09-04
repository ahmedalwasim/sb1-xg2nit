import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppData,
  BusinessDocument,
  Client,
  Company,
  DocType,
  Product,
} from '../types';
import { generateId } from '../utils/id';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { nextDocNumber } from '../utils/docNumber';

const STORAGE_KEY = 'fatoora-lite-data';

const emptyCompany: Company = {
  nameEn: '',
  nameAr: '',
  vatNumber: '',
  crNumber: '',
  address: '',
  city: 'Riyadh',
  phone: '',
  email: '',
  logoDataUrl: '',
};

const defaultData: AppData = {
  company: emptyCompany,
  clients: [],
  products: [],
  documents: [],
  counters: {},
};

interface AppDataContextValue {
  data: AppData;
  updateCompany: (company: Company) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  createDocument: (type: DocType) => BusinessDocument;
  saveDocument: (doc: BusinessDocument) => void;
  deleteDocument: (id: string) => void;
  convertQuotationToInvoice: (quotationId: string) => BusinessDocument | null;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadFromStorage(STORAGE_KEY, defaultData));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, data);
  }, [data]);

  const value = useMemo<AppDataContextValue>(() => {
    return {
      data,
      updateCompany: (company) => setData((prev) => ({ ...prev, company })),

      addClient: (client) => {
        const newClient: Client = { ...client, id: generateId(), createdAt: new Date().toISOString() };
        setData((prev) => ({ ...prev, clients: [...prev.clients, newClient] }));
        return newClient;
      },
      updateClient: (client) => {
        setData((prev) => ({
          ...prev,
          clients: prev.clients.map((c) => (c.id === client.id ? client : c)),
        }));
      },
      deleteClient: (id) => {
        setData((prev) => ({ ...prev, clients: prev.clients.filter((c) => c.id !== id) }));
      },

      addProduct: (product) => {
        const newProduct: Product = { ...product, id: generateId(), createdAt: new Date().toISOString() };
        setData((prev) => ({ ...prev, products: [...prev.products, newProduct] }));
        return newProduct;
      },
      updateProduct: (product) => {
        setData((prev) => ({
          ...prev,
          products: prev.products.map((p) => (p.id === product.id ? product : p)),
        }));
      },
      deleteProduct: (id) => {
        setData((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
      },

      createDocument: (type) => {
        const { number, counters } = nextDocNumber(type, data.counters);
        const now = new Date().toISOString();
        const doc: BusinessDocument = {
          id: generateId(),
          type,
          number,
          clientId: '',
          issueDate: now.slice(0, 10),
          dueDate: now.slice(0, 10),
          items: [],
          notes: '',
          status: 'draft',
          convertedFromId: null,
          createdAt: now,
          updatedAt: now,
        };
        setData((prev) => ({ ...prev, counters, documents: [...prev.documents, doc] }));
        return doc;
      },
      saveDocument: (doc) => {
        const updated = { ...doc, updatedAt: new Date().toISOString() };
        setData((prev) => ({
          ...prev,
          documents: prev.documents.some((d) => d.id === doc.id)
            ? prev.documents.map((d) => (d.id === doc.id ? updated : d))
            : [...prev.documents, updated],
        }));
      },
      deleteDocument: (id) => {
        setData((prev) => ({ ...prev, documents: prev.documents.filter((d) => d.id !== id) }));
      },

      convertQuotationToInvoice: (quotationId) => {
        const quotation = data.documents.find((d) => d.id === quotationId);
        if (!quotation) return null;
        const { number, counters } = nextDocNumber('invoice', data.counters);
        const now = new Date().toISOString();
        const invoice: BusinessDocument = {
          ...quotation,
          id: generateId(),
          type: 'invoice',
          number,
          status: 'draft',
          convertedFromId: quotation.id,
          issueDate: now.slice(0, 10),
          createdAt: now,
          updatedAt: now,
        };
        setData((prev) => ({
          ...prev,
          counters,
          documents: [
            ...prev.documents.map((d) => (d.id === quotationId ? { ...d, status: 'converted' as const } : d)),
            invoice,
          ],
        }));
        return invoice;
      },
    };
  }, [data]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
