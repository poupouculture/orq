import { boot } from 'quasar/wrappers'
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  Sentry.init({
    app,
    dsn: "https://cc6b3dc603fa4b6f92be16cfef81891b@o4504232171536384.ingest.sentry.io/4504466750242816",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracePropagationTargets: ["localhost", "my-site-url.com", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
})
