import { useState } from 'react';
import { useAppData } from '../../store/AppDataContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Modal } from '../common/Modal';
import { ClientForm } from './ClientForm';
import { Client } from '../../types';

export function ClientList() {
  const { data, addClient, updateClient, deleteClient } = useAppData();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (client: Client) => {
    setEditing(client);
    setShowForm(true);
  };

  const handleSubmit = (values: Omit<Client, 'id' | 'createdAt'>) => {
    if (editing) {
      updateClient({ ...editing, ...values });
    } else {
      addClient(values);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('delete_confirm'))) {
      deleteClient(id);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{t('clients_title')}</h1>
        <button onClick={openNew} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          + {t('add_client')}
        </button>
      </div>

      {data.clients.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          {t('no_clients_yet')}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-start text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-2 text-start">{t('name_en')}</th>
                <th className="px-4 py-2 text-start">{t('vat_number')}</th>
                <th className="px-4 py-2 text-start">{t('phone')}</th>
                <th className="px-4 py-2 text-start">{t('email')}</th>
                <th className="px-4 py-2 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-2">
                    <div className="font-medium text-gray-900">{client.nameEn}</div>
                    {client.nameAr && <div className="text-xs text-gray-500" dir="rtl">{client.nameAr}</div>}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{client.vatNumber || '—'}</td>
                  <td className="px-4 py-2 text-gray-600">{client.phone || '—'}</td>
                  <td className="px-4 py-2 text-gray-600">{client.email || '—'}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => openEdit(client)} className="me-3 text-emerald-700 hover:underline">
                      {t('edit')}
                    </button>
                    <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:underline">
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
        <Modal title={editing ? t('edit_client') : t('add_client')} onClose={() => setShowForm(false)}>
          <ClientForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
