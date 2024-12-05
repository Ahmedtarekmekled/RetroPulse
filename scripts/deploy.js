const { execSync } = require('child_process');
const path = require('path');

// Build frontend
console.log('Building frontend...');
execSync('cd frontend && npm run build', { stdio: 'inherit' });

// Copy necessary files
console.log('Preparing for deployment...');
execSync('cp vercel.json ./build/', { stdio: 'inherit' });
execSync('cp package.json ./build/', { stdio: 'inherit' });

console.log('Deployment preparation complete!'); 