const nacl = require('libsodium-wrappers');
const Encryptor = require('./Encryptor');
const Decryptor = require('./Decryptor');

const newSecureSessionPeer = async(server = null) => {
    // Wait til nacl is ready
    await nacl.ready;

    // Generate asymetric keypair
    const { publicKey, privateKey } = nacl.crypto_box_keypair();

    // Create the object
    const obj = {
        publicKey: publicKey,

        connect(clientPublicKey) {
            const key = nacl.crypto_kx_server_session_keys(
                publicKey,
                privateKey,
                clientPublicKey
            );
            
            const encryptor = (async () => await Encryptor(key))();
            const decryptor = (async () => await Decryptor(key))();

            this.encryptor = encryptor;
            this.decryptor = decryptor;
        },

        encrypt: function(msg) {
            const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
            const ciphertext = this.encryptor.encrypt(msg, nonce);
            return { nonce, ciphertext };
        },

        decrypt: async() => {},
        send: () => {},
        receive: () => {},
    };

    if(server) {
        const key = nacl.crypto_kx_client_session_keys(
            publicKey,
            privateKey,
            server.publicKey
        );

        obj.encryptor = await Encryptor(key);
        obj.decryptor = await Decryptor(key);

        server.connect(publicKey);
    }

    return Object.freeze(obj);
}

(async()=>{
    const peer1 = await newSecureSessionPeer();
    const peer2 = await newSecureSessionPeer(peer1);
    console.log(peer1, peer2);
})();

module.exports = newSecureSessionPeer;
