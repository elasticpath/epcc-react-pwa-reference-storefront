import { useState, useEffect, useCallback } from 'react';
import constate from 'constate';
import * as moltin from '@moltin/sdk';
import { getCustomer, getAddresses, getAllOrders, loadCategoryTree, getCartItems, loadCustomerAuthenticationSettings, loadOidcProfiles } from './service';
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

  const setCustomerData = useCallback((token: string, id: string) => {
    localStorage.setItem('mtoken', token);
    localStorage.setItem('mcart', id);
    localStorage.setItem('mcustomer', id);
    setCustomerToken(token);
    setCustomerId(id);
  }, []);

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

  const setName = (name:string) => {
    setCustomerName(name);
  };

  return {
    token,
    id,
    isLoggedIn,
    customerEmail,
    customerName,
    setEmail,
    setName,
    setCustomerData,
    clearCustomerData
  }
}

function useAddressDataState() {
  const token = localStorage.getItem('mtoken') || '';
  const id = localStorage.getItem('mcustomer') || '';

  const [addressData, setAddressData] = useState<moltin.Address[]>([]);

  useEffect(() => {
    if (token) {
      getAddresses(id, token).then(res => {
        setData(res.data);
      });
    }
    else {
      clearCustomerData();
    }
  }, [id, token]);

  const updateAddresses = () => {
    getAddresses(id, token).then(res => {
      setData(res.data);
    });
  };

  const setData = (data: any) => {
    setAddressData(data);
  };
  const clearCustomerData = () => {
    setAddressData([]);
  };

  return { addressData, updateAddresses }

}

function usePurchaseHistoryState() {
  const token = localStorage.getItem('mtoken') || '';
  const id = localStorage.getItem('mcustomer') || '';

  const [ordersData, setOrdersData] = useState<moltin.Order[]>([]);

  useEffect(() => {
    if (token) {
      getAllOrders(token).then(res => {
        setData(res.data);
      });
    }
    else {
      clearCustomerData();
    }
  }, [id, token]);

  const updatePurchaseHistory = () => {
    getAllOrders(token).then(res => {
      setData(res.data);
    });
  };

  const setData = (data: any) => {
    setOrdersData(data);
  };

  const clearCustomerData = () => {
    setOrdersData([]);
  };

  return { ordersData, updatePurchaseHistory }
}

const defaultCurrency = 'USD';

function useCurrencyState() {
  const [allCurrencies, setAllCurrencies] = useState<moltin.Currency[]>([]);
  // Set previously saved or default currency before fetching the list of supported ones
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

function getCategoryPaths(categories: moltin.Category[]): { [categoryId: string]: moltin.Category[] } {
  const lastCat = categories[categories.length - 1];

  let map: { [categoryId: string]: moltin.Category[] } = {
    [lastCat.slug]: [...categories]
  };

  const childCats = lastCat.children ?? [];

  for (const child of childCats) {
    map = { ...map, ...getCategoryPaths([...categories, child]) };
  }

  return map;
}

function mergeMaps(tree: moltin.Category[]): { [categoryId: string]: moltin.Category[] } {
  return tree.reduce((acc, c) => ({ ...acc, ...getCategoryPaths([c]) }), {});
}

function useCategoriesState(selectedLanguage: string) {
  const [categoryPaths, setCategoryPaths] = useState<{ [categoryId: string]: moltin.Category[] }>();
  const [categoriesTree, setCategoriesTree] = useState<moltin.Category[]>();

  useEffect(() => {
    setCategoryPaths(undefined);
    setCategoriesTree(undefined);

    loadCategoryTree(selectedLanguage).then(result => {
      setCategoriesTree(result);
      setCategoryPaths(mergeMaps(result));
    }).catch(err=>console.error(err));
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
  const [compareProducts, setCompareProducts] = useState<moltin.Product[]>([]);
  const [showCompareMenu, setShowCompareMenu] = useState(false);

  const isComparing = (productId: string) => compareProducts.filter(p => p.id === productId).length > 0;
  const isCompareEnabled = (productId: string) => isComparing(productId) || compareProducts.length < config.maxCompareProducts;

  const addToCompare = (product: moltin.Product) => {
    if (!compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
      if (!showCompareMenu) {
        setShowCompareMenu(true);
        setTimeout(() => {
          setShowCompareMenu(false);
        }, 3200);
      }
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const removeAll = () => {
    setCompareProducts([]);
  };

  return {
    compareProducts,
    showCompareMenu,
    isComparing,
    isCompareEnabled,
    addToCompare,
    removeFromCompare,
    removeAll,
  };
}

function useCustomerAuthenticationSettingsState() {
  const [authenticationSettings, setAuthenticationSettings] = useState<any>()
  const [isLoadingOidcProfiles, setIsLoadingOidcProfiles] = useState(true);
  const [oidcProfiles, setOidcProfiles] = useState<moltin.ResourcePage<moltin.Profile>>();

  useEffect(()=>{
    loadCustomerAuthenticationSettings().then((authSettings) => {
      setAuthenticationSettings(authSettings);

      const authenticationRealmId = authSettings?.data?.relationships['authentication-realm']?.data?.id;

      loadOidcProfiles(authenticationRealmId).then((profiles) => {
        setOidcProfiles(profiles);
        setIsLoadingOidcProfiles(false);
      })
    }).catch((err)=>{
      console.log(err)
    });
  }, [])

  return { authenticationSettings, isLoadingOidcProfiles, oidcProfiles };
}

function useCartItemsState() {
  const [cartData, setCartData] = useState<moltin.CartItem[]>([]);
  const [promotionItems, setPromotionItems] = useState<moltin.CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState('');
  const mcart = localStorage.getItem('mcart') || '';

  useEffect(() => {
    if (mcart) {
      getCartItems(mcart).then(res => {
        setCartData(res.data.filter(({ type }) => type === 'cart_item' || type === 'custom_item'));
        setPromotionItems(res.data.filter(({ type }) => type === 'promotion_item'));
        setCount(res.data.reduce((sum, { quantity }) => sum + quantity, 0));
        setTotalPrice(res.meta.display_price.without_tax.formatted)
      });
    }
  }, [mcart]);

  const updateCartItems = () => {
    getCartItems(mcart).then(res => {
      setCartData(res.data.filter(({ type }) => type === 'cart_item' || type === 'custom_item'));
      setPromotionItems(res.data.filter(({ type }) => type === 'promotion_item'));
      setCount(res.data.reduce((sum, { quantity }) => sum + quantity, 0));
      setTotalPrice(res.meta.display_price.without_tax.formatted)
    });
  };

  return { cartData, promotionItems, count, totalPrice, updateCartItems }
}

function useGlobalState() {
  const translation = useTranslationState();
  const currency = useCurrencyState();
  const addressData = useAddressDataState();
  const ordersData = usePurchaseHistoryState();
  const cartData = useCartItemsState();

  return {
    translation,
    customerData: useCustomerDataState(),
    addressData,
    ordersData,
    cartData,
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
  useAddressData,
  useOrdersData,
  useCurrency,
  useCategories,
  useCompareProducts,
  useCustomerAuthenticationSettings,
  useCartData,
] = constate(
  useGlobalState,
  value => value.translation,
  value => value.customerData,
  value => value.addressData,
  value => value.ordersData,
  value => value.currency,
  value => value.categories,
  value => value.compareProducts,
  value => value.authenticationSettings,
  value => value.cartData,
);
