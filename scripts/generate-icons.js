
const fs = require('fs');
const path = require('path');

// Criar ícones PWA básicos como arquivos SVG
const createIcon = (size, outputPath) => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#007bff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">N</text>
</svg>`;
  
  fs.writeFileSync(outputPath, svg);
  console.log(`✅ Criado: ${outputPath}`);
};

// Criar favicon como arquivo SVG
const createFavicon = () => {
  const svg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="3" fill="#007bff"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">N</text>
</svg>`;
  
  fs.writeFileSync('public/favicon.svg', svg);
  console.log(`✅ Criado: public/favicon.svg`);
};

// Gerar os ícones
createIcon(192, 'public/icon-192x192.svg');
createIcon(512, 'public/icon-512x512.svg');
createFavicon();

console.log('🎉 Todos os ícones PWA foram criados com sucesso!');
