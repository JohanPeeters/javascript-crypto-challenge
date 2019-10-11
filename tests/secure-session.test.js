const nacl = require('libsodium-wrappers')
const SecureSession = require('../src/SecureSession')

describe('key exchange', () => {

  let clientPublicKey, clientPrivateKey, serverPublicKey
  let rx, tx
  let msg, nonce, ciphertext

  beforeAll(async () => {
      // generate own key pair
      await nacl.ready
      const keypair = nacl.crypto_kx_keypair()
      clientPrivateKey = keypair.privateKey
      clientPublicKey = keypair.publicKey
      // hand over our public key
      SecureSession.setClientPublicKey(clientPublicKey)
      // retrieve their public key
      serverPublicKey = await SecureSession.serverPublicKey()
      // calculate the shared keys
      const sharedKeys = await nacl.crypto_kx_client_session_keys(
        clientPublicKey,
        clientPrivateKey,
        serverPublicKey
      )
      rx = sharedKeys.sharedRx
      tx = sharedKeys.sharedTx
  })

  beforeEach(() => {
    msg = nacl.randombytes_buf(1024)
    nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES)
    ciphertext = nacl.crypto_secretbox_easy(msg, nonce, tx)
  })

  it('returns its public key', () => {
    expect(serverPublicKey).toBeDefined()
  })

  it('does not allow us to modify our public key', () => {
    try {
      SecureSession.setClientPublicKey(serverPublicKey)
      fail()
    } catch (e) {
      expect(e).toMatch('client public key already set')
    }
    SecureSession.setClientPublicKey(clientPublicKey)
  })

  it('decrypts cyphertext', async () => {
    expect(await SecureSession.decrypt(ciphertext, nonce)).toEqual(msg)
  })

  it('encrypts plaintext', async () => {
    const {ciphertext, nonce} = await SecureSession.encrypt(msg)
    expect(await nacl.crypto_secretbox_open_easy(
                    ciphertext,
                    nonce,
                    rx
                  )
          ).toEqual(msg)
  })
})
