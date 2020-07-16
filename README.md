<img src="https://www.elasticpath.com/themes/custom/bootstrap_sass/logo.svg" alt="" width="400" />

# REACT PWA Reference Storefront

[![Netlify Status](https://api.netlify.com/api/v1/badges/174a486c-d1d9-4c2c-8434-94c30708c07d/deploy-status)](https://app.netlify.com/sites/epcc-ref-store/deploys)
[![Stable Branch](https://img.shields.io/badge/stable%20branch-master-blue.svg)](https://github.com/elasticpath/epcc-react-pwa-reference-storefront)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/elasticpath/epcc-react-pwa-reference-storefront/issues)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![follow on Twitter](https://img.shields.io/twitter/follow/elasticpath?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=elasticpath)

## Overview 🚀

The Elastic Path Commerce Cloud REACT PWA Reference Storefront is a flexible e-commerce website built on Elastic Path’s RESTful e-commerce API. The storefront uses the e-commerce capabilities provided by Elastic Path Commerce Cloud and gets data in a RESTful manner.

The storefront uses the [Elastic Path Commerce Cloud JavaScript SDK](https://github.com/moltin/js-sdk) for all Elastic Path Commerce Cloud API requests, and [Elastic Path Commerce Cloud Embeddable Cart + Checkout](https://github.com/moltin/shopkit) for the Cart and Checkout experiences.

> 💳 Use the test card 4242 4242 4242 4242, any future expiry date, and any CVC below to checkout.

[Demo](https://epcc-reference.elasticpath.com/)

## Documentation 📖

### Prerequisites

Before you begin, ensure that you have the following accounts set up:

- [Elastic Path Commerce Cloud account](https://dashboard.elasticpath.com/login)
- [Stripe account](https://dashboard.stripe.com/) - Stripe is used as the payment gateway. From your [Dashboard](https://dashboard.elasticpath.com), configure Stripe as the payment gateway.
- [Algolia account](https://www.algolia.com/) - Algolia is used for search functionality to display search results, facets, and filtering.

### Start Building the Storefront

**Note**: If you are running a Windows environment, launch the Windows Subsystem for Linux application and perform the following steps from the console window.

```bash
# Clone the Git repository
git clone https://github.com/elasticpath/epcc-react-pwa-reference-storefront.git

# Go into the cloned directory
cd epcc-react-pwa-reference-storefront

# Install all the dependencies for all sub-project and create necessary symlinks in-between them
yarn

# Configure the ./src/config.ts file.
# For more information, see Configuration Parameter Descriptions.

# Start the app in development mode

# Run the main application:
yarn start

# Builds the app for production to the build folder:
yarn build
```

## Configuration Parameter Descriptions ⚙️

Parameters that require configuration are in the `./src/config.ts` file:

|  Parameter| Importance|Type|Description|
|--|--|--|--|
|`clientId`| Required| String| The Client ID of your store.|
|`stripeKey`| Required| String| Stripe publishable API key.|
|`categoryPageSize`| Required| String| Maximum number of products to display on a category page.|
|`maxCompareProducts`| Required| String| Maximum number of products to display in compare view.|
|`algoliaAppId`| Required| String| Algolia application identifier.|
|`algoliaApiKey`| Required| String| Algolia API key used to read records.|
|`algoliaIndexName`| Required| String| Name of Algolia index used for search functions.|

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dusanradovanovic"><img src="https://avatars3.githubusercontent.com/u/41649443?v=4" width="100px;" alt=""/><br /><sub><b>Dusan Radovanovic</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=dusanradovanovic" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/shaunmaharaj"><img src="https://avatars3.githubusercontent.com/u/39800563?v=4" width="100px;" alt=""/><br /><sub><b>Shaun Maharaj</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=shaunmaharaj" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/aChanEP"><img src="https://avatars3.githubusercontent.com/u/25829859?v=4" width="100px;" alt=""/><br /><sub><b>aChanEP</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=aChanEP" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rostyk-kanafotskyy"><img src="https://avatars3.githubusercontent.com/u/34774987?v=4" width="100px;" alt=""/><br /><sub><b>Rostyk</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=rostyk-kanafotskyy" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/petro97"><img src="https://avatars3.githubusercontent.com/u/34708483?v=4" width="100px;" alt=""/><br /><sub><b>Dubno Petro</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=petro97" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yulia-dnistrian"><img src="https://avatars3.githubusercontent.com/u/12392532?v=4" width="100px;" alt=""/><br /><sub><b>yulia-dnistrian</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=yulia-dnistrian" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/skarpyak"><img src="https://avatars3.githubusercontent.com/u/8594755?v=4" width="100px;" alt=""/><br /><sub><b>Sergii Karpiak</b></sub></a><br /><a href="https://github.com/elasticpath/epcc-react-pwa-reference-storefront/commits?author=skarpyak" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/BonnieEP"><img src="https://avatars3.githubusercontent.com/u/49495842?v=4" width="100px;" alt=""/><br /><sub><b>Bonnie Bishop</b></sub></a><br /><a href="https://ui-components.elasticpath.com" title="Design">🎨</td>
    <td align="center"><a href="https://github.com/JenSmith-EP"><img src="https://avatars3.githubusercontent.com/u/58435007?v=4" width="100px;" alt=""/><br /><sub><b>Jen Smith</b></sub></a><br /><a href="https://documentation.elasticpath.com/storefront-react" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Terms And Conditions

- Any changes to this project must be reviewed and approved by the repository owner. For more information about contributing, see the [Contribution Guide](https://github.com/elasticpath/epcc-react-pwa-reference-storefront/blob/master/.github/CONTRIBUTING.md).
- For more information about the license, see [GPLv3 License](https://github.com/elasticpath/epcc-react-pwa-reference-storefront/blob/master/LICENSE).
