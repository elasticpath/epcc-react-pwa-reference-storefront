
export const config = {
  clientId: process ? (process.env.REACT_APP_CLIENT_ID) : '1NgdZlkNCJ5miRkpQ0ly75HOZOFM0rKf2taUujquog',
  stripeKey: process ? (process.env.REACT_APP_STRIPE_KEY) : 'pk_test_JwRX4cevuCysIEQrpwcbn3j8',
  categoryPageSize: 8,
  maxCompareProducts: 4,
  algoliaAppId: process ? (process.env.REACT_APP_ALGOLIA_APP_ID) : '6MAFUOD23U',
  algoliaApiKey: process ? (process.env.REACT_APP_ALGOLIA_API_KEY) : '7d829396bbf202b30bfe7ad52120bbac',
  algoliaPlacesAppId: process ? (process.env.REACT_APP_ALGOLIA_PLACES_APP_ID) : 'plEPUZAA2D2L',
  algoliaPlacesApiKey: process ? (process.env.REACT_APP_ALGOLIA_PLACES_API_KEY) : '4c9f0832a65f800e31b0d50f44670b1f',
  algoliaIndexName: process ? (process.env.REACT_APP_ALGOLIA_INDEX_NAME) : 'product',
  compareKeys: process ? (process.env.REACT_APP_COMPARE_KEYS?.split(',')) : [],
  endpointURL: process ? (process.env.REACT_APP_ENDPOINT_URL) : 'api.moltin.com',
  b2b: process ? (process.env.REACT_APP_B2B_ENABLE) : false,
  supportedLocales: process ? (process.env.REACT_APP_SUPPORTED_LOCALES?.split(',').map(el => JSON.parse(el))) : [
    {
      "key": "en",
      "name": "english"
    },
    {
      "key": "fr",
      "name": "french"
    }
  ],
  defaultLanguage: process ? (process.env.REACT_APP_DEFAULT_LANGUAGE) : "en",
  defaultCurrency: process ? (process.env.REACT_APP_DEFAULT_CURRENCY) : "USD",
};
