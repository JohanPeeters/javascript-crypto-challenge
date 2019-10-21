const sodium = require('libsodium-wrappers');
let key;

module.exports.setKey = async (newKey) => {
    key = newKey;
}

module.exports.decrypt = async (ciphertext, nonce) => {
    if (!key) { throw "no key"; }
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
}