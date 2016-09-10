
const expect = require('chai').expect;

const mailFilter = require('../../utils/mailFilter');

describe('mailFilter', () => {
    it('should filter emails based on to: field', () => {
        const validEmails = [
            'toto@gmail.com',
            'titi@gmail.com',
        ];

        const filter = mailFilter(validEmails);

        expect(filter({ to: [{ address: 'toto@gmail.com' }] })).to.equal(true);
        expect(filter({ to: [{ address: 'titi@gmail.com' }] })).to.equal(true);

        expect(filter({ to: [{ address: 'tata@gmail.com' }] })).to.equal(false);
    });
});
