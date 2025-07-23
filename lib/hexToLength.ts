// hex can be with prefix  - `0x{string}` - or without it - `{string}`
export default function hexToLength(hex: string) {
  const length = hex.startsWith('0x') ? hex.length - 2 : hex.length;
  return length / 2;
}
