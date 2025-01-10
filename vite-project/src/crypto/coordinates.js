export const getXYCoordinates = (publicKeyBase64) => {
  const pubKeyAsBytes = new Uint8Array(
    atob(publicKeyBase64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const pubKeyPoint = Array.from(pubKeyAsBytes.slice(-128));
  return {
    x: new Uint8Array(pubKeyPoint.slice(0, 32)),
    y: new Uint8Array(pubKeyPoint.slice(-32))
  };
};
