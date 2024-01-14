const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    moduleNameMapper: {
        '^@salesforce/i18n/firstDayOfWeek$': '<rootDir>/force-app/test/jest-mocks/i18n/firstDayOfWeek',
        '^lightning/modal$': '<rootDir>/force-demo-app/test/jest-mocks/lightning/modal',
        '^lightning/modalHeader$': '<rootDir>/force-demo-app/test/jest-mocks/lightning/modalHeader',
        '^lightning/modalBody$': '<rootDir>/force-demo-app/test/jest-mocks/lightning/modalBody',
        '^lightning/modalFooter$': '<rootDir>/force-demo-app/test/jest-mocks/lightning/modalFooter',
      }
};
