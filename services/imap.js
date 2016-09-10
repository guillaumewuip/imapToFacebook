
const
    EventEmitter   = require('events'),
    inbox          = require('inbox'),
    streamToBuffer = require('stream-to-buffer');

/**
 * parseMail
 *
 * Find the whole mail
 *
 * @param  {Imap}   imap
 * @param  {String} uid  The mail uid
 */
const parseMail = function (imap, uid) {
    return new Promise((resolve, reject) => {
        const messageStream = imap.createMessageStream(uid);

        streamToBuffer(messageStream, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    uid,
                    buffer,
                });
            }
        });
    });
};

/**
 * readMail
 *
 * Parse a mail then emit event
 */
const readMail = (imap, imapEmitter) => (uid) => {
    parseMail(imap, uid)
        .then((mail) => {
            console.log(`New mail ${mail.uid}`);
            console.log(mail);
            imapEmitter.emit('mail', mail);
        })
        .catch((err) => {
            console.error(`Can't parse mail ${uid}`, err);
        });
};

const imapListener = (imapInfos) => {
    const imapEmitter = new EventEmitter();

    const imap = inbox.createConnection(
        imapInfos.PORT,
        imapInfos.SERVER, {
            secureConnection: true,
            auth:             {
                user: imapInfos.USER,
                pass: imapInfos.PASSWORD,
            },
        }
    );

    imap.on('new', (message) => readMail(imap, imapEmitter)(message.UID));

    imap.on('error', (err) => {
        console.error('Imap error', err);
        process.exit(1);
    });

    imap.on('close', () => {
        console.error('Imap disonnection');
        process.exit(1);
    });

    imap.connect();

    return imapEmitter;
};

module.exports = imapListener;
