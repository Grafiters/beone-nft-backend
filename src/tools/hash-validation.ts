export function isValidHash(hash: string): boolean {
  const hexPattern = /^0x[0-9A-Fa-f]+$/;
  return hexPattern.test(hash);
}
