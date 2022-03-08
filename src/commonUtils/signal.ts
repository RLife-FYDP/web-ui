import {
  KeyHelper,
  SignedPublicPreKeyType,
  SignalProtocolAddress,
  SessionBuilder,
  PreKeyType,
  SessionCipher,
  MessageType,
} from "@privacyresearch/libsignal-protocol-typescript";

import {DeviceType} from "@privacyresearch/libsignal-protocol-typescript/lib";
import { authenticatedGetRequest, authenticatedRequestWithBody } from "../api/apiClient";

import {SignalProtocolStore} from './signalStorage'

// let store: SignalProtocolStore

export async function generateSignalId(store: SignalProtocolStore, userId: number) {
  // store = new SignalProtocolStore()
  console.log('generateSignalId')
  const registrationId = KeyHelper.generateRegistrationId()
  store.put('registrationId', registrationId)

  const identityKeyPair = await KeyHelper.generateIdentityKeyPair()
  store.put('identityKey', identityKeyPair)

  const baseKeyId = Math.floor(10000 * Math.random());
  const preKey = await KeyHelper.generatePreKey(baseKeyId);
  store.storePreKey(`${baseKeyId}`, preKey.keyPair);

  const signedPreKeyId = Math.floor(10000 * Math.random());
  const signedPreKey = await KeyHelper.generateSignedPreKey(
    identityKeyPair,
    signedPreKeyId
  );
  store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);
  const publicSignedPreKey: SignedPublicPreKeyType = {
    keyId: signedPreKeyId,
    publicKey: signedPreKey.keyPair.pubKey,
    signature: signedPreKey.signature,
  };

  const publicPreKey: PreKeyType = {
    keyId: preKey.keyId,
    publicKey: preKey.keyPair.pubKey,
  };

  const reqBody = {
    registrationId,
    identityPubKey: arrayBufferToBase64(identityKeyPair.pubKey),
    signedPreKey: {
      keyId: signedPreKeyId,
      publicKey: arrayBufferToBase64(signedPreKey.keyPair.pubKey),
      signature: arrayBufferToBase64(signedPreKey.signature)
    },
    oneTimePreKeys: [{
      keyId: preKey.keyId,
      publicKey: arrayBufferToBase64(preKey.keyPair.pubKey),
    }]
  }
  console.log(Object.keys(store._store))
  console.log(await store.loadSignedPreKey(signedPreKey.keyId))

  authenticatedRequestWithBody(`/chat/signal/${userId}/preKeyBundle`, JSON.stringify(reqBody))
}

export async function encryptFirstMessage(store: SignalProtocolStore, toUserId: number, message: string): Promise<MessageType> {
  console.log('encryptFirstMessage')
  const res = await authenticatedGetRequest(`/chat/signal/${toUserId}/preKeyBundle`)
  const serializedBundle = await res!.json()
  const bundle: DeviceType = {
    registrationId: serializedBundle.registrationId,
    identityKey: base64ToArrayBuffer(serializedBundle.identityKey),
    signedPreKey: {
      keyId: serializedBundle.signedPreKey.keyId,
      publicKey: base64ToArrayBuffer(serializedBundle.signedPreKey.publicKey),
      signature: base64ToArrayBuffer(serializedBundle.signedPreKey.signature),
    },
    preKey: {
      keyId: serializedBundle.preKey.keyId,
      publicKey: base64ToArrayBuffer(serializedBundle.preKey.publicKey)
    } 
  }
  console.log(store._store)
  console.log(bundle)

  const recipientAddress = new SignalProtocolAddress(toUserId.toString(), 1)
  const sessionBuilder = new SessionBuilder(store, recipientAddress);
  await sessionBuilder.processPreKey(bundle)
  const sessionCipher = new SessionCipher(store, recipientAddress)
  const ciphertext = await sessionCipher.encrypt(new TextEncoder().encode(message).buffer)
  return ciphertext!
}

export async function encryptMessage(store: SignalProtocolStore, toUserId: number, message: string) : Promise<MessageType> {
  const recipientAddress = new SignalProtocolAddress(toUserId.toString(), 1)
  const sessionCipher = new SessionCipher(store, recipientAddress)
  const ciphertext = await sessionCipher.encrypt(new TextEncoder().encode(message).buffer)
  return ciphertext
}

export async function decryptMessage(store: SignalProtocolStore, fromUserId: number, message: MessageType): Promise<string> {
  const remoteAddress = new SignalProtocolAddress(fromUserId.toString(), 1)
  const sessionCipher = new SessionCipher(store, remoteAddress)
  let plaintext : ArrayBuffer = new Uint8Array().buffer;
  if (message.type === 3) {
    plaintext = await sessionCipher.decryptPreKeyWhisperMessage(message.body!, 'binary')
  } else {
    plaintext = await sessionCipher.decryptWhisperMessage(message.body!, 'binary')
  }
  return new TextDecoder().decode(new Uint8Array(plaintext))
}

function arrayBufferToBase64( buffer: ArrayBuffer ): string {
	let binary = '';
	let bytes = new Uint8Array( buffer );
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return btoa( binary );
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  let binary_string =  atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array( len );
  for (let i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
let count = 0
export async function test() {
  count++
  if (count>1) return;
  const storeA = new SignalProtocolStore()
  const storeB = new SignalProtocolStore()
  console.log('before async')

  let _ = await generateSignalId(storeA, 1)
  _ = await generateSignalId(storeB, 2)

  console.log('before encryptFirstMessage')
  let encryptedMessage = await encryptFirstMessage(storeA, 2, 'hello world')
  let decryptedMessage = await decryptMessage(storeB, 1, encryptedMessage)
  console.log(decryptedMessage)

  encryptedMessage = await encryptMessage(storeA, 2, 'hey banbei')
  decryptedMessage = await decryptMessage(storeB, 1, encryptedMessage)
  console.log(decryptedMessage)

  
  encryptedMessage = await encryptMessage(storeB, 1, 'oh yeah man')
  decryptedMessage = await decryptMessage(storeA, 2, encryptedMessage)
  console.log(decryptedMessage)
}