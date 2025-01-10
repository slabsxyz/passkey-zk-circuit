export const WEBAUTHN_CONFIG = {
  timeout: 60000,
  rpName: "ZK Passkey Auth",
  userVerification: "preferred",
  attestation: "none",
  authenticatorAttachment: "cross-platform",
  residentKey: "preferred",
  supportedAlgorithm: -7, // ECDSA with SHA-256
  transports: ['usb', 'nfc']
};
