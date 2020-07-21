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
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Token(email, password).then();

  return data;
}

export async function getCustomer(id: string, token: string): Promise<moltin.CustomerBase> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const { data } = await moltin.Customers.Get(id, token);

  return data;
}
