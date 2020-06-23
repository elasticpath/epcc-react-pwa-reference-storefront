import { gateway as MoltinGateway } from '@moltin/sdk';
import { config } from './config';

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  type: string;
  status: 'live' | 'draft';
  children?: Category[];
}

export interface Price {
  amount: number;
  currency: string;
  includes_tax: boolean;
}

export interface FormattedPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export interface Weight {
  g: number,
  kg: number,
  lb: number,
  oz: number,
}

export interface ProductBase {
  id: string;
  type: string;
  name: string;
  slug: string;
  sku: string;
  manage_stock: boolean;
  description: string;
  price: Price[];
  status?: 'draft' | 'live';
  commodity_type:	'physical' | 'digital';
  meta: {
    timestamps: {
      created_at: string;
      updated_at: string;
    };
    stock: {
      level: number;
      availability: 'in-stock' | 'out-stock';
    };
    display_price: {
      with_tax: FormattedPrice;
      without_tax: FormattedPrice;
    };
    variations?: any[];
  };
  relationships: {
    main_image: {
      data: {
        id: string;
        type: string;
      };
    };
    categories?: any;
    collections?: any;
    brands?: any;
  };
}

export interface Product extends ProductBase {
  background_color: string;
  background_colour: string | null;
  bulb: string;
  bulb_qty: string;
  finish: string;
  material: string;
  max_watt: string;
  new: string | null;
  on_sale: string | null;
  weight: Weight;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

export async function loadCategoryTree(): Promise<Category[]> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Categories.Tree();

  return result.data;
}

const productCache: { [id: string]: Product } = {};

export async function loadCategoryProducts(categoryId: string, pageNum: number): Promise<Paginated<Product>> {
  const moltin = MoltinGateway({ client_id: config.clientId });

  const result = await moltin.Products
    .Offset((pageNum - 1) * config.categoryPageSize)
    .Limit(config.categoryPageSize)
    .Filter({
      eq: {
        category: {
          id: categoryId
        }
      }
    })
    .All();

  const pagination: Pagination = {
    currentPage: result.meta.page.current,
    pageSize: result.meta.page.limit,
    totalPages: result.meta.page.total,
    totalItems: result.meta.results.total,
  };

  for (const product of result.data) {
    productCache[product.slug] = product;
  }

  return {
    data: result.data,
    pagination,
  };
}

const imageHrefCache: { [key: string]: string } = {};

export async function loadImageHref(imageId: string): Promise<string | undefined> {
  if (!imageId) {
    return undefined;
  }

  if (imageHrefCache[imageId]) {
    return imageHrefCache[imageId];
  }

  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Files.Get(imageId);

  imageHrefCache[imageId] = result.data.link.href;

  return result.data.link.href;
}

export async function loadProductBySlug(productSlug: string): Promise<Product> {
  if (productCache[productSlug]) {
    return productCache[productSlug];
  }

  const moltin = MoltinGateway({ client_id: config.clientId });

  const result = await moltin.Products
    .Limit(1)
    .Filter({
      eq: {
        slug: productSlug
      }
    })
    .All();

  const product = result.data[0];
  productCache[product.slug] = product;

  return product;
}

export async function register(name: string, email: string, password: string) {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Create({
    type: 'customer',
    name,
    email,
    password
  });

  await login(data.email, password);
}

export async function login(email: string, password: string) {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Token(email, password).then();

  await getCustomer(data.id, data.token);

  window.location.href = '/';
}

export async function getCustomer(id: string, token: string) {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Customers.Get(id, token);

  localStorage.setItem('mcustomer', id);
  localStorage.setItem('mtoken', token);

  return result;
}
