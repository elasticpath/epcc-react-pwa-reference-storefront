import * as moltin from '@moltin/sdk';
import { config } from './config';

const MoltinGateway = moltin.gateway;


export interface Weight {
  g: number,
  kg: number,
  lb: number,
  oz: number,
}

export interface Product extends moltin.ProductBase {
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
// May need to pass into the function the clientID
export async function loadCustomerAuthenticationSettings(): Promise<any> {
  // TODO: return the options in the authentication options...
  // This should be moved into the SDK eventually... for now we will just make the request
  // Outside of the SDK to simplify things.
  const moltin = MoltinGateway({ client_id: config.clientId });
  return moltin.AuthenticationSettings.Get()
}


// HAX - This is going to be part of the SDK eventually.
export function loadAuthenticationProfiles(realm: string, storeId: string): any {
  // TODO: Replace this with the SDK!
  const moltin = MoltinGateway({ client_id: config.clientId });
  return moltin.AuthenticationProfiles.All('19e7a80d-d5f9-48c6-916d-58e7c6f62311')
}

export function getAuthenticationProfile(realmId: string, profileId: string) {
  // Get the authentication profile
  const moltin = MoltinGateway({ client_id: config.clientId });
  return moltin.AuthenticationProfiles.Get({
      realmId,
      profileId
    }
  )
}

export async function loadEnabledCurrencies(): Promise<moltin.CurrencyBase[]> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const response = await moltin.Currencies.All();

  return response.data.filter(c => c.enabled);
}

export async function loadCategoryTree(): Promise<moltin.CategoryBase[]> {
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

export async function loadCategoryProducts(categoryId: string, pageNum: number, language: string, currency: string): Promise<moltin.ResourcePage<Product>> {
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
    .All<Product>();

  for (const product of result.data) {
    setProductCache(product.id, language, currency, product);
  }

  return result;
}

const imageHrefCache: { [key: string]: string } = {};

const imageMimeTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/gif',
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

  const result = await moltin.Products
    .Limit(1)
    .Filter({
      eq: {
        slug: productSlug
      }
    })
    .All<Product>();

  const product = result.data[0];
  setProductCache(product.slug, language, currency, product);

  return product;
}

export async function register(name: string, email: string, password: string): Promise<moltin.CustomerBase> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Create({
    type: 'customer',
    name,
    email,
    password
  });

  return data;
}

export async function login(email: string, password: string): Promise<moltin.CustomerToken> {
  console.log('logging in with Moltin Gateway!');
  
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Token(email, password).then();

  return data;
}

export async function oidcLogin(code: string) {
  // This is the authorization code that is going to do the logging in...
  return new Promise((res, rej)=>{
    setTimeout(()=>{
      res({
          "data": {
              "type": "token",
              "id": "6567fa1c-7a21-4153-89fd-c05f272f4532",
              "customer_id": "0408bdb2-91a4-481b-ba73-ff4ec0c8f667",
              "token": "eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiIwNDA4YmRiMi05MWE0LTQ4MWItYmE3My1mZjRlYzBjOGY2NjciLCJuYW1lIjoiVGVzdCIsImV4cCI6MTU5NTAxNTA1MywiaWF0IjoxNTk0OTI4NjUzLCJqdGkiOiI5NDk0MGRiNC1kNDVjLTRiMWMtOTM0Yi1mODk5MzExYmE4YjYifQ==.bbb1ac80fdeedf3c848cf97d170232d90c50d06208d34ce39e6222fcb925ff43",
              "expires": 1594913825
          }
      });
    }, 5)
  })
}

export async function getCustomer(id: string, token: string): Promise<moltin.CustomerBase> {

  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Get(id, token);

  return data;
}
