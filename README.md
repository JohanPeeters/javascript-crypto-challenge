This is a simple exercise in using cryptography with `libsodium.js`. It consists of 3 parts:
* signing a message
* decrypting a ciphertext
* setting up a secure session.

In both cases, the challenge is to make some unit tests pass, respectively
* `tests/sign.test.js`, and,
* `tests/decrypt.test.js`
* `tests/secure-session.test.js`.

The tests assume that you expose an API in, respectively
* `src/Signature.js`,
* `src/Decryptor.js`, and,
* `src/SecureSession.js`

But this should be clear from the tests, as should the methods that you need to implement.

Signing a message
-----------------
We use public-key signatures. They are based on asymmetric key pairs: one of the keys is public, the other private. The public key is sometimes also called the verifying key. The secret, or private, key is also called the signing key.

Decrypting a ciphertext
-----------------------
For encrypting and decrypting data, we use symmetric cryptography, also called secret-key cryptography. This means that the same key is used for encrypting and decrypting.

Since an adversary should not be able to detect that the same plaintext message is sent several times, each message is encrypted with a unique nonce.

We use *authenticated encryption* which allows the receiver to verify the integrity of the ciphertext. Libsodium does this transparently - if the ciphertext has been tampered with, the decryption function fails.

Setting up a secure session
---------------------------
Asymmetric cryptography is well-suited for authenticating the owner of a public key, but too slow for encrypting a large amount of data. Therefore, when 2 parties want to exchange many messages, they usually run a key-exchange protocol to agree on a shared symmetric key first. Subsequently, they send each other messages encrypted with the shared key.

Libsodium's key-exchange actually establishes 2 shared keys, one used by the client to encrypt server-bound messages, a second one used by the server when sending messages to the client. This arrangement makes it easier for either party to guarantee that it only uses a nonce once with a given key - not that this is a big concern in this exercise: client and server send exactly one message.

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
