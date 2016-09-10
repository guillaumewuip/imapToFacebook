
const
    imap   = require('./services/imap'),
    parser = require('./utils/parser');

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
    })();

const inbox = imap({
    USER:    IMAP_USER,
    PASSORD: IMAP_PASSWORD,
    SERVER:  IMAP_SERVER,
    PORT:    IMAP_PORT,
});

inbox.on('mail', (mail) => {
    parser(mail)
        .then(console.log.bind(console))
        .catch(console.error.bind(console));
});
