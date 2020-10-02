const nacl = require('libsodium-wrappers');

module.exports = async(key) => {
    await nacl.ready;

    if(key == null) throw 'no key';

    return Object.freeze({
        encrypt: (msg, nonce) => {
            if(!msg || !nonce) throw 'Invalid arguments';

            return nacl.crypto_secretbox_easy(msg, nonce, key)
        }
    });
}
