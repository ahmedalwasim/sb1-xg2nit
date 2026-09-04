import { DocType } from '../../types';
import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { calcDocumentTotals } from '../../utils/vat';
import { formatCurrency, formatDate } from '../../utils/format';
import { documentsToCsv, downloadCsv } from '../../utils/csv';

interface DocumentListProps {
  type: DocType;
  onNew: () => void;
  onOpen: (id: string) => void;
  onPreview: (id: string) => void;
}

export function DocumentList({ type, onNew, onOpen, onPreview }: DocumentListProps) {
  const { data, convertQuotationToInvoice } = useAppData();
  const { t } = useLanguage();

  const documents = data.documents
    .filter((d) => d.type === type)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const clientName = (id: string) => data.clients.find((c) => c.id === id)?.nameEn || '—';

  const handleExport = () => {
    downloadCsv(`${type}s.csv`, documentsToCsv(documents, data.clients));
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {type === 'invoice' ? t('invoices_title') : t('quotations_title')}
        </h1>
        <div className="flex gap-2">
          {documents.length > 0 && (
            <button onClick={handleExport} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              {t('export_csv')}
            </button>
          )}
          <button onClick={onNew} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            + {type === 'invoice' ? t('new_invoice') : t('new_quotation')}
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          {t('no_documents_yet')}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-start text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 text-start">{t('number')}</th>
                <th className="px-4 py-2 text-start">{t('client')}</th>
                <th className="px-4 py-2 text-start">{t('issue_date')}</th>
                <th className="px-4 py-2 text-start">{t('status')}</th>
                <th className="px-4 py-2 text-start">{t('total')}</th>
                <th className="px-4 py-2 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc) => {
                const totals = calcDocumentTotals(doc);
                return (
                  <tr key={doc.id}>
                    <td className="px-4 py-2 font-medium text-gray-900">{doc.number}</td>
                    <td className="px-4 py-2 text-gray-600">{clientName(doc.clientId)}</td>
                    <td className="px-4 py-2 text-gray-600">{formatDate(doc.issueDate)}</td>
                    <td className="px-4 py-2"><StatusBadge status={doc.status} /></td>
                    <td className="px-4 py-2 text-gray-600">{formatCurrency(totals.grandTotal)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button onClick={() => onOpen(doc.id)} className="me-3 text-emerald-700 hover:underline">
                        {t('edit')}
                      </button>
                      <button onClick={() => onPreview(doc.id)} className="me-3 text-gray-700 hover:underline">
                        {t('view')}
                      </button>
                      {type === 'quotation' && doc.status !== 'converted' && (
                        <button onClick={() => convertQuotationToInvoice(doc.id)} className="text-purple-700 hover:underline">
                          {t('convert_to_invoice')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
