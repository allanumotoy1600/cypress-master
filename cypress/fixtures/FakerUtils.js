import { faker } from '@faker-js/faker';  // Import Faker.js


export const generateTestData = () => {

    let userNameString = faker.person.firstName()
    let userNameNumeric = faker.string.numeric(4)
    let userName = userNameString + userNameNumeric;

    return {
      firstName: userNameString,
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.string.numeric(11),
      ssn: faker.string.numeric(9), // Example SSN as UUID
      username: userName,
      password: faker.internet.password(),
      confirmPassword: faker.internet.password(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode()
    };
  };