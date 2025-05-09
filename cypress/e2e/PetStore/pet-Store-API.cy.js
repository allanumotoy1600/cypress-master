/// <reference types ="cypress" />


let petId;
let updatedPet;
let pet; // Shared variable to store the pet ID

describe('Pet API Tests', () => {

    before(() => {
        // Generate a pet using the custom command
        cy.generatePet().then((generatedPet) => {
          pet = generatedPet; // Store the generated pet
          cy.api({
            method: 'POST',
            url: '/pet',
            body: pet,
          }).then((response) => {
            expect(response.status).to.eq(200);
            petId = response.body.id; // Store the pet ID for later use
            pet.id = petId; // Update the pet object with the ID
          });
        });
      });
    
      after(() => {
        // Delete the pet after tests
        cy.api({
          method: 'DELETE',
          url: `/pet/${petId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });

  it('PUT - Update an existing pet', () => {
    cy.wrap(petId).should('exist'); // Ensure petId exists

    // Update the pet's name and status
    updatedPet = { ...pet, name: `${pet.name} Updated`, status: 'sold' };

    cy.api({
      method: 'PUT',
      url: '/pet',
      body: updatedPet,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', petId);
      expect(response.body).to.have.property('name', updatedPet.name);
      expect(response.body).to.have.property('status', updatedPet.status);
    });
});

  it('GET - Find pet by status', () => {
    const status = 'sold'; // Status to search for

    cy.api({
      method: 'GET',
      url: `/pet/findByStatus?status=${status}`,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
      expect(response.body).to.be.an('array'); // Ensure the response is an array
      expect(response.body.length).to.be.greaterThan(0); // Ensure at least one pet is returned

    //   // Validate that all returned pets have the correct status
    //   const foundPet = response.body.find((p) => p.id === petId);
    //   expect(foundPet).to.not.be.undefined; // Ensure the pet is found
    //   expect(foundPet).to.have.property('status', status); // Validate the status
    });
  });


  it('GET - Find pet by ID', () => {
    cy.wrap(petId).should('exist'); // Ensure petId exists

    cy.waitUntil(
      () =>
        cy.api({
          method: 'GET',
          url: `/pet/${petId}`,
        }).should((response) => {
          expect(response.status).to.eq(200);
          return response.body.name === updatedPet.name; // Validate the updated name
        }),
      {
        timeout: 10000,
        interval: 1000,
      }
    );

    // cy.api({
    //   method: 'GET',
    //   url: `/pet/${petId}`,
    // }).should((response) => {
    //   expect(response.status).to.eq(200);
    //   expect(response.body).to.have.property('id', petId);
    //   expect(response.body).to.have.property('name', updatedPet.name); // Validate the updated name
    // });
  });

  it('GET - Ensure no sensitive data is exposed', () => {
    cy.wrap(petId).should('exist')

    cy.api({
      method: 'GET',
      url: `/pet/${petId}`,
    }).should((response) => {
      expect(response.body).to.not.have.property('bearer-token')
      expect(response.body).to.not.have.property('access-token')
      expect(response.body).to.not.have.property('jwt-token')
      expect(response.body).to.not.have.property('password')
      expect(response.body).to.not.have.property('api_key')
    });
  });
});

describe('Store API Tests ' , () => {
    let orderId; // Variable to store the order ID

    it('GET - returns pet inventories by status', () => {
      cy.api({
        method: 'GET',
        url: '/store/inventory',
      }).then((response) => {
        expect(response.status).to.eq(200); // Validate status code
        expect(response.body).to.be.an('object'); // Ensure the response is an object
        expect(response.body).to.have.property('available'); // Check for a specific status
      });
    });
  
    it('POST - place an order for pet', () => {
        cy.generatePet().then((pet) => {
            cy.generateOrder(pet.id).then((order) => {
              cy.api({
                method: 'POST',
                url: '/store/order',
                body: order,
              }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id'); // Ensure the response contains an order ID
                orderId = response.body.id; // Assign the order ID to the shared variable
              });
            });
        });
    });

    it('POST - place an order for pet with invalid input', () => {
        const invalidOrder = {
          id: 1, // Invalid ID (string instead of number)
          petId: 12345, // Invalid petId (null instead of number)
          status: 'placed', // Invalid status (not a valid enum value)
        };
      
        cy.api({
          method: 'POST',
          url: '/store/order/%',
          body: invalidOrder,
          failOnStatusCode: false, // Prevent Cypress from failing the test on non-2xx status codes
        }).then((response) => {
          expect(response.status).to.eq(400); // Validate that the response status is 400
        });
      });
  
    it('GET - find purchase order by ID', () => {
      cy.wrap(orderId).should('exist'); // Ensure orderId exists
  
      cy.api({
        method: 'GET',
        url: `/store/order/${orderId}`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Validate status code
        expect(response.body).to.have.property('id', orderId); // Validate response body
      });
    });

    it('GET - purchase order with invalid ID', () => {
        cy.wrap(orderId).should('exist'); // Ensure orderId exists
    
        cy.api({
          method: 'GET',
          url: `/store/order/${orderId}/%`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400); // Validate status code
        });
      });

      it('GET - purchase order with non-existing ID', () => {
        let nonOrderID = 'AAAA';
    
        cy.api({
          method: 'GET',
          url: `/store/order/${nonOrderID}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404); // Validate status code
        });
      });
  
    it('DELETE - delete purchase order by ID', () => {
      cy.wrap(orderId).should('exist'); // Ensure orderId exists
  
      cy.api({
        method: 'DELETE',
        url: `/store/order/${orderId}`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Validate status code
      });
  
      // Verify the order no longer exists
      cy.api({
        method: 'GET',
        url: `/store/order/${orderId}`,
        failOnStatusCode: false, // Prevent test failure on 404
      }).then((response) => {
        expect(response.status).to.eq(404); // Validate that the order is not found
      });
    });


});


