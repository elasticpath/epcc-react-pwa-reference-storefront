import { useState, useEffect } from 'react';
import constate from 'constate';
import * as moltin from '@moltin/sdk';
import { getCustomer, loadCategoryTree, Product, loadCustomerAuthenticationSettings, loadAuthenticationProfiles} from './service';
import * as service from './service';
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

function useCustomerDataState() {
  console.log('useCustomerDataState is running')
  const token = localStorage.getItem('mtoken') || '';
  const id = localStorage.getItem('mcustomer') || '';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerToken, setCustomerToken] = useState(token);
  const [customerId, setCustomerId] = useState(id);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    if (customerToken) {
      getCustomer(customerId, customerToken).then(customer => {
        if (customer.email) {
          setCustomerEmail(customer.email);
          setCustomerName(customer.name);
        }
        setIsLoggedIn(true);
      });
    } else {
      clearCustomerData();
    }
  }, [customerId, customerToken]);

  const setCustomerData = (token: string, id: string) => {
    localStorage.setItem('mtoken', token);
    localStorage.setItem('mcustomer', id);
    setCustomerToken(token);
    setCustomerId(id);
  };

  const clearCustomerData = () => {
    localStorage.setItem('mtoken', '');
    localStorage.setItem('mcustomer', '');
    setCustomerToken('');
    setCustomerId('');
    setIsLoggedIn(false);
  };

  const setEmail = (email:string) => {
    setCustomerEmail(email);
  };

  return {
    isLoggedIn,
    customerEmail,
    customerName,
    setEmail,
    setCustomerData,
    clearCustomerData
  }
}

const defaultCurrency = 'USD';

function useCurrencyState() {
  const [allCurrencies, setAllCurrencies] = useState<moltin.CurrencyBase[]>([]);
  // Set previously saved or defautlt currency before fetching the list of supported ones
  const [selectedCurrency, setSelectedCurrency] = useState(localStorage.getItem('selectedCurrency') ?? defaultCurrency);

  const setCurrency = (newCurrency: string) => {
    localStorage.setItem('selectedCurrency', newCurrency);
    setSelectedCurrency(newCurrency);
  };

  useEffect(() => {
    // Only fetch currencies once
    if (allCurrencies.length > 0) {
      return;
    }

    service.loadEnabledCurrencies().then(currencies => {
      // Check if we need to update selectedCurrency
      const selected = currencies.find(c => c.code === selectedCurrency);

      if (!selected) {
        // Saved or default currency we initially selected was not found in the list of server currencies
        // Switch selectedCurrency to server default one if exist or first one in the list
        setSelectedCurrency(currencies.find(c => c.default)?.code ?? currencies[0].code);

        // Clear selection in local storage
        localStorage.removeItem('selectedCurrency');
      }

      setAllCurrencies(currencies);
    }).catch((err) => {
      console.error(err)
    });
  }, [allCurrencies.length, selectedCurrency]);

  return {
    allCurrencies,
    selectedCurrency,
    setCurrency,
  }
}

function getCategoryPaths(categories: moltin.CategoryBase[]): { [categoryId: string]: moltin.CategoryBase[] } {
  const lastCat = categories[categories.length - 1];

  let map: { [categoryId: string]: moltin.CategoryBase[] } = {
    [lastCat.slug]: [...categories]
  };

  const childCats = lastCat.children ?? [];

  for (const child of childCats) {
    map = { ...map, ...getCategoryPaths([...categories, child]) };
  }

  return map;
}

function mergeMaps(tree: moltin.CategoryBase[]): { [categoryId: string]: moltin.CategoryBase[] } {
  return tree.reduce((acc, c) => ({ ...acc, ...getCategoryPaths([c]) }), {});
}

function useCategoriesState(selectedLanguage: string) {
  const [categoryPaths, setCategoryPaths] = useState<{ [categoryId: string]: moltin.CategoryBase[] }>();
  const [categoriesTree, setCategoriesTree] = useState<moltin.CategoryBase[]>();

  useEffect(() => {
    setCategoryPaths(undefined);
    setCategoriesTree(undefined);

    loadCategoryTree().then(result => {
      setCategoriesTree(result);
      setCategoryPaths(mergeMaps(result));
    }).catch(err=>{

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

// We should hold all the state here??
function useCustomerAuthenticationSettingsState() {
  // We need to make this state work for both...
  const [ authenticationSettings, setAuthenticationSettings ] = useState<object>()
  const [ authenticationProfiles, setAuthenticationProfiles ] = useState<object>();

  useEffect(()=>{
    loadCustomerAuthenticationSettings().then((authSettings) => {
      setAuthenticationSettings(authSettings);
      
      const authenticationRealmId = authSettings?.data?.relationships['authentication-realm']?.data?.id
      console.log('getting the authentication RealmId')
      console.log(authenticationRealmId)
      loadAuthenticationProfiles(authenticationRealmId, 'STORE-ID-PLACEHOLDER').then((profiles: any) => {  
        console.log('loading the authentication profiles')
        console.log(profiles)
        setAuthenticationProfiles(profiles);
      })
    }).catch((err)=>{
      console.log(err)
    });
  },[])
  

  return { authenticationSettings, authenticationProfiles }
}

function useGlobalState() {
  const translation = useTranslationState();
  const currency = useCurrencyState();

  return {
    translation,
    customerData: useCustomerDataState(),
    currency,
    categories: useCategoriesState(translation.selectedLanguage),
    compareProducts: useCompareProductsState(),
    authenticationSettings: useCustomerAuthenticationSettingsState(),
  };
}

export const [
  AppStateProvider,
  useTranslation,
  useCustomerData,
  useCurrency,
  useCategories,
  useCompareProducts,
  useCustomerAuthenticationSettings,
] = constate(
  useGlobalState,
  value => value.translation,  
  value => value.customerData,
  value => value.currency,
  value => value.categories,
  value => value.compareProducts,
  value => value.authenticationSettings,
);
