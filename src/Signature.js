
const _sodium = require('libsodium-wrappers');
var signatureKey = null;

beforeAll(async() => {
    await _sodium.ready;
    signatureKey = _sodium.crypto_sign_keypair();
});

//Returns a signed msg with a key
module.exports.sign = async function(msg)
{
    await _sodium.ready;

    return _sodium.crypto_sign(msg, signatureKey.privateKey);
}

//returns a public key
module.exports.verifyingKey = async function()
{
    await _sodium.ready;

    return signatureKey.publicKey;
}

