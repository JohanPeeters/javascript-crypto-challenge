const nacl = require('libsodium-wrappers');

let clientPublicKey
let rx, tx;


module.exports = {

    setClientPublicKey: (key) => {
        if (clientPublicKey != null && clientPublicKey !== key) {
            throw "client public key already set"
        }
        clientPublicKey = key; 
    },

    serverPublicKey: async () => {
        const keyPair = nacl.crypto_kx_keypair();
        let serverPrivateKey = keyPair.privateKey;
        let serverPublicKey = keyPair.publicKey;

        const sharedKeys = await nacl.crypto_kx_server_session_keys(
            serverPublicKey,
            serverPrivateKey,
            clientPublicKey
        );
        rx = sharedKeys.sharedRx;
        tx = sharedKeys.sharedTx;

        return serverPublicKey;
    },

    decrypt: async (ciphertext, nonce) => {
        return nacl.crypto_secretbox_open_easy(ciphertext, nonce, rx);
    },

    encrypt: async (msg)  => {
        let nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        let ciphertext = nacl.crypto_secretbox_easy(msg, nonce, tx);

        return {ciphertext, nonce};
    }
};