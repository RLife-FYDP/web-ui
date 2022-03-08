import {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
  SessionCipher,
  MessageType,
} from "@privacyresearch/libsignal-protocol-typescript";

import {DeviceType} from "@privacyresearch/libsignal-protocol-typescript/lib";
import { authenticatedGetRequest, authenticatedRequestWithBody } from "../api/apiClient";

import {SignalProtocolStore} from './signalStorage'

let store: SignalProtocolStore

export async function generateSignalId(userId: number) {
  store = new SignalProtocolStore()
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

  authenticatedRequestWithBody(`/chat/signal/${userId}/preKeyBundle`, JSON.stringify(reqBody))
}

export async function encryptFirstMessage(toUserId: number, message: string): Promise<MessageType> {
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

  const recipientAddress = new SignalProtocolAddress(toUserId.toString(), 1)
  const sessionBuilder = new SessionBuilder(store, recipientAddress);
  await sessionBuilder.processPreKey(bundle)
  const sessionCipher = new SessionCipher(store, recipientAddress)
  const ciphertext = await sessionCipher.encrypt(new TextEncoder().encode(message).buffer)
  return ciphertext!
}

export async function encryptMessage(toUserId: number, message: string) : Promise<MessageType> {
  const recipientAddress = new SignalProtocolAddress(toUserId.toString(), 1)
  const sessionCipher = new SessionCipher(store, recipientAddress)
  const ciphertext = await sessionCipher.encrypt(new TextEncoder().encode(message).buffer)
  return ciphertext
}

let decryptMessageCalls = 0
export async function decryptMessage(fromUserId: number, message: MessageType): Promise<string> {
  if (++decryptMessageCalls==1) {
    return '';
  } else if (decryptMessageCalls == 2) {
    decryptMessageCalls = 0
  }
  const remoteAddress = new SignalProtocolAddress(fromUserId.toString(), 1)
  const sessionCipher = new SessionCipher(store, remoteAddress)
  let plaintext : ArrayBuffer = new Uint8Array().buffer;
  if (message.type === 3) {
    plaintext = await sessionCipher.decryptPreKeyWhisperMessage(message.body!, 'binary')
  } else {
    plaintext = await sessionCipher.decryptWhisperMessage(message.body!, 'binary')
  }
  const decryptedMessage = new TextDecoder().decode(new Uint8Array(plaintext))
  return decryptedMessage
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
