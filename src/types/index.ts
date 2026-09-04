export type DocType = 'invoice' | 'quotation';

export type DocStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'accepted'
  | 'rejected'
  | 'converted'
  | 'cancelled';

export interface Company {
  nameEn: string;
  nameAr: string;
  vatNumber: string;
  crNumber: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  logoDataUrl: string;
}

export interface Client {
  id: string;
  nameEn: string;
  nameAr: string;
  vatNumber: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  unit: string;
  price: number;
  vatRate: number;
  createdAt: string;
}

export interface LineItem {
  id: string;
  productId: string | null;
  descriptionEn: string;
  descriptionAr: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  vatRate: number;
}

export interface BusinessDocument {
  id: string;
  type: DocType;
  number: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  notes: string;
  status: DocStatus;
  convertedFromId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTotals {
  subtotal: number;
  discountTotal: number;
  vatTotal: number;
  grandTotal: number;
}

export interface AppData {
  company: Company;
  clients: Client[];
  products: Product[];
  documents: BusinessDocument[];
  counters: Record<string, number>;
}

export type Language = 'en' | 'ar';
