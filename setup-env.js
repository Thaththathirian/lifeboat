#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up environment variables...\n');

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('   If you need to update it, edit the file manually.\n');
} else {
  // Read the template
  const templatePath = path.join(__dirname, 'env-template.txt');
  if (fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(envLocalPath, template);
    console.log('✅ Created .env.local from template');
    console.log('📝 Please edit .env.local with your actual credentials\n');
  } else {
    console.log('❌ env-template.txt not found');
    console.log('   Please create .env.local manually with your Google OAuth credentials\n');
  }
}

console.log('🔐 Environment Setup Instructions:');
console.log('1. Edit .env.local with your Google OAuth credentials');
console.log('2. Never commit .env.local to version control');
console.log('3. The application will automatically use these environment variables');
console.log('4. For production, set up environment variables on your hosting platform\n');

console.log('🚀 You can now run: npm run dev'); 