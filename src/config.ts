
export const config = {
  clientId: process.env.REACT_APP_CLIENT_ID || '1NgdZlkNCJ5miRkpQ0ly75HOZOFM0rKf2taUujquog',
  stripeKey: process.env.REACT_APP_STRIPE_KEY || 'pk_test_JwRX4cevuCysIEQrpwcbn3j8',
  categoryPageSize: 8,
  maxCompareProducts: 4,
  algoliaAppId: process.env.REACT_APP_ALGOLIA_APP_ID || '6MAFUOD23U',
  algoliaApiKey: process.env.REACT_APP_ALGOLIA_API_KEY || '7d829396bbf202b30bfe7ad52120bbac',
  algoliaPlacesAppId: process.env.REACT_APP_ALGOLIA_PLACES_APP_ID || 'plEPUZAA2D2L',
  algoliaPlacesApiKey: process.env.REACT_APP_ALGOLIA_PLACES_API_KEY || '4c9f0832a65f800e31b0d50f44670b1f',
  algoliaIndexName: process.env.REACT_APP_ALGOLIA_INDEX_NAME || 'product',
  compareKeys: process.env.REACT_APP_COMPARE_KEYS?.split(',') || [],
  endpointURL: process.env.REACT_APP_ENDPOINT_URL || 'api.moltin.com',
};
