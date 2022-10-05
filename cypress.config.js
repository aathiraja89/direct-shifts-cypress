const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  trashAssetsBeforeRuns: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {},
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: false,
    json: true,
    quiet: true,
  },
  appversion: 'v1',
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  env: {
    http_proxy: "https://staging.directshifts.com"
  }
});
