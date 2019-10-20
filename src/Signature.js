const sodium = require('libsodium-wrappers');
let keypair;

(async() => {
  await sodium.ready;
  keypair = sodium.crypto_sign_keypair();
})();

module.exports.verifyingKey = async function verifyingKey()
{
    await sodium.ready;
    return keypair.publicKey;
}

module.exports.sign = async function sign(msg)
{
    return sodium.crypto_sign(msg,keypair.privateKey);
}