import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { STANDARD_VAT_RATE } from '../../utils/vat';

interface ProductFormProps {
  initial?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ProductForm({ initial, onSubmit, onCancel }: ProductFormProps) {
  const { t } = useLanguage();
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '');
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? '');
  const [unit, setUnit] = useState(initial?.unit ?? 'piece');
  const [price, setPrice] = useState(initial ? String(initial.price) : '');
  const [vatRate, setVatRate] = useState(initial ? String(initial.vatRate) : String(STANDARD_VAT_RATE));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    onSubmit({
      nameEn,
      nameAr,
      unit,
      price: Number(price) || 0,
      vatRate: Number(vatRate) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label={t('name_en')} value={nameEn} onChange={setNameEn} required />
      <Field label={t('name_ar')} value={nameAr} onChange={setNameAr} dir="rtl" />
      <Field label={t('unit')} value={unit} onChange={setUnit} />
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('price')} value={price} onChange={setPrice} type="number" />
        <Field label={t('vat_rate')} value={vatRate} onChange={setVatRate} type="number" />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {t('cancel')}
        </button>
        <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          {t('save')}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  dir,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: 'rtl' | 'ltr';
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        dir={dir}
        required={required}
        step={type === 'number' ? '0.01' : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </label>
  );
}
