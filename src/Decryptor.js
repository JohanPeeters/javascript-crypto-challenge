
const _sodium = require('libsodium-wrappers');

var signatureKey =  null;

beforeAll(async ()=> {
    await _sodium.ready
})

//set decryption key
module.exports.setKey = async function (key)
{
    signatureKey = key;
}

//decrypt using a nonce and key. Throw exception if there is no key
module.exports.decrypt = async function (ciphertext, nonce)
{
    if (signatureKey === null)
        throw 'no key found';
    
    await _sodium.ready;

    
    return _sodium.crypto_secretbox_open_easy(ciphertext, nonce, signatureKey);

}