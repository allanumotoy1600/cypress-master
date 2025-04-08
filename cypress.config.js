// npx cypress run --record --key c9d6fd8a-320f-4bee-a6ac-81ebc5c6630c

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
