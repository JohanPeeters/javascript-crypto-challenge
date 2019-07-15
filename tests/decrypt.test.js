const nacl = require('libsodium-wrappers')
const Decryptor = require('../src/Decryptor.js')

describe('decryption module', () => {

  let msg, ciphertext, nonce, key

  beforeAll(async () => {
    await nacl.ready
    key = nacl.crypto_secretbox_keygen()
  })

  beforeEach(() => {
    msg = nacl.randombytes_buf(1024)
    nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES)
    ciphertext = nacl.crypto_secretbox_easy(msg, nonce, key)
  })

  it('needs a decryption key before it can decrypt', async () => {
    try {
      await Decryptor.decrypt(ciphertext, nonce)
    } catch (e) {
      expect(e).toMatch('no key')
    }
    Decryptor.setKey(key)
    await Decryptor.decrypt(ciphertext, nonce) // should succeed
  })

  it('decrypts an encrypted message', async () => {
    expect(await Decryptor.decrypt(ciphertext, nonce)).toEqual(msg)
  })
})
