import React from 'react';
import { Home } from './Home';
import { Category } from './Category';
import { Product } from './Product';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import ShippingAndReturns from './ShippingAndReturns';
import TermsAndConditions from './TermsAndConditions';
import { CompareProducts } from './CompareProducts';
import { RegistrationForm } from "./RegistrationForm";
import { MyAccount } from './MyAccount';
import { Profile } from './Profile';
import { Address } from './Address';
import { Search } from './Search';
import { PurchaseHistory } from './PurchaseHistory';
import { OrderDetails } from './OrderDetails';

interface RouteConfig {
  path: string;
  exact: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { exact: true, path: '/', component: Home, },
  { exact: true, path: '/category/:categorySlug/:pageNum?', component: Category, },
  { exact: true, path: '/product/:productSlug', component: Product, },
  { exact: true, path: '/aboutus', component: AboutUs, },
  { exact: true, path: '/contactus', component: ContactUs, },
  { exact: true, path: '/shippingreturns', component: ShippingAndReturns, },
  { exact: true, path: '/termsandconditions', component: TermsAndConditions, },
  { exact: true, path: '/compare-products', component: CompareProducts, },
  { exact: true, path: '/registration', component: RegistrationForm, },
  { exact: false, path: '/account', component: MyAccount, },
  { exact: false, path: '/search', component: Search, },
  { exact: true, path: '/orderdetails/:orderId', component: OrderDetails, },
];

export const routesAccount: RouteConfig[] = [
  { exact: true, path: '/account', component: Profile, },
  { exact: true, path: '/account/address', component: Address, },
  { exact: true, path: '/account/purchase-history', component: PurchaseHistory, },
];

export function createHomeUrl(): string {
  return '/';
}

export function createCategoryUrl(categorySlug: string, pageNum?: number): string {
  return `/category/${categorySlug}${pageNum && pageNum > 1 ? `/${pageNum}` : ''}`;
}

export function createProductUrl(productSlug: string): string {
  return `/product/${productSlug}`;
}

export function createCompareProductsUrl(): string {
  return `/compare-products`;
}

export function createRegistrationUrl(): string {
  return `/registration`;
}

export function createAccountUrl(): string {
  return `/account`;
}

export function createAddressUrl(): string {
  return `/account/address`;
}

export function createPurchaseHistoryUrl(): string {
  return `/account/purchase-history`;
}

export function createSearchUrl(): string {
  return `/search`;
}
