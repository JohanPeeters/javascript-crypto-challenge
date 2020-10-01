const nacl = require('libsodium-wrappers')
const Decryptor = require('../src/Decryptor.js')

describe('Decryption', () => {

  let msg, ciphertext, nonce, key, decryptor

  beforeAll(async () => {
    await nacl.ready
    key = nacl.crypto_secretbox_keygen()
    decryptor = await Decryptor(key)
  })

  beforeEach(() => {
    msg = nacl.randombytes_buf(1024)
    nonce = nacl.randombytes_buf(nacl.crypto_secretbox_NONCEBYTES)
    ciphertext = nacl.crypto_secretbox_easy(msg, nonce, key)
  })

  it('needs to be instantiated with a decryption key', async () => {
    let decryptorWithoutKey
    try {
      decryptorWithoutKey = await Decryptor()
      fail()
    } catch (e) {
      expect(e).toMatch('no key')
    }
    decryptor.decrypt(ciphertext, nonce) // should succeed
  })

  describe('decrypt', () => {


    it('decrypts an encrypted message', () => {
      expect(decryptor.decrypt(ciphertext, nonce)).toEqual(msg)
    })

    it('throws an error if the ciphertext has been tampered with', () => {
      const tamperIdx = nacl.randombytes_uniform(ciphertext.length)
      ciphertext[tamperIdx] = (ciphertext[tamperIdx] + 1) % 256 // each el is 8 bits
      try {
        decryptor.decrypt(ciphertext, nonce)
        fail()
      } catch(e) {
      }
    })

    it('throws an error if either of the arguments is undefined', () => {
      try {
        decryptor.decrypt(ciphertext)
        fail()
      } catch(e) {
      }
      try {
        decryptor.decrypt(undefined, nonce)
        fail()
      } catch(e){
      }
    })
  })
})
