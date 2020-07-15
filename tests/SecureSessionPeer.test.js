'use strict'
const nacl = require('libsodium-wrappers')

const SecureSessionPeer = require('../src/SecureSessionPeer')

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
    describe('as a result', () => {
      let msg, ciphertext, nonce
      beforeEach(async () => {
        await nacl.ready
        msg = nacl.randombytes_buf(1024)
      })
      it('it decrypts messages encrypted by the other peer', () => {
        const {ciphertext, nonce} = peer.encrypt(msg)
        expect(otherPeer.decrypt(ciphertext, nonce)).toEqual(msg)
      })
      it('detects when messages have been tampered with', () => {
        const {ciphertext, nonce} = peer.encrypt(msg)
        const tamperIdx = nacl.randombytes_uniform(ciphertext.length)
        ciphertext[tamperIdx] = (ciphertext[tamperIdx] + 1) % 256 // each el is 8 bits
        try {
          otherPeer.decrypt(ciphertext, nonce)
          fail()
        } catch(e) {
        }
      })
      it('sends messages to the other peer', () => {
        peer.send(msg)
        const received = otherPeer.receive()
        expect(received).toEqual(msg)
      })
      it('receives messages from the other peer', () => {
        otherPeer.send(msg)
        const received = peer.receive()
        expect(received).toEqual(msg)
      })
    })
  })
})
