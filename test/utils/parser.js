
const expect = require('chai').expect;

const parser = require('../../utils/parser');

describe('parser', () => {
    it('should return a Promise', () => {
        expect(parser({ uid: 1, buffer: Buffer.from('') }) instanceof Promise)
            .to.equal(true);
    });

    it('should parse a mail', function (done) {
        const data = {
            text:    'How are you today ?',
            from:    [{ address: 'sender@example.com', name: 'Sender' }],
            to:      [{ address: 'receiver@example.com', name: 'Receiver' }],
            subject: 'Hello world!',
        };

        const email = `From: Sender <sender@example.com>
To: Receiver <receiver@example.com>
Subject: Hello world!

How are you today ?`;

        parser({ uid: 1, buffer: Buffer.from(email) })
            .then((result) => {
                expect(result.text).to.equal(data.text);
                expect(result.subject).to.equal(data.subject);
                expect(result.from).to.deep.equal(data.from);
                expect(result.to).to.deep.equal(data.to);

                done();
            })
            .catch(done);
    });
});
