import { useState } from 'react';
import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Modal } from '../common/Modal';
import { ProductForm } from './ProductForm';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';

export function ProductList() {
  const { data, addProduct, updateProduct, deleteProduct } = useAppData();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleSubmit = (values: Omit<Product, 'id' | 'createdAt'>) => {
    if (editing) {
      updateProduct({ ...editing, ...values });
    } else {
      addProduct(values);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('delete_confirm'))) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{t('products_title')}</h1>
        <button onClick={openNew} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          + {t('add_product')}
        </button>
      </div>

      {data.products.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          {t('no_products_yet')}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-start text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 text-start">{t('name_en')}</th>
                <th className="px-4 py-2 text-start">{t('unit')}</th>
                <th className="px-4 py-2 text-start">{t('price')}</th>
                <th className="px-4 py-2 text-start">{t('vat_rate')}</th>
                <th className="px-4 py-2 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2">
                    <div className="font-medium text-gray-900">{product.nameEn}</div>
                    {product.nameAr && <div className="text-xs text-gray-500" dir="rtl">{product.nameAr}</div>}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{product.unit}</td>
                  <td className="px-4 py-2 text-gray-600">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-2 text-gray-600">{product.vatRate}%</td>
                  <td className="px-4 py-2">
                    <button onClick={() => openEdit(product)} className="me-3 text-emerald-700 hover:underline">
                      {t('edit')}
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title={editing ? t('edit_product') : t('add_product')} onClose={() => setShowForm(false)}>
          <ProductForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
