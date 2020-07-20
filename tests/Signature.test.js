const nacl = require('libsodium-wrappers')
const Signature = require('../src/Signature')

describe('signing module', () => {
  let signatory, verifyingKey
  beforeAll(async () => {
    signatory = await Signature()
    verifyingKey = signatory.verifyingKey
  })
  it('provides a verifying key', () => {
    expect(verifyingKey).toBeDefined()
  })
  it('returns a signed message', async () => {
    const msg = nacl.randombytes_buf(1024)
    const signedMsg = await signatory.sign(msg)
    expect(nacl.crypto_sign_open(signedMsg, verifyingKey)).toEqual(msg)
  })
})
