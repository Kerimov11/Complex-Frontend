import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher({ full = false, className = '' }) {
  const { lang, setLang, languages } = useLanguage();

  if (full) {
    return (
      <div
        data-no-translate="true"
        className={`grid grid-cols-3 gap-2.5 ${className}`}
      >
        {languages.map((item) => {
          const active = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setLang(item.code)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border flex items-center justify-center gap-2 ${
                active
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.18)]'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="uppercase font-bold tracking-wider">{item.label}</span>
              <span className="text-[11px] opacity-80">({item.fullLabel})</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      data-no-translate="true"
      className={`inline-flex items-center rounded-xl bg-slate-900/80 border border-sky-400/20 p-0.5 ${className}`}
      title="Dil seçimi / Language / Язык"
    >
      {languages.map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all ${
              active
                ? 'bg-sky-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
