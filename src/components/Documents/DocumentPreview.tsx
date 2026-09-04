import { BusinessDocument, Client, Company } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { calcDocumentTotals, calcLineGrandTotal } from '../../utils/vat';
import { formatCurrency, formatDate } from '../../utils/format';
import { buildZatcaQrBase64 } from '../../utils/zatca';
import { QRCodeImage } from './QRCodeImage';
import { StatusBadge } from '../common/StatusBadge';

interface DocumentPreviewProps {
  doc: BusinessDocument;
  client: Client | undefined;
  company: Company;
  onBack: () => void;
}

export function DocumentPreview({ doc, client, company, onBack }: DocumentPreviewProps) {
  const { t } = useLanguage();
  const totals = calcDocumentTotals(doc);
  const isInvoice = doc.type === 'invoice';

  const qrValue = isInvoice
    ? buildZatcaQrBase64({
        sellerName: company.nameEn || 'Seller',
        vatNumber: company.vatNumber || '000000000000003',
        timestamp: new Date(doc.issueDate).toISOString(),
        invoiceTotal: totals.grandTotal.toFixed(2),
        vatTotal: totals.vatTotal.toFixed(2),
      })
    : '';

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <button onClick={onBack} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {t('back')}
        </button>
        <button onClick={() => window.print()} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          {t('print_pdf')}
        </button>
      </div>

      <div className="print-area mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-8 text-sm text-gray-800 shadow-sm">
        <div className="mb-6 flex items-start justify-between border-b border-gray-200 pb-6">
          <div>
            {company.logoDataUrl && <img src={company.logoDataUrl} alt="logo" className="mb-2 h-12 object-contain" />}
            <div className="text-lg font-bold text-gray-900">{company.nameEn || '—'}</div>
            <div className="text-base font-bold text-gray-900" dir="rtl">{company.nameAr}</div>
            <div className="mt-1 text-xs text-gray-500">
              {company.address}{company.address && company.city ? ', ' : ''}{company.city}
            </div>
            <div className="text-xs text-gray-500">{company.phone} {company.email && `· ${company.email}`}</div>
            <div className="text-xs text-gray-500">{t('vat_number')}: {company.vatNumber || '—'} · {t('cr_number')}: {company.crNumber || '—'}</div>
          </div>
          <div className="text-end">
            <div className="text-2xl font-bold uppercase tracking-wide text-emerald-700">
              {isInvoice ? t('invoice') : t('quotation')}
            </div>
            <div className="text-gray-500">{doc.number}</div>
            <div className="mt-2"><StatusBadge status={doc.status} /></div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase text-gray-500">
              {isInvoice ? t('invoice_to') : t('quotation_to')}
            </div>
            <div className="font-medium text-gray-900">{client?.nameEn || '—'}</div>
            {client?.nameAr && <div dir="rtl">{client.nameAr}</div>}
            {client?.vatNumber && <div className="text-xs text-gray-500">{t('vat_number')}: {client.vatNumber}</div>}
            {client?.address && <div className="text-xs text-gray-500">{client.address}</div>}
          </div>
          <div className="text-end">
            <div><span className="text-gray-500">{t('issue_date')}: </span>{formatDate(doc.issueDate)}</div>
            {isInvoice && <div><span className="text-gray-500">{t('due_date')}: </span>{formatDate(doc.dueDate)}</div>}
          </div>
        </div>

        <table className="mb-6 w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-300 text-start uppercase text-gray-500">
              <th className="py-2 text-start">{t('description_en')}</th>
              <th className="py-2 text-end">{t('quantity')}</th>
              <th className="py-2 text-end">{t('unit_price')}</th>
              <th className="py-2 text-end">{t('discount_pct')}</th>
              <th className="py-2 text-end">{t('vat_rate')}</th>
              <th className="py-2 text-end">{t('total')}</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-2">
                  <div>{item.descriptionEn}</div>
                  {item.descriptionAr && <div dir="rtl" className="text-gray-500">{item.descriptionAr}</div>}
                </td>
                <td className="py-2 text-end">{item.quantity}</td>
                <td className="py-2 text-end">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2 text-end">{item.discountPercent}%</td>
                <td className="py-2 text-end">{item.vatRate}%</td>
                <td className="py-2 text-end font-medium">{formatCurrency(calcLineGrandTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-start justify-between gap-6">
          <div>
            {isInvoice && qrValue && (
              <div className="text-center">
                <QRCodeImage value={qrValue} size={120} />
                <div className="mt-1 text-[10px] text-gray-500">{t('scan_to_verify')}</div>
              </div>
            )}
            {doc.notes && (
              <div className="mt-4 max-w-xs text-xs text-gray-600">
                <div className="font-semibold text-gray-700">{t('notes')}</div>
                {doc.notes}
              </div>
            )}
          </div>
          <div className="w-56 shrink-0">
            <Row label={t('subtotal')} value={formatCurrency(totals.subtotal)} />
            <Row label={t('discount_total')} value={formatCurrency(totals.discountTotal)} />
            <Row label={t('vat_total')} value={formatCurrency(totals.vatTotal)} />
            <Row label={t('grand_total')} value={formatCurrency(totals.grandTotal)} bold />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          {t('thank_you')}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between border-b border-gray-100 py-1.5 last:border-0 ${bold ? 'text-base font-semibold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
