// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('takeScreenshot', (prefix = '') => {
    // Create a timestamp for the screenshot name, excluding the time part
    const timestamp = new Date().toISOString().split('T')[0]; 
    const testName = Cypress.mocha.getRunner().suite.title + '-' + Cypress.mocha.getRunner().test.title;
    
    // Generate the screenshot name
    const screenshotName = `${prefix}-${testName}-${timestamp}`;
  
    // Define the custom path where the screenshot will be saved
    const screenshotPath = `/screenshots/${screenshotName}.png`; 
    
    // Take the screenshot and save it to the custom path
    cy.screenshot(screenshotPath); // 
  });
  


Cypress.Commands.add('auth', (username, password) => { // FUNCTION OR METHOD --> Then i-call natin sya sa spec or test file natin.
    cy.visit('https://www.saucedemo.com/', {timeout: 240000})
      cy.get('[data-test="username"]').type(username)
      cy.get('[data-test="password"]').type(password)
      cy.get('[data-test="login-button"]').click()
}); 

Cypress.Commands.add('addtoCart', () => { // FUNCTION OR METHOD --> Then i-call natin sya sa spec or test file natin.
    // Add first product to cart
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]')
    .should('be.visible')
    .click()

    // Verify cart badge appears with 1 item
    cy.get('.shopping_cart_badge').should('contain', '1')

    // Optionally, navigate to the cart and verify item is listed
    cy.get('.shopping_cart_link').click()
    cy.url().should('include', '/cart.html')
    cy.get('.cart_item').should('have.length', 1)
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack')
}); 

Cypress.Commands.add('checkOut', () => { // FUNCTION OR METHOD --> Then i-call natin sya sa spec or test file natin.
    //run addtoCart command
    cy.addtoCart()
    
    // Verify on the cart page
    cy.url().should('include', '/cart.html') 
    
    // Check that the cart is not empty
    cy.get('.cart_item').should('have.length.greaterThan', 0) 

    // Click the checkout button
    cy.get('[data-test="checkout"]').click() 

    // Verify we are on the checkout page
    cy.url().should('include', '/checkout-step-one.html') 
    
    // Verify that the page contains "Checkout: Your Information"
    cy.get('.title').should('contain', 'Checkout: Your Information') 

    // Fill in the checkout form (for example, entering a name, address, and postal code)
    cy.get('[data-test="firstName"]').type('John') 
    cy.get('[data-test="lastName"]').type('Doe') 
    cy.get('[data-test="postalCode"]').type('12345') 

    // Click the continue button
    cy.get('[data-test="continue"]').click() 

    // Verify the checkout overview page is displayed
    cy.url().should('include', '/checkout-step-two.html') 
    cy.get('.checkout_summary_container').should('be.visible') 

    // Optionally, you can also verify that the product is listed in the summary
    cy.get('.cart_item').should('have.length', 1) 
    cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack') 

    // Click the finish button to complete the checkout process
    cy.get('[data-test="finish"]').click() 

    // Verify we are on the order confirmation page
    cy.url().should('include', '/checkout-complete.html') 
    cy.get('.complete-header').should('contain', 'Thank you for your order!') // Verify the page contains the confirmation message
}); 
 
