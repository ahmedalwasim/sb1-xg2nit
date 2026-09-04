import { BusinessDocument, DocumentTotals, LineItem } from '../types';

export const STANDARD_VAT_RATE = 15;

export function calcLineNetTotal(item: LineItem): number {
  const gross = item.quantity * item.unitPrice;
  const discount = gross * (item.discountPercent / 100);
  return gross - discount;
}

export function calcLineVat(item: LineItem): number {
  return calcLineNetTotal(item) * (item.vatRate / 100);
}

export function calcLineGrandTotal(item: LineItem): number {
  return calcLineNetTotal(item) + calcLineVat(item);
}

export function calcDocumentTotals(doc: Pick<BusinessDocument, 'items'>): DocumentTotals {
  let subtotal = 0;
  let discountTotal = 0;
  let vatTotal = 0;

  for (const item of doc.items) {
    const gross = item.quantity * item.unitPrice;
    const discount = gross * (item.discountPercent / 100);
    subtotal += gross;
    discountTotal += discount;
    vatTotal += calcLineVat(item);
  }

  const grandTotal = subtotal - discountTotal + vatTotal;

  return { subtotal, discountTotal, vatTotal, grandTotal };
}
