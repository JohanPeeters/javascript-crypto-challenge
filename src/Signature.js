const nacl = require('libsodium-wrappers');

module.exports = async() => {
    await nacl.ready;
    const { publicKey, privateKey } = nacl.crypto_sign_keypair();
    return Object.freeze({
        verifyingKey: publicKey,
        sign: msg => {
            return nacl.crypto_sign(msg, privateKey);
        }
    });
}
