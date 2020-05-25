import React from 'react';
import { Home } from './Home';
import { Category } from './Category';
import { Product } from './Product';

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
