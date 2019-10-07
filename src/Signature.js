// Abdelali Ez Zyn
// Sources:
// https://libsodium.gitbook.io/doc/public-key_cryptography/public-key_signatures
// https://www.npmjs.com/package/libsodium-wrappers

// Load sodium-wrappers module
const sodium = require('libsodium-wrappers');
let keypair = null;

// Generates a keypair (public and secret key)
(async () => {
	await sodium.ready;
	keypair = sodium.crypto_sign_keypair();
})();

// Verifies the keypair & return the public key
module.exports.verifyingKey = async function verifyingKey() {
	await sodium.ready;
	return keypair.publicKey;
};

// Appends signature to message with private key
module.exports.sign = async function sign(msg) {
	return sodium.crypto_sign(msg, keypair.privateKey);
};
