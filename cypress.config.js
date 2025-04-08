// npx cypress run --record --key c9d6fd8a-320f-4bee-a6ac-81ebc5c6630c
// npx cypress run --record --key c9d6fd8a-320f-4bee-a6ac-81ebc5c6630c

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "dg7adv",
  experimentalStudio: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Regression testing',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
    },
  },
});
