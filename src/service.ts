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
    variation_matrix?: any;
  };
  relationships: {
    main_image: {
      data: {
        id: string;
        type: string;
      };
    };
    files: {
      data: {
        type: 'file';
        id: string;
      }[];
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

export interface Currency {
  id: string;
  code: string;
  decimal_places: number;
  decomal_point: string;
  default: boolean;
  enabled: boolean;
  exchange_rate: number;
  format: string;
  thousand_separator: string;
}

export interface Customer {
  data: {
    type: string;
    id: string;
    name: string;
    email: string;
    password: boolean;
  }
}

export interface CustomerToken {
  type: string;
  id: string;
  customer_id: string;
  token: string;
  expires: any;
}

export interface Address {
    id: string,
    type: string,
    name: string,
    first_name: string,
    last_name: string,
    company_name: string
    phone_number: string,
    line_1: string,
    line_2: string,
    city: string,
    postcode: string,
    county: string,
    country: string,
    instructions: string,
}

export interface Purchase {
  id: string,
  status: string,
  payment: string,
  meta: {
    timestamps: {
      created_at: string
    },
    display_price: {
      with_tax: {
        formatted: string
      }
    },
  },

}

export async function loadEnabledCurrencies(): Promise<Currency[]> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const response = await moltin.Currencies.All();

  return response.data.filter((c: Currency) => c.enabled);
}

export async function loadCategoryTree(): Promise<Category[]> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Categories.Tree();

  return result.data;
}

const productCache: { [id: string]: Product } = {};

function setProductCache(key: string, language: string, currency: string, product: Product) {
  productCache[`${key}:${language}:${currency}`] = product;
}

function getProductCache(key: string, language: string, currency: string): Product | undefined {
  return productCache[`${key}:${language}:${currency}`];
}

export async function loadCategoryProducts(categoryId: string, pageNum: number, language: string, currency: string): Promise<Paginated<Product>> {
  const moltin = MoltinGateway({ client_id: config.clientId, currency: currency });

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
    setProductCache(product.id, language, currency, product);
  }

  return {
    data: result.data,
    pagination,
  };
}

const imageHrefCache: { [key: string]: string } = {};

const imageMimeTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/jp2',
  'image/jxr',
];

// Loads a file with a provided id and returns its url if it's mime type is an image or undefined otherwise
export async function loadImageHref(imageId: string): Promise<string | undefined> {
  if (imageHrefCache[imageId]) {
    return imageHrefCache[imageId];
  }

  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Files.Get(imageId);

  if (imageMimeTypes.indexOf(result.data.mime_type) === -1) {
    return undefined;
  }

  imageHrefCache[imageId] = result.data.link.href;

  return result.data.link.href;
}

export async function loadProductBySlug(productSlug: string, language: string, currency: string): Promise<Product> {
  const cachedProduct = getProductCache(productSlug, language, currency);

  if (cachedProduct) {
    return cachedProduct;
  }

  const moltin = MoltinGateway({ client_id: config.clientId, currency: currency });

  const resultSlug = await moltin.Products
    .Limit(1)
    .Filter({
      eq: {
        slug: productSlug
      }
    })
    .All();

  const productId = resultSlug?.data[0]?.id;
  const result = await moltin.Products.Get(productId);
  const product = result.data;

  setProductCache(product.slug, language, currency, product);

  return product;
}

export async function register(name: string, email: string, password: string): Promise<Customer> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Create({
    type: 'customer',
    name,
    email,
    password
  });

  return data;
}

export async function login(email: string, password: string): Promise<CustomerToken> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Token(email, password);

  return data;
}

export async function getCustomer(id: string, token: any): Promise<Customer> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Customers.Get(id, token);

  return result;
}

export async function updateCustomer(id: string, name: string, email: string, token: string): Promise<Customer> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  // @ts-ignore
  const result = await moltin.Customers.Update(id, {type: 'customer', name, email, password: '',}, token);

  return result;
}

export async function getAddresses(customer: string, token: string): Promise<{ data: Address[] }> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Addresses.All({customer, token});

  return result;
}

export async function updateAddress(customer: string, address: string, body: any, token: string): Promise<{ data: Address[] }> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Addresses.Update(
{ customer, address, body, token }
  );

  return result;
}

export async function addNewAddress(customer: string, body: any, token: string): Promise<{ data: Address[] }> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Addresses.Create(
{ customer, body, token }
  );

  return result;
}

export async function deleteAddress(customer: string, address: any, token: string): Promise<{ data: Address[] }> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Addresses.Delete(
{ customer, address, token }
  );

  return result;
}

export async function getAllOrders(token: string): Promise<{ data: Purchase[] }> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Orders.Limit(100).All(token);
  return result;
}
