/// <reference types ="cypress" />

describe('Automation Exercise - Test Cases [14,15,16]', () => {

    
        before(() => {
        cy.generateData()
    });

    beforeEach(() => {
        cy.visit('http://automationexercise.com');
        cy.url().should('include', 'automationexercise');
        cy.get('body').should('contain', 'Home');
      });
  
    it('Place Order: Register while Checkout', () => {
  
      cy.get('.features_items .product-image-wrapper').first().trigger('mouseover');
      cy.contains('Add to cart').click();
      cy.contains('Continue Shopping').click();

      cy.contains('a', ' Cart').as('cartBtn');
      cy.get('@cartBtn').click();
      cy.url().should('include', '/view_cart');
      cy.contains('Shopping Cart').should('be.visible');
  
      cy.contains('Proceed To Checkout').click();
  
      cy.get('u').contains('Register / Login').click();
      cy.RegAccEx();

      cy.VerifyUser();

      cy.contains('a', ' Cart').click();
  
      cy.contains('Proceed To Checkout').click();
      cy.get('.checkout-information').should('be.visible');
      cy.contains('Review Your Order').should('be.visible');
  
      cy.get('textarea[name="message"]').type('Please deliver between 9 AM and 5 PM.');
      cy.contains('Place Order').click();
      
      cy.CardSub();
      cy.contains('Order Placed!').should('be.visible');
  
      cy.contains('Delete Account').click();
      cy.contains('Account Deleted!').should('be.visible');
      cy.get('[data-qa="continue-button"]').click();
      cy.takeScreenshot('Test-Case[14]');

    });


    it('Place Order: Register before Checkout', () => {
    
        cy.contains('a', 'Signup / Login').click();
        cy.RegAccEx();
    
        cy.VerifyUser();
    
        cy.get('.features_items .product-image-wrapper').first().trigger('mouseover');
        cy.contains('Add to cart').click();
    
        cy.contains('View Cart').click();
    
        cy.url().should('include', '/view_cart');
        cy.contains('Shopping Cart').should('be.visible');
    
        cy.contains('Proceed To Checkout').click();
        cy.get('.checkout-information').should('be.visible');
        cy.contains('Review Your Order').should('be.visible');
    
        cy.get('textarea[name="message"]').type('Please handle with care.');
        cy.contains('Place Order').click();
    
        cy.CardSub();
        cy.contains('Order Placed!').should('be.visible');
    
        cy.contains('Delete Account').click();
        cy.contains('Account Deleted!').should('be.visible');
        cy.get('[data-qa="continue-button"]').click();
        cy.takeScreenshot('Test-Case[15]');

      });

      it('Place Order: Login before Checkout', () => {

        cy.contains('a', 'Signup / Login').click();
        cy.RegAccEx();
        cy.contains('a', 'Home').click();
        cy.contains('a', 'Logout').click();
    
        cy.url().should('include', 'automationexercise');
        cy.get('body').should('contain', 'Home');
    
        cy.contains('a', 'Signup / Login').click();
        cy.logExercise();
    
        cy.VerifyUser();
    
        cy.get('.features_items .product-image-wrapper').first().trigger('mouseover');
        cy.contains('Add to cart').click();
        cy.contains('Continue Shopping').click();
    
        cy.contains('a', ' Cart').click();
    
        cy.url().should('include', '/view_cart');
        cy.contains('Shopping Cart').should('be.visible');
    
        cy.contains('Proceed To Checkout').click();
        cy.get('.checkout-information').should('be.visible');
        cy.contains('Review Your Order').should('be.visible');
    
        cy.get('textarea[name="message"]').type('Deliver during working hours.');
        cy.contains('Place Order').click();

        cy.CardSub();
        cy.contains('Order Placed!').should('be.visible');

        cy.contains('Delete Account').click();
        cy.contains('Account Deleted!').should('be.visible');
        cy.get('[data-qa="continue-button"]').click();
        cy.takeScreenshot('Test-Case[16]');

      });
});
  