import sharp from 'sharp';

const svgIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0ea5e9"/>
  <path d="M50 15 C50 15 28 42 28 57 C28 69.7 37.9 80 50 80 C62.1 80 72 69.7 72 57 C72 42 50 15 50 15Z"
        fill="white" opacity="0.95"/>
  <ellipse cx="43" cy="53" rx="6" ry="9" fill="#0ea5e9" opacity="0.35" transform="rotate(-20 43 53)"/>
</svg>`;

await sharp(Buffer.from(svgIcon(192))).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(Buffer.from(svgIcon(512))).resize(512, 512).png().toFile('public/icon-512.png');

console.log('Icons generated: public/icon-192.png and public/icon-512.png');
