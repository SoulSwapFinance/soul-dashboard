# Soul DeFi Wallet

JavaScript and Vue based Fantom pwa wallet.

We are using:
* Node / NPM
* ES2015 (and beyond) support.
* Vue.js
* Vue Router for routing
* Vuex for global state management
* SCSS

## Project setup

We use `npm` to handle dependencies.

```shell
npm install
```

### Hot Build

The `npm` script can be used to serve default implementation.

```shell
npm run serve
```

### Production Build

```shell
npm run build
```

### Chrome Extension Build

```shell

npm run build:chrome-extension:background-js
npm run build:chrome-extension:app
# output is in chrome-extension/dist
```

## Localization

Translations for views and components are located in `src/locales` directory.

