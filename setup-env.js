#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

console.log('🔧 Setting up environment variables for authentication...\n');

// Generate a secure NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

const envContent = `# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
# Change this to https://inventory-management-snowy-six.vercel.app for production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${nextAuthSecret}

# Google OAuth Credentials
# Get these from https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
`;

fs.writeFileSync('.env.local', envContent);

console.log('✅ Created .env.local file with a secure NEXTAUTH_SECRET');
console.log('🔑 Generated NEXTAUTH_SECRET:', nextAuthSecret);
console.log('\n📝 Next steps:');
console.log('1. Set up Google OAuth at https://console.cloud.google.com/');
console.log('2. Update MONGODB_URI with your database connection string');
console.log('3. Add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
console.log('4. For production, change NEXTAUTH_URL to https://inventory-management-snowy-six.vercel.app');
console.log('\n📖 Check AUTHENTICATION_SETUP.md for detailed instructions');
