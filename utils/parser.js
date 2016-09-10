
const MailParser = require('mailparser').MailParser;

/**
 * parseMail
 *
 * Read an email to extract fields like From, To, Content, etc.
 *
 * @param  {Object}     mailToParse
 * @param  {String}     mailToParse.uid     Mail uid
 * @param  {Buffer}     mailToParse.buffer  The mail
 *
 * @return {Promise}
 */
const parseMail = (mailToParse) => {
    const mailparser = new MailParser();

    console.log(`Will parse mail ${mailToParse.uid}`);

    return new Promise((resolve, reject) => {
        mailparser.on('end', (mail) => {
            resolve(mail);
        });

        mailparser.on('error', reject);

        // send the email source to the parser
        mailparser.write(mailToParse.buffer.toString());
        mailparser.end();
    });
};

module.exports = parseMail;
