import { DocStatus } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

const COLORS: Record<DocStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  overdue: 'bg-red-100 text-red-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  converted: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-200 text-gray-500',
};

export function StatusBadge({ status }: { status: DocStatus }) {
  const { t } = useLanguage();
  const labelKey = `status_${status}` as const;
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status]}`}>
      {t(labelKey)}
    </span>
  );
}
