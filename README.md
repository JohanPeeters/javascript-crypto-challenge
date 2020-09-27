This is a simple exercise in using cryptography with `libsodium.js`. It consists of 4 parts:
* decrypting a ciphertext
* signing a message
* verifying a hashed password
* setting up a secure session.

In all cases, the challenge is to make some unit tests pass, respectively
* `tests/Decryptor.test.js`,
* `tests/Signature.test.js`,
* `tests/PasswordVerifier.test.js`, and,
* `tests/SecureSessionPeer.test.js`.

The tests assume that you expose an API in, respectively
* `src/Decryptor.js`, 
* `src/Signature.js`,
* `src/PasswordHashVerifier.js` and,
* `src/SecureSessionPeer.js`.

But this should be clear from the tests, as should the methods that you need to implement.

Decrypting a ciphertext
-----------------------
For encrypting and decrypting data, we use symmetric cryptography, also called secret-key cryptography. This means that the same key is used for encrypting and decrypting.

Since an adversary should not be able to detect that the same plaintext message is sent several times, each message is encrypted with a unique nonce.

We use *authenticated encryption* which allows the receiver to verify the integrity of the ciphertext. Libsodium does this transparently - if the ciphertext has been tampered with, the decryption function fails.

Signing a message
-----------------
We use public-key signatures. They are based on asymmetric key pairs: one of the keys is public, the other private. The public key is sometimes also called the verifying key. The secret, or private, key is also called the signing key.

Verifying a hashed password
---------------------------
We use Argon2 as the password hashing algorithm - this is default in the current version of libsodium. `crypto_pwhash_str` generates a random salt for each invocation, concatenates the salt and password and hashes the resulting string. Argon2 uses a configurable number of hash iterations (the `opslimit` parameter) and memory (`memlimit`) to make verification respectively more CPU- and RAM-intensive. The output of `crypto_pwhash_str` includes the parameters and salt. These need therefore not be specified when verifying a password against its hash.

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

It is strongly advised to work on the code for one test at the time. In order to do so, skip the other tests by calling the [`xit`](https://jestjs.io/docs/en/api#testskipname-fn) rather than the `it` function. 
