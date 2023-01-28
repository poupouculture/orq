# com.synque.waba (waba-quasar)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

## Application Design
### Content Management System
- login: https://waba.synque.ca/admin/login
this is where all data-models are created, designed, stored, and managed.
### Store


### Users

### Permissions
#### UI-access
- We use the "pages" collection located in our CMS: https://waba.synque.ca/admin/content/pages
- assign role to the page, e.g. as a manager, I can access UI: F07
- when logged in, the /users/me is called and the pages OBJECT is stored in userStore
- finally, the DrawerLayout.vue is built.
#### Pagination
- the flow like UI-access in the `DrawerLayout.vue` there are some menus integrated, the menus data called in `@/utils/page-codes.ts`
- in the `page-codes.ts` there are `id` and `icon`.
- `id` for user role e.g. as a manager, I can access UI: F07
- `icon` for icon of the menu
#### API-access
-


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```

## API
- use axios
- use GraphQL in later stage for better performance and cleaner code
  - e.g. APOLLO

### Build the app for production
```bash
quasar build
```
builds to:
```
distDir: ctx.mode.spa ? "public" : null,
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
# waba-quasar

# devops
cicd with vercel
package manager: use yarn, NOT npm

## tailwindcss
### References
```
https://tailwindcss.com/docs/installation/using-postcss
https://stackoverflow.com/questions/70034269/how-to-use-tailwind-css-with-quasar-framework
```

## Quasar notes
main.js replaced by boot files in Quasar
```
quasar new boot sentry --format ts

 App • Generated boot: src/boot/sentry.ts
 App • Make sure to reference it in quasar.config.js > boot
```

## Tracing Logging
```
import * as Sentry from "@sentry/vue";

## Configuration: Scaffold
```
Scaffold: [https://quasar.dev/start/quasar-cli](https://quasar.dev/start/quasar-cli)

✔ **What would you like to build?** › App with Quasar CLI, let's go!

✔ **Project folder:** … waba-quasar

✔ **Pick Quasar version:** › Quasar v2 (Vue 3 | latest and greatest)

✔ **Pick script type:** › Javascript

✔ **Pick Quasar App CLI variant:** › Quasar App CLI with Vite

✔ **Package name:** … waba-quasar

✔ **Project product name: (must start with letter if building mobile apps)** … com.synque.waba

✔ **Project description:** … A Quasar Project

✔ **Author:** … mac <mac@synque.io>

✔ **Pick your CSS preprocessor:** › Sass with SCSS syntax

✔ **Check the features needed for your project:** › ESLint, State Management (Pinia), Axios, Vue-i18n

✔ **Pick an ESLint preset:** › Standard

Quasar • Generating files...

- README.md

- .editorconfig

- .gitignore

- .npmrc

- jsconfig.json

- package.json

- index.html

- postcss.config.js

- quasar.config.js

- .vscode/extensions.json

- .vscode/settings.json

- public/favicon.ico

- src/App.vue

- public/icons/favicon-128x128.png

- public/icons/favicon-16x16.png

- public/icons/favicon-32x32.png

- public/icons/favicon-96x96.png

- src/assets/quasar-logo-vertical.svg

- src/boot/.gitkeep

- src/components/EssentialLink.vue

- src/layouts/MainLayout.vue

- src/pages/ErrorNotFound.vue

- src/pages/IndexPage.vue

- src/router/index.js

- src/router/routes.js

- src/css/app.scss

- src/css/quasar.variables.scss

- src/boot/axios.js

- src/boot/i18n.js

- src/i18n/index.js

- src/i18n/en-US/index.js

- .eslintignore

- .eslintrc.js

- src/stores/example-store.js

- src/stores/index.js

- src/stores/store-flag.d.ts

Quasar •  SUCCESS  • The project has been scaffolded

```


```
