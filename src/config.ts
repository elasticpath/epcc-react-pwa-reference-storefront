
export const config = {
  clientId: process.env.REACT_APP_CLIENT_ID || 'UM0zJIikYFqQlNuSxWGe8Pj0Lh0cmvOFb29kHHMbaz',
  stripeKey: process.env.REACT_APP_STRIPE_KEY || 'pk_test_JwRX4cevuCysIEQrpwcbn3j8',
  categoryPageSize: 8,
  maxCompareProducts: 4,
  algoliaAppId: process.env.REACT_APP_ALGOLIA_APP_ID || '2MQV38SF63',
  algoliaApiKey: process.env.REACT_APP_ALGOLIA_API_KEY || '9fcc9c2c97e03ebb7d4eb19297ad12e4',
  algoliaPlacesAppId: process.env.REACT_APP_ALGOLIA_PLACES_APP_ID || 'plEPUZAA2D2L',
  algoliaPlacesApiKey: process.env.REACT_APP_ALGOLIA_PLACES_API_KEY || '4c9f0832a65f800e31b0d50f44670b1f',
  algoliaIndexName: process.env.REACT_APP_ALGOLIA_INDEX_NAME || 'product',
  compareKeys: process.env.REACT_APP_COMPARE_KEYS?.split(',') || [],
  endpointURL: process.env.REACT_APP_ENDPOINT_URL || 'api.moltin.com',
  b2b: process.env.REACT_APP_B2B_ENABLE || false,
  supportedLocales: process.env.REACT_APP_SUPPORTED_LOCALES?.split(',').map(el => JSON.parse(el)) || [
    {
      "key": "en",
      "name": "english"
    },
    {
      "key": "fr",
      "name": "french"
    }
  ],
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE || "en",
  defaultCurrency: process.env.REACT_APP_DEFAULT_CURRENCY || "USD",
};
