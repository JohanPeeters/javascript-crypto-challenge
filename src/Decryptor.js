const nacl = require('libsodium-wrappers');

module.exports = (key) => {
    if(key == null) throw 'no key';

    return Object.freeze({
        decrypt: (ciphertext, nonce) => {
            (async() => await nacl.ready)();

            if(!ciphertext || !nonce) throw 'Invalid arguments';

            return nacl.crypto_secretbox_open_easy(ciphertext, nonce, key)
        }
    });
}
