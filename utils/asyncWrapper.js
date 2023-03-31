/* eslint-disable linebreak-style */
module.exports = (promise) => promise
    .then(data => [undefined, data])
    .catch(err => [err, undefined]);