
const
    util   = require('util'),
    moment = require('moment');

moment.locale('fr');

const MAX_LENGTH = 63206;

const START_MESSAGES = [
    'Salut !\n',
    '🤖  ',
    'Wesh ! \n',
    'Yo. ',
    'Salut les loulous. \n',
    'Cher collègues,\n',
    'Humains, je viens de détecter quelque chose.\n',
    '💩💂🐙🍳📡🎎\n',
    'Mmmh. Il semblerait que j\'ai quelque chose pour vous. ',
    '01001000 01100101 01101100 01101100 01101111 \n',
    `Alors
J\'ai pour misson de vous transmettre des mails
Avouez que c\'est relou
D'un côté c'est pour ça que je le fais.
En vrai je m'emmerde.
Bref.\n`,
];

const SENDER_MESSAGES = [
    'V\'là un mail de %s. ',
    'Voici une missive envoyée par %s. ',
    'C\'est %s qui envoie un message. ',
    '%s veut s\'exprimer. ',
    'Ci joint un message de %s.\n',
    'Il semble que cela vienne de %s. ',
];

const SUBJECT_MESSAGES = [
    'Le sujet : "%s"',
    '"%s"',
    'V\'là le sujet du truc : "%s"',
    'Ça s\'appelle "%s"',
];

const CONTENT_MESSAGES = [
    'Regardez moi ça.\n',
    'Je vous colle ça là.\n',
    'Voici le pavé.\n',
    'Voilà ce dont il est question : \n',
    'Je cite :\n',
    'J\'ai pas tout compris.\n',
];

const END_MESSAGES = [
    'Voilà c\'est tout.',
    'À votre bon coeur !',
    'Live long and prosper 😇',
    'J\'espère que c\'est rien de trop chiant.',
    'À plus dans l\'bus !',
    'Je vous laisse en tirer toutes les conclusions.',
    'Pas sûr de tout comprendre hein.',
    'Au plaisir !',
    '++',
];

const random = (max) => Math.floor(Math.random() * (max + 1));

const getRandom = (list) => {
    const index = random(list.length - 1);
    return list[index];
};

const padText = (prefix, text) => {
    const lines = text.split('\n');
    let l = lines.length;

    while (lines[0] === '') { // remove empty lines at the beginning
        lines.shift();
        l -= 1;
    }

    let i = l - 1;
    while (lines[i] === '') { // remove empty lines at the end
        lines.pop();
        i -= 1;
    }

    return lines.map((line) => `${prefix}${line}`).join('\n');
};

const buildLongMessage = (text) => {
    if (text <= MAX_LENGTH) {
        return text;
    }

    const offset = text.length - MAX_LENGTH - 3;
    return `${text.slice(-offset)}...`;
};

const buildMessage = (mail) => (new Promise((resolve, reject) => {
    if (!mail.text) {
        reject(new Error('No content with mail'));
        return;
    }

    const from = mail.from.map(
        ({ name, address }) => (name !== '' ? name : address)
    ).join(', ');

    const date = mail.date ? moment(mail.date).fromNow() : 'No date';

    const msg = `\
${getRandom(START_MESSAGES)}\
${util.format(getRandom(SENDER_MESSAGES), from)}\
${util.format(getRandom(SUBJECT_MESSAGES), mail.subject)}
${getRandom(CONTENT_MESSAGES)}
${padText('> ', mail.text)}

${getRandom(END_MESSAGES)}

${date} - http://webmail-etu.univ-nantes.fr
`;

    if (msg <= MAX_LENGTH) {
        resolve(buildLongMessage(`${mail.from[0].address}: ${mail.text}`));
    } else {
        resolve(msg);
    }
}));

module.exports = {
    getRandom,
    padText,
    buildMessage,
};
