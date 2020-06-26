import { useState, useEffect } from 'react';
import constate from 'constate';
import { Category, loadCategoryTree, Product } from './service';
import { config } from './config';

import en from './locales/en.json';
import fr from './locales/fr.json';

const translations: { [lang: string]: { [name: string]: string } } = {
  en,
  fr,
};

const defaultLanguage = 'en';

function getInitialLanguage(): string {
  const savedLanguage = localStorage.getItem('selectedLanguage');

  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }

  if (navigator.language) {
    if (translations[navigator.language]) {
      return navigator.language;
    }

    const langPart = navigator.language.split('-')[0];
    if (translations[langPart]) {
      return langPart;
    }
  }

  if (navigator.languages) {
    for (const lang of navigator.languages) {
      if (translations[lang]) {
        return lang;
      }

      const langPart = lang.split('-')[0];
      if (translations[langPart]) {
        return langPart;
      }
    }
  }

  return defaultLanguage;
}

function checkTranslations() {
  const keys: { [key: string]: boolean } = {};

  for (const lang in translations) {
    for (const name in translations[lang]) {
      keys[name] = true;
    }
  }

  for (const lang in translations) {
    for (const key in keys) {
      if (!translations[lang][key]) {
        console.warn(`Language '${lang}' does not have translation for key: '${key}'`);
      }
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  checkTranslations();
}

function useTranslationState() {
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage());

  const t = (name: string, values?: { [key: string]: string }) => {
    const template = translations[selectedLanguage][name];

    if (!template) {
      return '';
    }

    const v = values ?? {};
    const r = Object.keys(v).reduce((acc, k) => acc.replace(`{${k}}`, v[k]), template);

    return r;
  };

  const setLanguage = (newLang: string) => {
    if (!translations[newLang]) {
      return;
    }

    localStorage.setItem('selectedLanguage', newLang);
    setSelectedLanguage(newLang);
  };

  return {
    t,
    selectedLanguage,
    setLanguage,
  };
}

const defaultCurrency = 'USD';

function useCurrencyState() {
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('selectedCurrency') ?? defaultCurrency);

  const setCurrency = (newCurrency: string) => {
    localStorage.setItem('selectedCurrency', newCurrency);
    setSelectedCurrency(newCurrency);
  };

  return {
    selectedCurrency,
    setCurrency,
  }
}

function getCategoryPaths(categories: Category[]): { [categoryId: string]: Category[] } {
  const lastCat = categories[categories.length - 1];

  let map: { [categoryId: string]: Category[] } = {
    [lastCat.slug]: [...categories]
  };

  const childCats = lastCat.children ?? [];

  for (const child of childCats) {
    map = { ...map, ...getCategoryPaths([...categories, child]) };
  }

  return map;
}

function mergeMaps(tree: Category[]): { [categoryId: string]: Category[] } {
  return tree.reduce((acc, c) => ({ ...acc, ...getCategoryPaths([c]) }), {});
}

function useCategoriesState(selectedLanguage: string) {
  const [categoryPaths, setCategoryPaths] = useState<{ [categoryId: string]: Category[] }>();
  const [categoriesTree, setCategoriesTree] = useState<Category[]>();

  useEffect(() => {
    setCategoryPaths(undefined);
    setCategoriesTree(undefined);

    loadCategoryTree().then(result => {
      setCategoriesTree(result);
      setCategoryPaths(mergeMaps(result));
    });
  }, [selectedLanguage]);

  const categoryPathBySlug = (slug: string) => {
    return categoryPaths?.[slug];
  };

  return {
    categoriesTree,
    categoryPathBySlug,
  };
}

function useCompareProductsState() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  const isComparing = (productId: string) => compareProducts.filter(p => p.id === productId).length > 0;
  const isCompareEnabled = (productId: string) => isComparing(productId) || compareProducts.length < config.maxCompareProducts;

  const addToCompare = (product: Product) => {
    if (!compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  }

  const removeAll = () => {
    setCompareProducts([]);
  }

  return {
    compareProducts,
    isComparing,
    isCompareEnabled,
    addToCompare,
    removeFromCompare,
    removeAll,
  };
}

function useGlobalState() {
  const translation = useTranslationState();
  const currency = useCurrencyState();

  return {
    translation,
    currency,
    categories: useCategoriesState(translation.selectedLanguage),
    compareProducts: useCompareProductsState(),
  };
}

export const [
  AppStateProvider,
  useTranslation,
  useCurrency,
  useCategories,
  useCompareProducts,
] = constate(
  useGlobalState,
  value => value.translation,
  value => value.currency,
  value => value.categories,
  value => value.compareProducts
);
