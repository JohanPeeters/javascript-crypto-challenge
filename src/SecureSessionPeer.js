const nacl = require('libsodium-wrappers');
const Encryptor = require('./Encryptor');
const Decryptor = require('./Decryptor');


const newSecureSessionPeer = async(server = null) => {
    // Wait for init nacl
    await nacl.ready;

    // Inititiaze object
    const secureSessionPeer = {};

    // Generate asymetic keys
    const { publicKey, privateKey } = nacl.crypto_box_keypair();
    secureSessionPeer.publicKey = publicKey;

    // Connection method
    secureSessionPeer.connect = async function(other, keyFn) {
        this.peer = other;

        const key = keyFn(publicKey, privateKey, other.publicKey);

        this.decryptor = await Decryptor(key.sharedRx);
        this.encryptor = await Encryptor(key.sharedTx);
    }

    // Connect the server and client
    if(server) {
        await secureSessionPeer.connect(server, nacl.crypto_kx_client_session_keys);
        await server.connect(secureSessionPeer, nacl.crypto_kx_server_session_keys);
    };

    // Encrypt method
    secureSessionPeer.encrypt = function(msg) {
        const nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES);
        const ciphertext = this.encryptor.encrypt(msg, nonce);
        return { nonce, ciphertext };
    }

    secureSessionPeer.decrypt = function(msg, nonce) {
        return this.decryptor.decrypt(msg, nonce);
    }

    // Send function
    secureSessionPeer.send = function(msg) {
        this.peer.message = this.encrypt(msg);
    }

    // Receive function
    secureSessionPeer.receive = function() {
        return this.decrypt(this.message.ciphertext, this.message.nonce);
    }

    return Object.defineProperties(secureSessionPeer, {
        publicKey: { configurable: false, writable: false},
        privateKey: { configurable: false, writable: false}
    });
}

(async()=>{
    const peer1 = await newSecureSessionPeer();
    const peer2 = await newSecureSessionPeer(peer1);

    peer1.send("this is a test");

    // console.log(peer1, peer2);
})();

module.exports = newSecureSessionPeer;
