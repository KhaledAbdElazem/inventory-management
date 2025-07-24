# Authentication Setup Guide

## 🔧 Google OAuth Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (or Google Identity API)
4. Go to **"Credentials"** → **"Create Credentials"** → **"OAuth 2.0 Client ID"**

### 2. Configure OAuth Client

**Application Type:** Web application

**Authorized JavaScript origins:**
```
http://localhost:3000
https://inventory-management-snowy-six.vercel.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://inventory-management-snowy-six.vercel.app/api/auth/callback/google
```

### 3. Environment Variables

#### For Local Development (.env.local):
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_key_at_least_32_characters_long
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### For Production (Vercel Environment Variables):
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=https://inventory-management-snowy-six.vercel.app
NEXTAUTH_SECRET=your_super_secret_key_at_least_32_characters_long
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🚀 Deployment Steps

### Step 1: Set up Vercel Environment Variables
1. Go to your Vercel dashboard
2. Select your project (`inventory-management-snowy-six`)
3. Go to **Settings** → **Environment Variables**
4. Add all the environment variables listed above

### Step 2: Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Or use an online generator like: https://generate-secret.vercel.app/32

### Step 3: Update Google OAuth Settings
Make sure your Google OAuth client has both development and production URLs configured.

### Step 4: Deploy to Vercel
```bash
npm run build
# Then push to your Git repository
# Vercel will automatically deploy
```

## 🔒 Security Notes

1. **Never commit `.env.local`** to your repository
2. **Use different OAuth clients** for development and production (recommended)
3. **Keep your secrets secure** - only add them to Vercel's environment variables
4. **Regularly rotate your secrets** for production applications

## 🧪 Testing

### Local Testing:
```bash
npm run dev
# Visit http://localhost:3000
```

### Production Testing:
```bash
# After deployment, visit:
# https://inventory-management-snowy-six.vercel.app
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error:**
   - Check that your Google OAuth redirect URIs exactly match your configured URLs
   - Ensure no trailing slashes

2. **"NEXTAUTH_URL" not set:**
   - Make sure NEXTAUTH_URL is set in your environment variables
   - For production, it should be `https://inventory-management-snowy-six.vercel.app`

3. **Database connection issues:**
   - Verify your MongoDB connection string is correct
   - Make sure your database allows connections from Vercel's IP ranges

4. **Authentication not working in production:**
   - Check Vercel function logs in your dashboard
   - Verify all environment variables are set correctly
   - Ensure Google OAuth client is configured for production domain
