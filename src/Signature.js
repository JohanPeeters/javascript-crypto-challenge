const sodium = require('libsodium-wrappers');
let keypair;

init = async() => {
  if (!keypair) {
    await sodium.ready;
    keypair = sodium.crypto_sign_keypair();
  }
}

module.exports.verifyingKey = async function verifyingKey() {
    await init();
    return keypair.publicKey;
}

module.exports.sign = async function sign(msg) {
    return sodium.crypto_sign(msg,keypair.privateKey);
}