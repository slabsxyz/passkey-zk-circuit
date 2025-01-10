export const derToRawSignature = (derSignature) => {
  if (derSignature[0] !== 0x30) throw new Error('Invalid DER signature');

  const { r, s } = extractRSFromDER(derSignature);

  const rawSignature = new Uint8Array(64);
  rawSignature.set(r, 0);
  rawSignature.set(s, 32);

  return rawSignature;
};

const extractRSFromDER = (derSignature) => {
  let idx = 4;
  const rLength = derSignature[3];
  const r = extractComponent(derSignature, idx, rLength);

  idx += rLength + 2;
  const sLength = derSignature[idx - 1];
  const s = extractComponent(derSignature, idx, sLength);

  return { r, s };
};

const extractComponent = (signature, idx, length) => {
  const component = new Uint8Array(32).fill(0);
  const start = length > 32 ? length - 32 : 0;
  const target = length > 32 ? 0 : 32 - length;
  component.set(signature.slice(idx + start, idx + length), target);
  return component;
};
