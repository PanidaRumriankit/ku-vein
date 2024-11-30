import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://ku-vein.vercel.app/",
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    waitForInitialPage: true,
    retries: {
      runMode: 2,
      openMode: 1
    }
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  },
  setupNodeEvents(on, config) {
    // implement node event listeners here
  },
});
