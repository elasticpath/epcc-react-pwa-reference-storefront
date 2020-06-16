import React from 'react';
import { Home } from './Home';
import { Category } from './Category';
import { Product } from './Product';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage';
import ShippingReturnsPage from './ShippingReturns';
import TermsAndConditionsPage from './TermsAndConditionsPage';

interface RouteConfig {
  path: string;
  exact: boolean;
  component: React.ComponentType<any>;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/category/:categorySlug/:pageNum?',
    exact: true,
    component: Category,
  },
  {
    path: '/product/:productSlug',
    exact: true,
    component: Product,
  },
  {
    path: '/aboutus',
    exact: true,
    component: AboutUsPage,
  },
  {
    path: '/contactus',
    exact: true,
    component: ContactUsPage,
  },
  {
    path: '/shippingreturns',
    exact: true,
    component: ShippingReturnsPage,
  },
  {
    path: '/termsandconditions',
    exact: true,
    component: TermsAndConditionsPage,
  }
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
