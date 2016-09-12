
const
    imap            = require('./services/imap'),
    parser          = require('./utils/parser'),
    bufferAPI       = require('./services/buffer'),
    messageBuilder  = require('./utils/messageBuilder'),
    mailFilter      = require('./utils/mailFilter');

const
    IMAP_USER = (() => {
        if (!process.env.IMAP_USER) {
            throw new Error('Need IMAP_USER');
        }
        return process.env.IMAP_USER;
    })(),

    IMAP_PASSWORD = (() => {
        if (!process.env.IMAP_PASSWORD) {
            throw new Error('Need IMAP_PASSWORD');
        }
        return process.env.IMAP_PASSWORD;
    })(),

    IMAP_SERVER = (() => {
        if (!process.env.IMAP_SERVER) {
            throw new Error('Need IMAP_SERVER');
        }
        return process.env.IMAP_SERVER;
    })(),

    IMAP_PORT = (() => {
        if (!process.env.IMAP_PORT) {
            return 993;
        }
        return process.IMAP_PORT;
    })(),

    BUFFER_ACCESS_TOKEN = (() => {
        if (!process.env.BUFFER_ACCESS_TOKEN) {
            throw new Error('Need BUFFER_ACCESS_TOKEN');
        }
        return process.env.BUFFER_ACCESS_TOKEN;
    })(),

    BUFFER_PROFILE = (() => {
        if (!process.env.BUFFER_PROFILE) {
            throw new Error('Need BUFFER_PROFILE');
        }
        return process.env.BUFFER_PROFILE;
    })(),

    /*
     * comma-separated list of mails used to filter new mail
     * these are mails we accept in the TO: field
     */
    DEST_MAILS = (() => {
        if (!process.env.DEST_MAILS) {
            throw new Error('Need DEST_MAILS');
        }
        return process.env.DEST_MAILS.split(',');
    })();

console.log(`DEST_MAILS = ${DEST_MAILS}`);

const inbox = imap({
    USER:     IMAP_USER,
    PASSWORD: IMAP_PASSWORD,
    SERVER:   IMAP_SERVER,
    PORT:     IMAP_PORT,
});

const buffer = bufferAPI(BUFFER_ACCESS_TOKEN);

const mustBeSend = mailFilter(DEST_MAILS);

inbox.on('mail', (mail) => {
    console.log(`New mail ${mail.uid}`);
    parser(mail)
        .then((parsedMail) => {
            console.log(`Parsed mail ${parsedMail.from[0].address} \
${parsedMail.subject}`);

            if (mustBeSend(parsedMail)) {
                console.log('Building mail & sending to Buffer');
                return messageBuilder
                    .buildMessage(parsedMail)
                    .then(buffer.post(BUFFER_PROFILE))
                    .catch((err) => {
                        console.error(err);
                        process.exit(1);
                    });
            }

            return Promise.resolve();
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
});
