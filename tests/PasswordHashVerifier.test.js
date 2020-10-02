'use strict'
const nacl = require('libsodium-wrappers')
const PasswordHashVerifier = require('../src/PasswordHashVerifier')

describe('PasswordHashVerifier', () => {

    let pw, hashedPw, verifier

    beforeAll(async () => {
      await nacl.ready
      verifier = await PasswordHashVerifier()
    })

    beforeEach(() => {
        const opslimxit = nacl.crypto_pwhash_OPSLIMIT_MIN
        const memlimxit = nacl.crypto_pwhash_MEMLIMIT_MIN
        pw = nacl.randombytes_buf(16)
        hashedPw = nacl.crypto_pwhash_str(pw, opslimxit, memlimxit)
    })

    it('verifies a correct password', async() => {
        expect(verifier.verify(hashedPw, pw)).toBeTruthy()
    })

    it('rejects an incorrect password', async() => {
        expect(verifier.verify(hashedPw, nacl.randombytes_buf(16))).toBeFalsy()
    })
})
