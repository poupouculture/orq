import { boot } from "quasar/wrappers";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  Sentry.init({
    app,
    dsn: process.env.SENTRY_DSN,
    environment: process.env.MODE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        // tracePropagationTargets: [
        //   "localhost",
        //   "waba.synque.ca",
        //   "waba-dev.synque.ca",
        //   "ang-dev.synque.ca",
        //   "angliss-chaq-dev.synque.ca",
        //   /^\//,
        // ],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
});
