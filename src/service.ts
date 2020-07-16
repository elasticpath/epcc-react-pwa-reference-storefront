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
// May need to pass into the function the clientID
export async function loadCustomerAuthenticationSettings(): Promise<any> {
  // TODO: return the options in the authentication options...
  // This should be moved into the SDK eventually... for now we will just make the request
  // Outside of the SDK to simplify things.

  return new Promise((res:any) => {
    setTimeout(()=>{
      res({
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
              "clientId": "epcc-reference-store"
          }
        }
      })
    }, 100);
  });
}


// HAX - This is going to be part of the SDK eventually.
export function loadAuthenticationProfiles(realm: string, storeId: string): Promise<any> {
  return new Promise((res:any) => {
    setTimeout(()=>{
      res({
        // We also need to add the meta value...
        "data": [
          {
            "name": "Auth0",
            "id": "369ad4a4-ee67-48b0-x347-t50a6e61d83d",
            "client_id": "foo",
              "links": [{
                  "client-discovery-url": "https://accounts.google.com/.well-known/openid-configuration",
                  "server-discovery-url": "tbd"
              }
              ]
          },
          {
            "name": "Keycloak",
            "id": "369ad4a4-ee67-48b0-x347-t50a6e61d83d",
            "client_id": "epcc-reference-store",
            "meta": {
              "created_at": "2020-07-16T17:29:28.735Z",
              "updated_at": "2020-07-16T17:29:28.735Z",
              "discovery_document": {
                  "issuer": "http://localhost:24074/auth/realms/Sample",
                  "authorization_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/auth",
                  "token_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/token",
                  "token_introspection_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/token/introspect",
                  "userinfo_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/userinfo",
                  "end_session_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/logout",
                  "jwks_uri": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/certs",
                  "check_session_iframe": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/login-status-iframe.html",
                  "grant_types_supported": [
                      "authorization_code",
                      "implicit",
                      "refresh_token",
                      "password",
                      "client_credentials"
                  ],
                  "response_types_supported": [
                      "code",
                      "none",
                      "id_token",
                      "token",
                      "id_token token",
                      "code id_token",
                      "code token",
                      "code id_token token"
                  ],
                  "subject_types_supported": [
                      "public",
                      "pairwise"
                  ],
                  "id_token_signing_alg_values_supported": [
                      "PS384",
                      "ES384",
                      "RS384",
                      "HS256",
                      "HS512",
                      "ES256",
                      "RS256",
                      "HS384",
                      "ES512",
                      "PS256",
                      "PS512",
                      "RS512"
                  ],
                  "id_token_encryption_alg_values_supported": [
                      "RSA-OAEP",
                      "RSA1_5"
                  ],
                  "id_token_encryption_enc_values_supported": [
                      "A128GCM",
                      "A128CBC-HS256"
                  ],
                  "userinfo_signing_alg_values_supported": [
                      "PS384",
                      "ES384",
                      "RS384",
                      "HS256",
                      "HS512",
                      "ES256",
                      "RS256",
                      "HS384",
                      "ES512",
                      "PS256",
                      "PS512",
                      "RS512",
                      "none"
                  ],
                  "request_object_signing_alg_values_supported": [
                      "PS384",
                      "ES384",
                      "RS384",
                      "ES256",
                      "RS256",
                      "ES512",
                      "PS256",
                      "PS512",
                      "RS512",
                      "none"
                  ],
                  "response_modes_supported": [
                      "query",
                      "fragment",
                      "form_post"
                  ],
                  "registration_endpoint": "http://localhost:24074/auth/realms/Sample/clients-registrations/openid-connect",
                  "token_endpoint_auth_methods_supported": [
                      "private_key_jwt",
                      "client_secret_basic",
                      "client_secret_post",
                      "client_secret_jwt"
                  ],
                  "token_endpoint_auth_signing_alg_values_supported": [
                      "RS256"
                  ],
                  "claims_supported": [
                      "aud",
                      "sub",
                      "iss",
                      "auth_time",
                      "name",
                      "given_name",
                      "family_name",
                      "preferred_username",
                      "email"
                  ],
                  "claim_types_supported": [
                      "normal"
                  ],
                  "claims_parameter_supported": false,
                  "scopes_supported": [
                      "openid",
                      "address",
                      "email",
                      "microprofile-jwt",
                      "offline_access",
                      "phone",
                      "profile",
                      "roles",
                      "web-origins"
                  ],
                  "request_parameter_supported": true,
                  "request_uri_parameter_supported": true,
                  "code_challenge_methods_supported": [
                      "plain",
                      "S256"
                  ],
                  "tls_client_certificate_bound_access_tokens": true,
                  "introspection_endpoint": "http://localhost:24074/auth/realms/Sample/protocol/openid-connect/token/introspect"
              }
          },
            "links": [{
              "client-discovery-url": "https://accounts.google.com/.well-known/openid-configuration",
              "server-discovery-url": "local"
            }]
          }
        ]
      });
    }, 100);
  });
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

export async function getCustomer(id: string, token: string): Promise<Customer> {
  const moltin = MoltinGateway({ client_id: config.clientId });
  const result = await moltin.Customers.Get(id, token);

  return result;
}
