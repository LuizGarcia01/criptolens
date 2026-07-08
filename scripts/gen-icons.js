const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

// CRC32 table
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function makePNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  // Draw icon: purple rounded-square bg + golden ₿ area
  const raw = Buffer.alloc(size * (1 + size * 4));
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42; // circle radius

  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 4);
    raw[row] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const px = row + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= r) {
        // Purple-to-indigo gradient
        const t = (x + y) / (size * 2);
        raw[px]     = Math.round(124 + t * (79 - 124)); // R: #7C3AED → #4F46E5
        raw[px + 1] = Math.round(58  + t * (70 - 58));  // G
        raw[px + 2] = Math.round(237 + t * (229 - 237)); // B
        raw[px + 3] = 255; // A opaque
      } else {
        // Transparent outside circle
        raw[px] = raw[px + 1] = raw[px + 2] = raw[px + 3] = 0;
      }
    }
  }

  const idat = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, "icon-192.png"), makePNG(192));
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), makePNG(512));

console.log("✅ PWA icons generated: icon-192.png, icon-512.png");
