/// <reference types ="cypress" />
import { generateTestData } from '../fixtures/FakerUtils';  // Adjust the path if necessary

 // ############################ GLOBAL - COMMANDS ########################################

Cypress.Commands.add('takeScreenshot', (prefix = '') => {
    // Create a timestamp for the screenshot name, excluding the time part
    const timestamp = new Date().toISOString().split('T')[0]; 
    const testName = Cypress.mocha.getRunner().suite.title + '-' + Cypress.mocha.getRunner().test.title;
    
    // Generate the screenshot name
    const screenshotName = `${prefix}-${testName}-${timestamp}`;
  
    // Define the custom path where the screenshot will be saved
    // const screenshotPath = `${screenshotName}.png`; 
    
    // Take the screenshot and save it to the custom path
    cy.screenshot(screenshotName); // 
  });

  Cypress.Commands.add('generateData' , () => {
    let testData = generateTestData()
    cy.writeFile('cypress/fixtures/testData.json', testData);
  });

  // Cypress.Commands.add('disableAnimations', () => {
  //   cy.document().then((doc) => {
  //     const style = doc.createElement('style');
  //     style.innerHTML = `
  //       * {
  //         animation: none !important;
  //         transition: none !important;
  //       }
  //     `;
  //     doc.head.appendChild(style);
  //   });
  // });

 // ############################ PARASOFT BANK - COMMANDS ###############################################################################

Cypress.Commands.add('formDetails', () => {

  cy.readFile('cypress/fixtures/testData.json').then((testData) => {
    cy.get('input[id="customer.firstName"]').type(testData.firstName)
    cy.get('input[id="customer.lastName"]').type(testData.lastName)
    cy.get('input[id="customer.address.street"]').type(testData.address)
    cy.get('input[id="customer.address.city"]').type(testData.city)
    cy.get('input[id="customer.address.state"]').type(testData.state)
    cy.get('input[id="customer.address.zipCode"]').type(testData.zip)
    cy.get('input[id="customer.phoneNumber"]').type(testData.phone)
    cy.get('input[id="customer.ssn"]').type(testData.ssn)
    cy.get('input[id="customer.username"]').type(testData.username)
    cy.get('input[id="customer.password"]').type(testData.password)
    cy.get('input[id="repeatedPassword"]').type(testData.password)
  });
});
Cypress.Commands.add('authDetails' , () => {

  cy.fixture('testData.json').then((testData) => {
    cy.get('input[name="username"]').type(testData.username)
    cy.get('input[name="password"]').type(testData.password)
    cy.get('input[value="Log In"]').click()
  });
});

 // ############################ SAUCE DEMO - COMMANDS ##################################################################################

Cypress.Commands.add('saveCart', () => {
  cy.window().then((win) => {
    const cart = win.localStorage.getItem('cart-contents') || '[]';
    Cypress.env('savedCart', cart);
  });
});

Cypress.Commands.add('restoreCart', () => {
  const cart = Cypress.env('savedCart') || '[]';
  cy.window().then((win) => {
    win.localStorage.setItem('cart-contents', cart);
  });
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
  cy.get('[data-test="shopping-cart-link"]').should('contain', '1')

  // Optionally, navigate to the cart and verify item is listed
  cy.get('[data-test="shopping-cart-link"]').click()
  cy.url().should('include', '/cart.html')
  cy.get('[data-test="inventory-item"]').should('have.length', 1)
  cy.get('[data-test="inventory-item-name"]').should('contain', 'Sauce Labs Backpack')
}); 

Cypress.Commands.add('checkOut', () => { // FUNCTION OR METHOD --> Then i-call natin sya sa spec or test file natin.
  //run addtoCart command
  cy.addtoCart()
  
  // Verify on the cart page
  cy.url().should('include', '/cart.html') 
  
  // Check that the cart is not empty
  cy.get('[data-test="inventory-item"]').should('have.length.greaterThan', 0) 

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
  cy.get('[data-test="checkout-summary-container"]').should('be.visible') 

  // Optionally, you can also verify that the product is listed in the summary
  cy.get('[data-test="inventory-item"]').should('have.length', 1) 
  cy.get('[data-test="inventory-item-name"]').should('contain', 'Sauce Labs Backpack') 

  // Click the finish button to complete the checkout process
  cy.get('[data-test="finish"]').click() 

  // Verify we are on the order confirmation page
  cy.url().should('include', '/checkout-complete.html') 
  cy.get('[data-test="complete-header"]').should('contain', 'Thank you for your order!') // Verify the page contains the confirmation message
}); 

 // ############################ AUTOMATION EXERCISE - COMMANDS ###############################################################################

 Cypress.Commands.add('authExercise' , () => {

  cy.fixture('testData.json').then((testData) => {
    cy.get('[data-qa="signup-name"]').type(testData.username)
    cy.get('[data-qa="signup-email"]').type(testData.email)
    cy.get('[data-qa="signup-button"]').click();
  });
});

Cypress.Commands.add('logExercise' , () => {

  cy.fixture('testData.json').then((testData) => {
    cy.get('[data-qa="login-email"]').type(testData.email)
    cy.get('[data-qa="login-password"]').type(testData.password)
    cy.get('[data-qa="login-button"]').click();
  });
});

Cypress.Commands.add('RegAccEx', () => {

  cy.authExercise();

  cy.readFile('cypress/fixtures/testData.json').then((userData) => {
    cy.get('#id_gender1').check();
    cy.get('#password').type(userData.password);
    cy.get('#days').select(userData.day);
    cy.get('#months').select(userData.month);
    cy.get('#years').select(userData.year);
    cy.get('#first_name').type(userData.firstName);
    cy.get('#last_name').type(userData.lastName);
    cy.get('#address1').type(userData.address);
    cy.get('#country').select(userData.country);
    cy.get('#state').type(userData.state);
    cy.get('#city').type(userData.city);
    cy.get('#zipcode').type(userData.zip);
    cy.get('#mobile_number').type(userData.phone);
    cy.get('[data-qa="create-account"]').click();


    cy.contains('Account Created!').should('be.visible');
    cy.get('[data-qa="continue-button"]').click();
    
  });
});

Cypress.Commands.add('CardDetails', () => {

  cy.readFile('cypress/fixtures/testData.json').then((userData) => {
    cy.get('[name="name_on_card"]').type(`${userData.firstName} ${userData.lastName}`);
    cy.get('[name="card_number"]').type(userData.card);
    cy.get('[name="cvc"]').type(userData.cvc);
    cy.get('[name="expiry_month"]').type(userData.expMonth);
    cy.get('[name="expiry_year"]').type(userData.expYear);
  });
});

Cypress.Commands.add('VerifyUser', () => {

  cy.readFile('cypress/fixtures/testData.json').then((userData) => {
    cy.contains(`Logged in as ${userData.firstName}`).should('be.visible');
    });
});

Cypress.Commands.add('CardSub', () => {

  cy.get('form#payment-form').then(($form) => {
    const rawForm = $form[0];
    rawForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent the first submission only
    }, { once: true }); // This makes it fire only ONCE
  });

  cy.CardDetails(); 
  cy.contains('Pay and Confirm Order').click();
  cy.contains('Your order has been placed successfully!').should('be.visible');
  cy.contains('Pay and Confirm Order').click();
});

