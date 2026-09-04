import React, { useState } from 'react';
import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';

export function CompanySettings() {
  const { data, updateCompany } = useAppData();
  const { t } = useLanguage();
  const [form, setForm] = useState(data.company);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('logoDataUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(form);
    setSaved(true);
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-gray-900">{t('company_settings_title')}</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-4">
          {form.logoDataUrl && <img src={form.logoDataUrl} alt="logo" className="h-14 w-14 rounded object-contain border border-gray-200" />}
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">{t('upload_logo')}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t('name_en')} value={form.nameEn} onChange={(v) => handleChange('nameEn', v)} />
          <Field label={t('name_ar')} value={form.nameAr} onChange={(v) => handleChange('nameAr', v)} dir="rtl" />
          <Field label={t('vat_number')} value={form.vatNumber} onChange={(v) => handleChange('vatNumber', v)} />
          <Field label={t('cr_number')} value={form.crNumber} onChange={(v) => handleChange('crNumber', v)} />
          <Field label={t('address')} value={form.address} onChange={(v) => handleChange('address', v)} />
          <Field label={t('city')} value={form.city} onChange={(v) => handleChange('city', v)} />
          <Field label={t('phone')} value={form.phone} onChange={(v) => handleChange('phone', v)} />
          <Field label={t('email')} value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            {t('save')}
          </button>
          {saved && <span className="text-sm text-emerald-700">✓</span>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: 'rtl' | 'ltr';
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </label>
  );
}
