import { faker } from '@faker-js/faker';  // Import Faker.js


export const generateTestData = () => {

    let userNameString = faker.person.firstName();
    let userNameNumeric = faker.string.numeric(4);
    let userName = userNameString + userNameNumeric;
    let expiryMonth = faker.number.int({ min: 1, max: 12 });
    let paddedMonth = String(expiryMonth).padStart(2, '0');

    return {
      
      firstName: userNameString,
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.string.numeric(11),
      ssn: faker.string.numeric(9), 
      username: userName,
      password: faker.internet.password(),
      confirmPassword: faker.internet.password(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country : `Australia`,
      card: faker.string.numeric(16),
      cvc: faker.string.numeric(3),
      expMonth: paddedMonth,
      expYear : faker.number.int({min: 1990, max: 2050}),
      day : faker.number.int({ min: 1, max: 31 }),
      month : faker.date.month(),
      year: String(faker.number.int({ min: 1900, max: 2021 })),
    };
  };