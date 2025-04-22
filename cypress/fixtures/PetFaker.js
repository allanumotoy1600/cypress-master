import { faker } from '@faker-js/faker'; // Import Faker.js

// Function to generate a fake pet
export function generateFakePet() {
  return {
    id: faker.number.int({ min: 10000, max: 99999 }), // Random 5-digit numerical ID
    name: faker.animal.dog(), // Random dog name
    status: faker.helpers.arrayElement(['available', 'pending', 'sold']), // Random status
  };
}

// Function to generate a fake user
export function generateFakeUser() {
    let userNameString = faker.person.firstName();
    let userNameNumeric = faker.string.numeric(4);
    let userName = userNameString + userNameNumeric;

  return {
    id: faker.number.int({ min: 1, max: 1000 }), // Random user ID
    username: userName, // Random username
    firstName: userNameString, // Random first name
    lastName: faker.person.lastName(), // Random last name
    email: faker.internet.email(), // Random email
    password: faker.internet.password(), // Random password
    phone: faker.phone.number(), // Random phone number
    userStatus: faker.helpers.arrayElement([0, 1]), // Random user status (0 or 1)
  };
}

// Function to generate a fake order
export function generateFakeOrder(petId) {
  return {
    id: faker.number.int({ min: 1, max: 1000 }), // Random order ID
    petId: petId || faker.number.int({ min: 10000, max: 99999 }), // Use provided petId or generate a random one
    quantity: faker.number.int({ min: 1, max: 10 }), // Random quantity
    shipDate: faker.date.future().toISOString(), // Random future date
    status: faker.helpers.arrayElement(['placed', 'approved', 'delivered']), // Random status
    complete: faker.datatype.boolean(), // Random boolean
  };
}