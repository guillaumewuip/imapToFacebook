
const expect = require('chai').expect;

const
    parser         = require('../../utils/parser'),
    messageBuilder = require('../../utils/messageBuilder');

describe('messageBuilder', () => {
    describe('padText()', () => {
        it('it should pad each line with prefix', () => {
            const text = `Hello\nWorld`;
            const result = '> Hello\n> World';

            expect(messageBuilder.padText('> ', text)).to.equal(result);
        });
    });

    describe('buildMessage()', () => {
        it(
            'should build a funny message with all informations',
            function (done) {
                const data = {
                    text: 'How are you today ?',
                    from: [{ address: 'sender@example.com', name: 'Sender' }],
                    to:   [{
                        address: 'receiver@example.com',
                        name:    'Receiver',
                    }],
                    subject: 'Hello world!',
                    date:    new Date('Sat, 10 Sep 2016 08:28:39 +0200 (CEST)'),
                };

                const email = `From: Sender <sender@example.com>
To: Receiver <receiver@example.com>
Subject: Hello world!
Date: Sat, 10 Sep 2016 08:28:39 +0200 (CEST)
Content-Type: text/plain;charset=utf8

How are you today ?`;

                parser({ uid: 1, buffer: Buffer.from(email) })
                    .then(messageBuilder.buildMessage)
                    .then(({ text }) => {
                        expect(text).to.be.a('string');
                        expect(text.includes(data.subject)).to.equal(true);

                        done();
                    })
                    .catch(done);
            }
        );
    });

    it('should use FROM name if present', function (done) {
        const email = `From: Sender <sender@example.com>
To: Receiver <receiver@example.com>
Subject: Hello world!
Content-Type: text/plain;charset=utf8

How are you today ?`;

        parser({ uid: 1, buffer: Buffer.from(email) })
            .then(messageBuilder.buildMessage)
            .then(({ text }) => {
                expect(text.includes('Sender')).to.equal(true);
                expect(text.includes('sender@example.com')).to.equal(false);
                done();
            })
            .catch(done);
    });

    it('should use FROM address if no name', function (done) {
        const email = `From:  <sender@example.com>
To: Receiver <receiver@example.com>
Subject: Hello world!
Content-Type: text/plain;charset=utf8

How are you today ?`;

        parser({ uid: 1, buffer: Buffer.from(email) })
            .then(messageBuilder.buildMessage)
            .then(({ text }) => {
                expect(text.includes('sender@example.com')).to.equal(true);
                done();
            })
            .catch(done);
    });
});
