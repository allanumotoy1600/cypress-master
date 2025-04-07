describe('Login Testing', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/'); // Runs before every test
  });


  it('title/logo validation', () => {
    cy.get(".login_logo").should("contain","Swag Labs")
  })


  it('valid credentials login' , () => {
    // login
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()

    // homepage
    cy.contains('Swag Labs').should('be.visible')
    cy.url().should('contains','inventory')
  })

  it('invalid password login', () => {
    //login
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('wrong_password')
    cy.get('[data-test="login-button"]').click()

    //assertions for message 
    cy.get('[data-test="error"]').should('be.visible').and('contain','Epic sadface')
  })

  it('invalid username login', () => {
    //login
    cy.get('[data-test="username"]').type('wrong_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()

    //assertions for message 
    cy.get('[data-test="error"]').should('be.visible').and('contain','Epic sadface')
  })

})

