import { WEBAUTHN_CONFIG } from './constants';
import { arrayBufferToBase64 } from '../crypto/conversions';

export const registerPasskey = async (challenge) => {
  const createCredentialOptions = {
    challenge,
    rp: {
      name: WEBAUTHN_CONFIG.rpName,
      id: window.location.hostname
    },
    user: {
      id: crypto.getRandomValues(new Uint8Array(16)),
      name: "user@example.com",
      displayName: "User"
    },
    pubKeyCredParams: [{
      type: "public-key",
      alg: WEBAUTHN_CONFIG.supportedAlgorithm
    }],
    authenticatorSelection: {
      authenticatorAttachment: WEBAUTHN_CONFIG.authenticatorAttachment,
      userVerification: WEBAUTHN_CONFIG.userVerification,
      residentKey: WEBAUTHN_CONFIG.residentKey,
    },
    timeout: WEBAUTHN_CONFIG.timeout,
    attestation: WEBAUTHN_CONFIG.attestation
  };

  const credential = await navigator.credentials.create({
    publicKey: createCredentialOptions
  });

  if (!credential) {
    throw new Error('Failed to create passkey');
  }

  const publicKey = await extractPublicKey(credential.response);

  return {
    credentialId: arrayBufferToBase64(credential.rawId),
    publicKey
  };
};

const extractPublicKey = async (attestationResponse) => {
  const attestationObject = CBOR.decode(attestationResponse.attestationObject);
  const authData = new Uint8Array(attestationObject.authData);
  const publicKeyOffset = 37;
  return authData.slice(publicKeyOffset, publicKeyOffset + 65);
};
