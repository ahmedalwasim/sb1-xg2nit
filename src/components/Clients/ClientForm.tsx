import React, { useState } from 'react';
import { Client } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ClientFormProps {
  initial?: Client;
  onSubmit: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const { t } = useLanguage();
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '');
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? '');
  const [vatNumber, setVatNumber] = useState(initial?.vatNumber ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim()) return;
    onSubmit({ nameEn, nameAr, vatNumber, address, phone, email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label={t('name_en')} value={nameEn} onChange={setNameEn} required />
      <Field label={t('name_ar')} value={nameAr} onChange={setNameAr} dir="rtl" />
      <Field label={t('vat_number')} value={vatNumber} onChange={setVatNumber} />
      <Field label={t('address')} value={address} onChange={setAddress} />
      <Field label={t('phone')} value={phone} onChange={setPhone} />
      <Field label={t('email')} value={email} onChange={setEmail} type="email" />
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
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </label>
  );
}
