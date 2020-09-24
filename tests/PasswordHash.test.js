'use strict'
const nacl = require('libsodium-wrappers')
const PasswordHash = require('../src/PasswordHash')

describe('PasswordHash', () => {

    beforeAll(async () => {
      await nacl.ready
    })

    it('requires an opslimit of at least 3', () => {
        const pwHash = PasswordHash()
        pwHash.opslimit = 2
        try {
            pwHash.hash()
            fail()
        } catch (error) {
            
        }
    })
})
