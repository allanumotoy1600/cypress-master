describe('Authentication & Add to Cart & Checkout', () => {
    // It will run before each test case (it block)
   /*if matagal mag run ang test
    * 1.possible na slow internet 
      2.mabagal ang test environment
      3. down yung Server (API, DB etc.)*/
   beforeEach(() => {
     cy.auth('standard_user', 'secret_sauce')
     
   });
 
   it('Should successfully login', () => {
     // Verify we're on the inventory page after login
     cy.url().should('include', '/inventory.html')
     cy.get('.inventory_list').should('be.visible')
     cy.takeScreenshot('Login-Success')
   });
 
   it('Should successfully add to cart', () => {
    cy.addtoCart()
    cy.takeScreenshot('AddtoCart-Success')
   });

   it('Should successfully checkout items', () => {
    cy.checkOut()
    cy.takeScreenshot('CheckOut-Success')
   })
 });  