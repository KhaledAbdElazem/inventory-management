# 🚀 Vercel Environment Variables

Copy these **EXACT** values to your Vercel project settings:

**Project:** `inventory-management-snowy-six`
**URL:** https://inventory-management-snowy-six.vercel.app

## Environment Variables to Add:

### 1. MONGODB_URI
```
your_mongodb_connection_string
```
*(Replace with your actual MongoDB connection string)*

### 2. NEXTAUTH_URL
```
https://inventory-management-snowy-six.vercel.app
```

### 3. NEXTAUTH_SECRET
```
cPM6oTVJCHLEbekzJCpgsdfLxtSstxgKpAfp6a3/U8M=
```

### 4. GOOGLE_CLIENT_ID
```
36191395071-tpbp7ptq3eor99fnu0oiku04unb25bjq.apps.googleusercontent.com
```

### 5. GOOGLE_CLIENT_SECRET
```
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
```

## ⚠️ Security Notes:
- **NEVER** commit these values to your repository
- **ONLY** add them to Vercel's environment variables dashboard
- The `.env.local` file is for local development only

## 📝 How to Add to Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project: `inventory-management-snowy-six`
3. Go to **Settings** → **Environment Variables**
4. Add each variable above **one by one**
5. Set **Environment** to "Production, Preview, and Development"
6. Click **Save**

## ✅ Your Google OAuth is Already Configured!
Your OAuth client already has the correct redirect URIs:
- ✅ `http://localhost:3000/api/auth/callback/google` (for development)  
- ✅ `https://inventory-management-snowy-six.vercel.app/api/auth/callback/google` (for production)

## 🎯 Next Steps:
1. Add your MongoDB connection string to `MONGODB_URI`
2. Add all environment variables to Vercel
3. Push your code to trigger a deployment
4. Test at https://inventory-management-snowy-six.vercel.app
