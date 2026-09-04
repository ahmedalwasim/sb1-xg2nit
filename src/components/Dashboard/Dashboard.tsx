import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { StatCard } from './StatCard';
import { calcDocumentTotals } from '../../utils/vat';
import { formatCurrency, formatDate } from '../../utils/format';
import { StatusBadge } from '../common/StatusBadge';

export function Dashboard({ onPreview }: { onPreview: (id: string) => void }) {
  const { data } = useAppData();
  const { t } = useLanguage();

  const invoices = data.documents.filter((d) => d.type === 'invoice');
  const quotations = data.documents.filter((d) => d.type === 'quotation');

  let totalInvoiced = 0;
  let vatCollected = 0;
  let outstanding = 0;

  for (const invoice of invoices) {
    const totals = calcDocumentTotals(invoice);
    if (invoice.status === 'cancelled') continue;
    totalInvoiced += totals.grandTotal;
    if (invoice.status === 'paid') {
      vatCollected += totals.vatTotal;
    } else {
      outstanding += totals.grandTotal;
    }
  }

  const openQuotations = quotations.filter((q) => q.status === 'draft' || q.status === 'sent').length;

  const clientName = (id: string) => data.clients.find((c) => c.id === id)?.nameEn || '—';

  const recent = [...data.documents].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-gray-900">{t('dashboard_title')}</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('stat_total_invoiced')} value={formatCurrency(totalInvoiced)} accent="text-emerald-700" />
        <StatCard label={t('stat_vat_collected')} value={formatCurrency(vatCollected)} />
        <StatCard label={t('stat_outstanding')} value={formatCurrency(outstanding)} accent="text-red-600" />
        <StatCard label={t('stat_open_quotations')} value={String(openQuotations)} />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900">
          {t('recent_documents')}
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500">{t('no_documents_yet')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-start text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 text-start">{t('number')}</th>
                <th className="px-4 py-2 text-start">{t('client')}</th>
                <th className="px-4 py-2 text-start">{t('issue_date')}</th>
                <th className="px-4 py-2 text-start">{t('status')}</th>
                <th className="px-4 py-2 text-start">{t('total')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((doc) => (
                <tr key={doc.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onPreview(doc.id)}>
                  <td className="px-4 py-2 font-medium text-gray-900">{doc.number}</td>
                  <td className="px-4 py-2 text-gray-600">{clientName(doc.clientId)}</td>
                  <td className="px-4 py-2 text-gray-600">{formatDate(doc.issueDate)}</td>
                  <td className="px-4 py-2"><StatusBadge status={doc.status} /></td>
                  <td className="px-4 py-2 text-gray-600">{formatCurrency(calcDocumentTotals(doc).grandTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
