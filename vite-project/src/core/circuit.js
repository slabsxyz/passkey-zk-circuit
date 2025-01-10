import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';
import circuit from '../../../auth_with_passkey/target/auth_with_passkey.json';

export const initializeCircuit = () => ({
  backend: new BarretenbergBackend(circuit),
  noir: new Noir(circuit)
});

export const prepareCircuitInput = (authData) => ({
  public_key_x: padArray(authData.public_key_x.slice(0, 32), 32),
  public_key_y: padArray(authData.public_key_y.slice(0, 32), 32),
  signature: padArray(authData.signature.slice(0, 64), 64),
  challenge: padArray(authData.challenge.slice(0, 32), 32),
  challenge_index: authData.challengeIndex,
  authenticator_data: {
    len: Math.min(authData.authenticatorData.length, 64),
    storage: createPaddedArray(authData.authenticatorData, 64)
  },
  client_data_json: {
    len: Math.min(authData.clientDataJSON.length, 256),
    storage: createPaddedArray(authData.clientDataJSON, 256)
  }
});

const padArray = (arr, length) => {
  const result = Array.from(arr);
  while (result.length < length) result.push(0);
  return result;
};

const createPaddedArray = (data, length) =>
  Array(length).fill(0).map((_, i) => i < data.length ? data[i] : 0);
