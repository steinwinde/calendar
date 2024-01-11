const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    moduleNameMapper: {
        '^@salesforce/i18n/firstDayOfWeek$': '<rootDir>/force-app/test/jest-mocks/i18n/firstDayOfWeek'
      }
};
