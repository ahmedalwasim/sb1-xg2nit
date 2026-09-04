import { useLanguage } from '../../i18n/LanguageContext';
import { View } from '../../App';

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
}

export function Sidebar({ view, onNavigate }: SidebarProps) {
  const { t } = useLanguage();

  const items: { page: View['page']; label: string; icon: string }[] = [
    { page: 'dashboard', label: t('nav_dashboard'), icon: '▦' },
    { page: 'invoices', label: t('nav_invoices'), icon: '⧉' },
    { page: 'quotations', label: t('nav_quotations'), icon: '✎' },
    { page: 'clients', label: t('nav_clients'), icon: '▤' },
    { page: 'products', label: t('nav_products'), icon: '▣' },
    { page: 'settings', label: t('nav_settings'), icon: '⚙' },
  ];

  const isActive = (page: View['page']) => view.page === page;

  return (
    <nav className="flex w-full shrink-0 flex-col gap-1 border-e border-gray-200 bg-white p-3 md:w-56 md:min-h-screen">
      <div className="mb-4 px-2 pt-2">
        <div className="text-lg font-bold text-emerald-700">{t('appName')}</div>
        <div className="text-xs text-gray-500">{t('tagline')}</div>
      </div>
      {items.map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate({ page: item.page } as View)}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-start text-sm font-medium transition-colors ${
            isActive(item.page)
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span aria-hidden className="text-base">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
