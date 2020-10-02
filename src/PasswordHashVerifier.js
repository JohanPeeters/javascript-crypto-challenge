const nacl = require('libsodium-wrappers');

module.exports = async () => {
    await nacl.ready;

    return Object.freeze({
        verify: (hash, password) => {
            return nacl.crypto_pwhash_str_verify(hash, password)
        }
    });
};
