
const FB = require('fb');

module.exports = (ACCESS_TOKEN) => ({
    postToGroup(id, message) {
        return new Promise((resolve, reject) => FB.napi(
            `${id}/feed`,
            'post',
            {
                message,
                access_token: ACCESS_TOKEN,
            },
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            }
        ));
    },
});
