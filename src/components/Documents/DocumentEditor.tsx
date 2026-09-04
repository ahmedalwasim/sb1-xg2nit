import { useState } from 'react';
import { BusinessDocument, DocStatus, LineItem } from '../../types';
import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { generateId } from '../../utils/id';
import { STANDARD_VAT_RATE, calcDocumentTotals, calcLineGrandTotal } from '../../utils/vat';
import { formatCurrency } from '../../utils/format';

interface DocumentEditorProps {
  doc: BusinessDocument;
  onDone: () => void;
  onPreview: (id: string) => void;
}

const INVOICE_STATUSES: DocStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
const QUOTATION_STATUSES: DocStatus[] = ['draft', 'sent', 'accepted', 'rejected', 'cancelled'];

function newLineItem(): LineItem {
  return {
    id: generateId(),
    productId: null,
    descriptionEn: '',
    descriptionAr: '',
    quantity: 1,
    unitPrice: 0,
    discountPercent: 0,
    vatRate: STANDARD_VAT_RATE,
  };
}

export function DocumentEditor({ doc, onDone, onPreview }: DocumentEditorProps) {
  const { data, saveDocument } = useAppData();
  const { t } = useLanguage();
  const [draft, setDraft] = useState<BusinessDocument>(doc);
  const [error, setError] = useState('');

  const statuses = doc.type === 'invoice' ? INVOICE_STATUSES : QUOTATION_STATUSES;

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => {
    setDraft((prev) => ({ ...prev, items: [...prev.items, newLineItem()] }));
  };

  const removeItem = (id: string) => {
    setDraft((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const applyProduct = (itemId: string, productId: string) => {
    const product = data.products.find((p) => p.id === productId);
    if (!product) {
      updateItem(itemId, { productId: null });
      return;
    }
    updateItem(itemId, {
      productId: product.id,
      descriptionEn: product.nameEn,
      descriptionAr: product.nameAr,
      unitPrice: product.price,
      vatRate: product.vatRate,
    });
  };

  const totals = calcDocumentTotals(draft);

  const handleSave = () => {
    if (!draft.clientId) {
      setError(t('please_select_client'));
      return;
    }
    if (draft.items.length === 0) {
      setError(t('please_add_line'));
      return;
    }
    setError('');
    saveDocument(draft);
    onDone();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{draft.number}</h1>
        <div className="flex gap-2">
          <button onClick={onDone} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t('back')}
          </button>
          <button onClick={() => onPreview(draft.id)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t('view')}
          </button>
          <button onClick={handleSave} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {t('save_document')}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{t('client')}</span>
          <select
            value={draft.clientId}
            onChange={(e) => setDraft((prev) => ({ ...prev, clientId: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">{t('select_client')}</option>
            {data.clients.map((c) => (
              <option key={c.id} value={c.id}>{c.nameEn}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{t('issue_date')}</span>
          <input
            type="date"
            value={draft.issueDate}
            onChange={(e) => setDraft((prev) => ({ ...prev, issueDate: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{t('due_date')}</span>
          <input
            type="date"
            value={draft.dueDate}
            onChange={(e) => setDraft((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{t('status')}</span>
          <select
            value={draft.status}
            onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as DocStatus }))}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{t(`status_${s}` as const)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">{t('line_items')}</h2>
          <button onClick={addItem} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            + {t('add_line')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="text-start text-xs uppercase text-gray-500">
              <tr>
                <th className="px-2 py-2 text-start">{t('description_en')}</th>
                <th className="px-2 py-2 text-start">{t('description_ar')}</th>
                <th className="px-2 py-2 text-start">{t('quantity')}</th>
                <th className="px-2 py-2 text-start">{t('unit_price')}</th>
                <th className="px-2 py-2 text-start">{t('discount_pct')}</th>
                <th className="px-2 py-2 text-start">{t('vat_rate')}</th>
                <th className="px-2 py-2 text-start">{t('total')}</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {draft.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-2 py-2">
                    <select
                      value={item.productId ?? ''}
                      onChange={(e) => applyProduct(item.id, e.target.value)}
                      className="mb-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                    >
                      <option value="">—</option>
                      {data.products.map((p) => (
                        <option key={p.id} value={p.id}>{p.nameEn}</option>
                      ))}
                    </select>
                    <input
                      value={item.descriptionEn}
                      onChange={(e) => updateItem(item.id, { descriptionEn: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      dir="rtl"
                      value={item.descriptionAr}
                      onChange={(e) => updateItem(item.id, { descriptionAr: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                      className="w-24 rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.discountPercent}
                      onChange={(e) => updateItem(item.id, { discountPercent: Number(e.target.value) })}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      min={0}
                      value={item.vatRate}
                      onChange={(e) => updateItem(item.id, { vatRate: Number(e.target.value) })}
                      className="w-20 rounded-md border border-gray-300 px-2 py-1"
                    />
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-900">
                    {formatCurrency(calcLineGrandTotal(item))}
                  </td>
                  <td className="px-2 py-2">
                    <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{t('notes')}</span>
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))}
            rows={4}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          <Row label={t('subtotal')} value={formatCurrency(totals.subtotal)} />
          <Row label={t('discount_total')} value={formatCurrency(totals.discountTotal)} />
          <Row label={t('vat_total')} value={formatCurrency(totals.vatTotal)} />
          <Row label={t('grand_total')} value={formatCurrency(totals.grandTotal)} bold />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between border-b border-gray-100 py-1.5 last:border-0 ${bold ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
