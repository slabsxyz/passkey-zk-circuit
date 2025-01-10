export const validateCircuitInput = (input) => {
  const validateLength = (field, arr, expectedLength) => {
    if (arr.length !== expectedLength) {
      throw new Error(`Invalid ${field} length`);
    }
  };

  const validateU8Array = (arr) =>
    arr.every(n => Number.isInteger(n) && n >= 0 && n < 256);

  validateLength('public_key_x', input.public_key_x, 32);
  validateLength('public_key_y', input.public_key_y, 32);
  validateLength('signature', input.signature, 64);
  validateLength('challenge', input.challenge, 32);

  if (input.authenticator_data.len > 64) {
    throw new Error('authenticator_data too long');
  }
  if (input.client_data_json.len > 256) {
    throw new Error('client_data_json too long');
  }

  ['public_key_x', 'public_key_y', 'signature', 'challenge'].forEach(field => {
    if (!validateU8Array(input[field])) {
      throw new Error(`Invalid ${field} values`);
    }
  });
};
