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

// HAX - For now this can just be a non async function...
export function loadCustomerAuthenticationSettings(): object {
  // TODO: return the options in the authentication options...
  // This should be moved into the SDK eventually... for now we will just make the request
  // Outside of the SDK to simplify things.

  
  return {
    "data": {
      "type": "customer-authentication-settings",
      "allow_password_authentication": true,
      "links": {
        "self": "https://api.moltin.com/v2/customer-authentication-settings"
      },
      "relationships": {
          "authentication-realms": {
              "data": [
                  {
                      "type": "authentication-realm",
                      "id": "369ad4a4-ee67-48b0-x347-t50a6e61d83d",
                      "links": [
                          {"self": "https://api.moltin.com/v2/authentication-realm/{id}"},
                      ],
                  }
                ]
          }
      },
      "meta": {
          "clientId": "steveisthebest"
      }
    }
  }
}

// HAX - This is going to be part of the SDK eventually.
export function loadAuthenticationProfiles(): object {
  
  return {
    "data": [
        {
          "type": "Okta",
          "id": "369ad4a4-ee67-48b0-x347-t50a6e61d83d",
          "client_id": "foo",
            "links": [{
                "client-discovery-url": "MT-2741",
                "server-discovery-url": "tbd"
            }
            ]
        },
        {
          "type": "Keycloak",
          "id": "369ad4a4-ee67-48b0-x347-t50a6e61d83d",
          "...": {
          }
        }
      ]
    }
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

export async function loadProductBySlug(productSlug: string, language: string, currency: string): Promise<Product> {
  const cachedProduct = getProductCache(productSlug, language, currency);

  if (cachedProduct) {
    return cachedProduct;
  }

  const moltin = MoltinGateway({ client_id: config.clientId, currency: currency });

  const result = await moltin.Products
    .Limit(1)
    .Filter({
      eq: {
        slug: productSlug
      }
    })
    .All();

  const product = result.data[0];
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
  const { data } = await moltin.Customers.Token(email, password).then();

  return data;
}

export async function getCustomer(id: string, token: string): Promise<Customer> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Customers.Get(id, token);

  return result;
}
