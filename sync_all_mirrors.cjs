const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourcePath = 'E:/portlandpunk/client/public/rain-blade.html';
const content = fs.readFileSync(sourcePath, 'utf8');

const mirrors = [
  'E:/portlandpunk/index.html',
  'E:/portlandpunk/rain-blade.html',
  'E:/portlandpunk/showcase/rain-blade.html',
  'E:/portlandpunk/client/itch-bundle/index.html',
  'C:/Users/N0N3Follows/.gemini/antigravity/scratch/userpages/index.html',
  'C:/Users/N0N3Follows/.gemini/antigravity/scratch/userpages/rain-blade.html'
];

mirrors.forEach(dest => {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Synchronized mirror:', dest, `(${content.length} bytes)`);
});

// Rebuild itch bundle zip from E:/portlandpunk/client/itch-bundle
const itchBundleDir = 'E:/portlandpunk/client/itch-bundle';
const itchZipPath = 'E:/portlandpunk/client/portland-rain-blade-itch.zip';

try {
  if (fs.existsSync(itchZipPath)) fs.unlinkSync(itchZipPath);
  execSync(`powershell -Command "Compress-Archive -Path '${itchBundleDir}/*' -DestinationPath '${itchZipPath}' -Force"`);
  console.log('Rebuilt itch bundle zip:', itchZipPath);
} catch (e) {
  console.warn('Zip rebuild warning:', e.message);
}

console.log('All mirrors synchronized successfully!');
