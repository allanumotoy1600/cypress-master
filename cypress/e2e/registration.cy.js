/// <reference types ="cypress" />


describe ('Registration Feature - ParasoftBank', () => {

    before(() => {
        cy.generateData()
    });


    beforeEach(() => {
        cy.visit('https://parabank.parasoft.com/parabank/register.htm')
    });

    it('should verify url page', () => {
        cy.url().should('include', '/register')
    });

    // it('Should fill up form', () => {
    //     cy.formDetails()
    // });

    it('should successfully register account', () => {
        // cy.generateData()
        cy.formDetails()
    });

    it('should show an error message for empty required fields', () => {
        cy.get('input[value="Register"]').click();
        cy.get('span[class="error"]').should('contain', 'required');
      });~

      it('should show an error for passwords that do not match', () => {
        const password = 'Password123!';
        const confirmPassword = 'Password12345!'; // Different from password
    
        cy.get('input[id="customer.password"]').type(password)
        cy.get('input[id="repeatedPassword"]').type(confirmPassword)
        cy.get('input[value="Register"]').should('be.visible').click();
        cy.get('span[class="error"]').should('contain', 'Passwords did not match.');
      });

      it('should successfuly login', () => {
        cy.authDetails()
        cy.url().should('contain', 'overview.htm')
        cy.contains('Welcome').should('be.visible')
      });

      it('should successfuly logout', () => {
        cy.authDetails()
        cy.url().should('contain', 'overview.htm')
        cy.contains('Welcome').should('be.visible')
        cy.contains('Log Out').should('be.visible').click()
        cy.url().should('contain', 'index.htm')
      });
});