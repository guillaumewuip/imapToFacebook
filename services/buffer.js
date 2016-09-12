
const request = require('request');

const ROOT = 'https://api.bufferapp.com/1';

const buffer = (ACCESS_TOKEN) => ({
    post: (profile) => ({ text }) => (
        new Promise((resolve, reject) => {
            request
                .post({
                    url:     `${ROOT}/updates/create.json`,
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                    form: {
                        text,
                        profile_ids: [profile],
                        now:         true,
                    },
                },
                (err, httpResponse, body) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(body);
                    }
                });
        })
    ),
});

module.exports = buffer;
