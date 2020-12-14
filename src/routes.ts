import React from 'react';
import { Home } from './Home';
import { Category } from './Category';
import { Product } from './Product';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import ShippingAndReturns from './ShippingAndReturns';
import TermsAndConditions from './TermsAndConditions';
import Company from './Company';
import Industries from './Industries';
import Services from './Services';
import { CompareProducts } from './CompareProducts';
import { RegistrationForm } from "./RegistrationForm";
import { OidcHandler } from './LoginDialog/OidcHandler';
import { MyAccount } from './MyAccount';
import { Profile } from './Profile';
import { Address } from './Address';
import { Search } from './Search';
import { OrdersHistory } from './OrdersHistory';
import { OrderDetails } from './OrderDetails';
import { Orders } from './Orders';
import { BulkOrder } from './BulkOrder';
import { QuickOrder } from './QuickOrder';

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
  { exact: true, path: '/company', component: Company, },
  { exact: true, path: '/industries', component: Industries, },
  { exact: true, path: '/services', component: Services, },
  { exact: true, path: '/compare-products', component: CompareProducts, },
  { exact: true, path: '/registration', component: RegistrationForm, },
  { exact: true, path: '/oidc', component: OidcHandler, },
  { exact: false, path: '/account', component: MyAccount, },
  { exact: false, path: '/search', component: Search, },
  { exact: true, path: '/orderdetails/:orderId', component: OrderDetails, },
  { exact: false, path: '/orders', component: Orders, },
];

export const routesAccount: RouteConfig[] = [
  { exact: true, path: '/account', component: Profile, },
  { exact: true, path: '/account/address', component: Address, },
  { exact: true, path: '/account/orders-history', component: OrdersHistory, },
];

export const routesOrders: RouteConfig[] = [
  { exact: true, path: '/orders/bulk-order', component: BulkOrder, },
  { exact: true, path: '/orders/quick-order', component: QuickOrder, },
];

export function createHomeUrl(): string {
  return '/';
}

export function createOrderDetailsUrl () {
  return '/orderdetails';
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

export function createOrdersHistoryUrl(): string {
  return `/account/orders-history`;
}

export function createSearchUrl(): string {
  return `/search`;
}

export function createBulkOrderUrl(): string {
  return `/orders/bulk-order`;
}

export function createQuickOrderUrl(): string {
  return `/orders/quick-order`;
}