describe('User API Tests', () => {
    let userPayload; // Variable to store user data
    let username; // Variable to store the username
    const createdUsers = []; // Array to store created users for cleanup
  
    before(() => {
      // Generate a user and save it to user-Data.json
      cy.generateUser().then((user) => {
        username = user.username; // Store the username for later use
        createdUsers.push(username); // Add the username to the cleanup list
        cy.api({
          method: 'POST',
          url: '/user',
          body: user,
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
  
      // Load the user data from the fixture
      cy.fixture('user-Data.json').then((user) => {
        userPayload = user; // Assign the user data to the variable
        username = user.username; // Assign the username
      });
    });
  
    after(() => {
        cy.api({
          method: 'DELETE',
          url: `/user/${username}`, 
        }).then((response) => {
          expect(response.status).to.eq(200); // Validate status code
        });
    });

  it('GET - Get user by username', () => {
    cy.api({
      method: 'GET',
      url: `/user/${username}`,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
      expect(response.body).to.have.property('username', username); // Validate username
      expect(response.body).to.have.property('email', userPayload.email); // Validate email
    });
  });

  it('PUT - Update user', () => {
    const updatedUserPayload = { ...userPayload, firstName: 'Updated', lastName: 'User' };

    cy.api({
      method: 'PUT',
      url: `/user/${username}`,
      body: updatedUserPayload,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
      expect(response.body).to.have.property('message', userPayload.id.toString()); // Validate response message
    });

    // Verify the update
    cy.api({
      method: 'GET',
      url: `/user/${username}`,
    }).then((response) => {
      expect(response.body).to.have.property('firstName', 'Updated'); // Validate updated first name
      expect(response.body).to.have.property('lastName', 'User'); // Validate updated last name
    });
  });

  it('PUT - Update non-existing user (404 response)', () => {
  const nonExistingUsername = '/'; // Username that does not exist
  const updatedUserPayload = {
    id: 999999 , // Random ID
    username: nonExistingUsername,
    firstName: 'NonExisting',
    lastName: 'User',
    email: 'nonexistinguser@example.com',
    password: 'password123',
    phone: '123-456-7890',
    userStatus: 1,
  };

  cy.api({
    method: 'PUT',
    url: `/user/${nonExistingUsername}`,
    body: updatedUserPayload,
    failOnStatusCode: false, // Prevent Cypress from failing the test on non-2xx status codes
  }).then((response) => {
    expect(response.status).to.eq(404); // Validate that the response status is 404
  });
});

it('PUT - Invalid User supplied (400 response)', () => {
    const nonExistingUsername = '%'; // Username that does not exist
    const updatedUserPayload = {
      id: 999999 , // Random ID
      username: nonExistingUsername,
      firstName: 'NonExisting',
      lastName: 'User',
      email: 'nonexistinguser@example.com',
      password: 'password123',
      phone: '123-456-7890',
      userStatus: 1,
    };
  
    cy.api({
      method: 'PUT',
      url: `/user/${nonExistingUsername}`,
      body: updatedUserPayload,
      failOnStatusCode: false, // Prevent Cypress from failing the test on non-2xx status codes
    }).then((response) => {
      expect(response.status).to.eq(400); // Validate that the response status is 404
    });
  });


  it('GET - Logs user into the system', () => {
    cy.api({
      method: 'GET',
      url: `/user/login?username=${username}&password=${userPayload.password}`,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
      expect(response.body).to.have.property('message').and.include('logged in'); // Validate login message
    });
  });

  it('GET - Logs out current logged in user session', () => {
    cy.api({
      method: 'GET',
      url: '/user/logout',
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
    });
  });

  it('POST -  Creates list of users with given input array', () => {
    const users = [
      { ...userPayload, username: 'user1', id: 2 },
      { ...userPayload, username: 'user2', id: 3 },
    ];

    users.forEach((user) => createdUsers.push(user.username)); // Add users to the cleanup list
    cy.api({
      method: 'POST',
      url: '/user/createWithArray',
      body: users,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
    });

    // Verify the users were created
    users.forEach((user) => {
      cy.api({
        method: 'GET',
        url: `/user/${user.username}`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Validate status code
        expect(response.body).to.have.property('username', user.username); // Validate username
      });
    });
  });

  it('POST -  Creates list of users with given input list', () => {
    const users = [
      { ...userPayload, username: 'user1', id: 2 },
      { ...userPayload, username: 'user2', id: 3 },
    ];

    users.forEach((user) => createdUsers.push(user.username)); // Add users to the cleanup list
    cy.api({
      method: 'POST',
      url: '/user/createWithList',
      body: users,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validate status code
    });

    // Verify the users were created
    users.forEach((user) => {
      cy.api({
        method: 'GET',
        url: `/user/${user.username}`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Validate status code
        expect(response.body).to.have.property('username', user.username); // Validate username
      });
    });
  });
});

