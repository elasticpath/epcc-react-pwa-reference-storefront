import React, { useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useTranslation, useCurrency } from './app-state';

import './LanguageDropdown.scss';

const languages = [
  { key: 'en', name: 'english' },
  { key: 'fr', name: 'french' },
];

export const LanguageDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, selectedLanguage, setLanguage } = useTranslation();
  const { allCurrencies, selectedCurrency, setCurrency } = useCurrency();

  const selectedLangName = languages.find(l => l.key === selectedLanguage)!.name;

  const handleSelectorClicked = () => {
    setIsOpen(true);
  };

  const ref = useOnclickOutside(() => {
    setIsOpen(false);
  });

  const handleLanguageSelected = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  }

  const handleCurrencySelected = (currency: string) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="languagedropdown">
      <button className="languagedropdown__selectorbtn" onClick={handleSelectorClicked}>
        {`${t(selectedLangName)}/${selectedCurrency}`}
      </button>
      <button className="languagedropdown__selectorbtn --small" onClick={handleSelectorClicked}>
        {selectedLanguage}
      </button>
      {isOpen && (
        <div ref={ref} className="languagedropdown__dropdown">
          <div className="languagedropdown__section">
            <div className="languagedropdown__title">
              {t('language')}
            </div>
            {languages.map(l => (
              <button
                key={l.key}
                className="languagedropdown__itembtn"
                disabled={selectedLanguage === l.key}
                onClick={() => handleLanguageSelected(l.key)}
              >
                {t(l.name)}
              </button>
            ))}
          </div>
          <div className="languagedropdown__section">
            <div className="languagedropdown__title">
              Currency
            </div>
            {allCurrencies.map(c => (
              <button
                key={c.id}
                className="languagedropdown__itembtn"
                disabled={selectedCurrency === c.code}
                onClick={() => handleCurrencySelected(c.code)}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
