import { BusinessDocument, Client } from '../types';
import { calcDocumentTotals } from './vat';

export function documentsToCsv(documents: BusinessDocument[], clients: Client[]): string {
  const header = ['Number', 'Type', 'Client', 'Issue Date', 'Status', 'Subtotal', 'VAT', 'Total'];
  const rows = documents.map((doc) => {
    const client = clients.find((c) => c.id === doc.clientId);
    const totals = calcDocumentTotals(doc);
    return [
      doc.number,
      doc.type,
      client ? client.nameEn : '',
      doc.issueDate,
      doc.status,
      totals.subtotal.toFixed(2),
      totals.vatTotal.toFixed(2),
      totals.grandTotal.toFixed(2),
    ];
  });

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escape).join(',')).join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
