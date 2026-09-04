import { useLanguage } from '../../i18n/LanguageContext';

export function TopBar() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="flex items-center justify-end gap-2 border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex overflow-hidden rounded-md border border-gray-300 text-sm">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 ${language === 'en' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`px-3 py-1 ${language === 'ar' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
        >
          عربي
        </button>
      </div>
    </header>
  );
}
