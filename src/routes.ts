import React from 'react';
import { Home } from './Home';
import { Category } from './Category';
import { Product } from './Product';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage';
import ShippingReturnsPage from './ShippingReturns';
import TermsAndConditionsPage from './TermsAndConditionsPage';
import { CompareProducts } from './CompareProducts';
import { RegistrationForm } from "./RegistrationForm";
import { Search } from './Search';

interface RouteConfig {
  path: string;
  exact: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  { exact: true, path: '/', component: Home, },
  { exact: true, path: '/category/:categorySlug/:pageNum?', component: Category, },
  { exact: true, path: '/product/:productSlug', component: Product, },
  { exact: true, path: '/aboutus', component: AboutUsPage, },
  { exact: true, path: '/contactus', component: ContactUsPage, },
  { exact: true, path: '/shippingreturns', component: ShippingReturnsPage, },
  { exact: true, path: '/termsandconditions', component: TermsAndConditionsPage, },
  { exact: true, path: '/compare-products', component: CompareProducts, },
  { exact: true, path: '/registration', component: RegistrationForm, },
  { exact: true, path: '/search', component: Search, }
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

export function createSearchUrl(): string {
  return `/search`;
}
