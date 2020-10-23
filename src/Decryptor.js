// Abdelali Ez Zyn
// Sources:
// https://github.com/wilhelmmatilainen/natrium

// Load sodium-wrappers module
const sodium = require('libsodium-wrappers');
let key = null;

// Generates key
module.exports.setKey = async function setKey(_key) {
	key = _key;
};

// Decrypts the encrypted message when you have the key
module.exports.decrypt = async function decrypt(ciphertext, nonce) {
	if (key == null) {
		throw 'no key';
	} else {
		return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
	}
};
