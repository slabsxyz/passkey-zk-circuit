import { WEBAUTHN_CONFIG } from './constants';
import { base64ToArrayBuffer, arrayBufferToBase64 } from '../crypto/conversions';
import { derToRawSignature } from '../crypto/signature';
import { getXYCoordinates } from '../crypto/coordinates';

export const authenticatePasskey = async (challenge, credentialId) => {
  try {
    const assertion = await getAssertion(challenge, credentialId);
    return processAssertion(assertion, challenge);
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
};

const getAssertion = async (challenge, credentialId) => {
  const options = {
    challenge,
    allowCredentials: [{
      type: 'public-key',
      id: base64ToArrayBuffer(credentialId),
      transports: WEBAUTHN_CONFIG.transports
    }],
    timeout: WEBAUTHN_CONFIG.timeout,
    userVerification: WEBAUTHN_CONFIG.userVerification,
    rpId: window.location.hostname
  };

  return navigator.credentials.get({ publicKey: options });
};

const processAssertion = (assertion, challenge) => {
  const response = assertion.response;
  const coordinates = getXYCoordinates(arrayBufferToBase64(assertion.rawId));
  const signature = derToRawSignature(new Uint8Array(response.signature));
  const clientDataJSON = new Uint8Array(response.clientDataJSON);
  const clientDataJSONString = new TextDecoder().decode(clientDataJSON);

  return {
    public_key_x: coordinates.x,
    public_key_y: coordinates.y,
    signature,
    clientDataJSON,
    authenticatorData: new Uint8Array(response.authenticatorData),
    challengeIndex: clientDataJSONString.indexOf('"challenge"'),
    challenge: new Uint8Array(challenge)
  };
};
