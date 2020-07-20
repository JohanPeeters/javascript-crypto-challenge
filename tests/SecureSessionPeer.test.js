'use strict'
const nacl = require('libsodium-wrappers')

const SecureSessionPeer = require('../src/SecureSessionPeer')
const Decryptor = require('../src/Decryptor')

describe('SecureSessionPeer', () => {
  let peer
  beforeAll(async () => {
    peer = await SecureSessionPeer()
  })
  it('can be instantiated', () => {
    expect(peer).toBeDefined()
  })
  describe('has a public key', () => {
    it('that can be retrieved', () => {
      expect(peer.publicKey).toBeDefined()
    })
    it('that cannot be changed', () => {
      try {
        peer.publicKey = '42'
        fail()
      } catch(e) {
      }
    })
  })
  describe('presumably hides a private key somewhere', () => {
    it('but that is being kept secret', () => {
      expect(peer.privateKey).not.toBeDefined()
    })
    it('and cannot be changed', () => {
      try {
        peer.privateKey = '42'
        fail()
      } catch(e) {
      }
    })
  })
  describe('connects to another SecureSessionPeer', () => {
    let otherPeer
    beforeAll(async () => {
      otherPeer = await SecureSessionPeer(peer)
    })
    it('resulting in 2 distinct peers with different public keys', () => {
      expect(peer).not.toEqual(otherPeer)
      expect(peer.publicKey).not.toEqual(otherPeer.publicKey)
    })
    describe('which can encrypt messages', () => {
      let msg, ciphertext1, ciphertext2, nonce1, nonce2
      beforeEach(async () => {
        await nacl.ready
        msg = nacl.randombytes_buf(1024)
        let res = peer.encrypt(msg)
        ciphertext1 = res.ciphertext
        nonce1 = res.nonce
        res = otherPeer.encrypt(msg)
        ciphertext2 = res.ciphertext
        nonce2 = res.nonce
      })
      it('returning a ciphertext and a nonce', () => {
        expect(ciphertext1).toBeDefined()
        expect(nonce1).toBeDefined()
        expect(ciphertext2).toBeDefined()
        expect(nonce2).toBeDefined()
      })
      it('that can be decrypted messages by the other peer', () => {
        const {ciphertext, nonce} = peer.encrypt(msg)
        expect(otherPeer.decrypt(ciphertext, nonce)).toEqual(msg)
      })
      it('that are integrity protected', () => {
        const {ciphertext, nonce} = peer.encrypt(msg)
        const tamperIdx = nacl.randombytes_uniform(ciphertext.length)
        ciphertext[tamperIdx] = (ciphertext[tamperIdx] + 1) % 256 // each el is 8 bits
        try {
          otherPeer.decrypt(ciphertext, nonce)
          fail()
        } catch(e) {
        }
      })
      it('that cannot be decrypted with the public key', async () => {
        const {ciphertext, nonce} = peer.encrypt(msg)
        const decryptor = await Decryptor(peer.publicKey)
        const res = decryptor.decrypt(ciphertext, nonce)
        expect(res).not.toEqual(msg)
      })
    })
    it('that exchange messages', async () => {
      await nacl.ready
      const msg1 = nacl.randombytes_buf(1024)
      const msg2 = nacl.randombytes_buf(1024)
      peer.send(msg1)
      let received = otherPeer.receive()
      expect(received).toEqual(msg1)
      otherPeer.send(msg2)
      received = peer.receive()
      expect(received).toEqual(msg2)
    })
  })
})
