This is a simple exercise in using cryptography with `libsodium.js`. It consists of 2 parts:
* signing a message
* decrypting a ciphertext.

In both cases, the challenge is to make some unit tests pass, respectively
* `tests/sign.test.js`, and,
* `tests/decrypt.test.js`.

The tests assume that you expose an API in, respectively
* `src/Signature.js`, and,
* `src/Decryptor.js`

But this should be clear from the tests, as should the methods that you need to implement.

Signing a message
-----------------
We use public-key signatures. They are based on asymmetric key pairs: one of the keys is public, the other private. The private key is sometimes also called the signing key. The secret, or private, key is also called the signing key.

Decrypting a ciphertext
-----------------------
For encrypting and decrypting data, we use symmetric cryptography, also called secret-key cryptography. This means that the same key is used for encrypting and decrypting.

Since an adversary should not be able to detect that the same plaintext message is sent several times, each message is encrypted with a unique nonce.

We use *authenticated encryption* which allows the receiver to verify the integrity of the ciphertext. Libsodium does this transparently - if the ciphertext has been tampered with, the decryption function fails.

More documentation
------------------
To find out more about the functions that you need to use, look in the [Libsodium](https://libsodium.gitbook.io/doc) and [libsodium.js](https://github.com/jedisct1/libsodium.js) documentation. The former is the original implementation in C, the latter the port to JavaScript. Note in the latter document that the `ready` promise must be resolved before the functions in the module can be invoked. It is therefore likely that some of the functions you write will be asynchronous - the tests are somewhat opinionated in this respect.

Getting started
---------------
```
git clone git@github.com:JohanPeeters/javascript-crypto-challenge.git
npm install
npm test
```
