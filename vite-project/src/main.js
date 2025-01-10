import { initializeCircuit, prepareCircuitInput } from './core/circuit';
import { validateCircuitInput } from './core/validation';
import { registerPasskey } from './webauthn/register';
import { authenticatePasskey } from './webauthn/authenticate';

document.getElementById('submitGuess').addEventListener('click', async () => {
  try {
    const { backend, noir } = initializeCircuit();
    const authData = await handlePassKey(); if (!authData) return;
    const circuitInput = prepareAndValidateCircuit(authData);
    console.log("circuit input: ", circuitInput);
    const { witness } = await noir.execute(circuitInput);
    console.log("witness: ", witness);
    const proof = await backend.generateProof(witness);
    console.log("Proof: ", proof);
  } catch (err) {
    console.error(err);
  }
});

const getOrCreateCredential = async (challenge) => {
  let credentialId = localStorage.getItem('credentialId');

  if (!credentialId) {
    const credential = await registerPasskey(challenge.buffer);
    if (!credential) throw new Error('Failed to create passkey');
    credentialId = credential.credentialId;
    localStorage.setItem('credentialId', credentialId);
  }

  return credentialId;
};

// Create challenge -> get or create credentials -> Auth passkey
async function handlePassKey() {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  const credentialId = await getOrCreateCredential(challenge);
  if (!credentialId) return null;
  const authData = await authenticatePasskey(challenge.buffer, credentialId);
  if (!authData) return null;

  return authData
}

function prepareAndValidateCircuit(authData) {

  const circuitInput = prepareCircuitInput(authData);
  validateCircuitInput(circuitInput);
  return circuitInput
}