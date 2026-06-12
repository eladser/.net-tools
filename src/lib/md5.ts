// MD5 for display only — shown with a deprecation warning in the hash tool.
// Web Crypto doesn't expose MD5, so this stays hand-rolled.
export function md5(input: string): string {
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  const add = (x: number, y: number) => (x + y) >>> 0;

  const bytes = new TextEncoder().encode(input);
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] = (words[i >> 2] || 0) | (bytes[i] << ((i % 4) * 8));
  }
  const bitLen = bytes.length * 8;
  words[bitLen >> 5] = (words[bitLen >> 5] || 0) | (0x80 << (bitLen % 32));
  words[(((bitLen + 64) >>> 9) << 4) + 14] = bitLen;

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const K: number[] = [];
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);

  for (let i = 0; i < words.length; i += 16) {
    const [aa, bb, cc, dd] = [a, b, c, d];
    for (let j = 0; j < 64; j++) {
      let f: number, g: number;
      if (j < 16) { f = (b & c) | (~b & d); g = j; }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * j) % 16; }
      const temp = d;
      d = c; c = b;
      b = add(b, rotateLeft(add(a, add(f, add(K[j], words[i + g] || 0))), S[(j >> 4) * 4 + (j % 4)]));
      a = temp;
    }
    a = add(a, aa); b = add(b, bb); c = add(c, cc); d = add(d, dd);
  }

  const toHex = (x: number) =>
    Array.from({ length: 4 }, (_, i) => ((x >> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('');
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}
