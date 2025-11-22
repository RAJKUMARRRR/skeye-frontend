# Clerk Authentication Setup Guide

This guide will walk you through setting up Clerk authentication for all three Skeye applications: Marketing Site, Web App, and Mobile App.

## Prerequisites

- Clerk account (sign up at https://clerk.com)
- Node.js 18+ installed
- All dependencies installed (`yarn install`)

## Step 1: Create Clerk Application

1. Go to https://dashboard.clerk.com
2. Click "Create Application"
3. Name it "Skeye" or "Skeye Production"
4. Select authentication methods:
   - ✅ Phone number
   - ✅ Google OAuth
5. Click "Create Application"

## Step 2: Configure Environment Variables

### Marketing App (`apps/marketing/.env.local`)

Copy the `.env.example` file and update with your Clerk keys:

```bash
cp apps/marketing/.env.example apps/marketing/.env.local
```

Update the following variables:
```env
# Get these from Clerk Dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Domain Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://app.skeye.io/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://app.skeye.io/dashboard
```

### Web App (`apps/web/.env`)

Copy the `.env.example` file:

```bash
cp apps/web/.env.example apps/web/.env
```

Update:
```env
# Get this from Clerk Dashboard → API Keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Keep your existing settings
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=http://localhost:8000
```

### Mobile App (`apps/mobile/.env`)

Copy the `.env.example` file:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Update:
```env
# Get this from Clerk Dashboard → API Keys
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Keep your existing settings
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## Step 3: Configure Clerk Dashboard Settings

### A. Enable Phone Authentication

1. Go to Clerk Dashboard → User & Authentication → Email, Phone, Username
2. Toggle ON "Phone number"
3. Set as required or optional based on your needs
4. Configure SMS provider (Clerk provides test SMS for development)

### B. Enable Google OAuth

1. Go to Clerk Dashboard → User & Authentication → Social Connections
2. Click on "Google"
3. Two options:

   **Option A: Use Clerk's Development Keys (Easiest for testing)**
   - Simply toggle ON "Google"
   - Clerk will use their development OAuth credentials
   - **Note:** This only works in development

   **Option B: Use Your Own Google OAuth (For production)**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized redirect URIs:
     ```
     https://accounts.clerk.dev/v1/oauth_callback
     ```
   - Copy Client ID and Client Secret
   - Paste into Clerk Dashboard
   - Toggle ON "Google"

### C. Configure Domain Settings

1. Go to Clerk Dashboard → Paths
2. Set the following paths:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - User profile: `/user`
   - After sign in URL: `/dashboard` (for web app)
   - After sign up URL: `/dashboard` (for web app)

### D. Configure Domain for Marketing Site

1. Go to Clerk Dashboard → Domains
2. Add your production domain: `skeye.io`
3. Add your web app domain: `app.skeye.io`

For local development, Clerk automatically works with `localhost`.

## Step 4: Configure Mobile App OAuth Redirect

### For Expo Development

1. In Clerk Dashboard → Social Connections → Google
2. Add redirect URL for mobile:
   ```
   exp://localhost:8081/--/expo-auth-session
   ```

### For Production Build

After you create a production build with EAS:

1. Get your app scheme from `app.json` (should be something like `skeye://`)
2. Add to Clerk Dashboard redirect URLs:
   ```
   skeye://expo-auth-session
   ```

## Step 5: Update app.json for Mobile App

Update `apps/mobile/app.json` to include Clerk configuration:

```json
{
  "expo": {
    "scheme": "skeye",
    "plugins": [
      "@clerk/clerk-expo"
    ]
  }
}
```

## Step 6: Start Applications

```bash
# Marketing site
yarn dev:marketing

# Web app
yarn dev:web

# Mobile app
yarn mobile
```

## Testing Authentication

### Testing in Marketing Site (http://localhost:3000)

1. Go to http://localhost:3000/sign-in
2. Try signing in with:
   - Phone number (enter test number, use Clerk test code)
   - Google (use Clerk's dev credentials or your OAuth)

### Testing in Web App (http://localhost:3001)

1. Go to http://localhost:3001/sign-in
2. Test both authentication methods
3. After successful login, you should be redirected to `/dashboard`

### Testing in Mobile App

1. Start Expo: `yarn mobile`
2. Open in simulator/device
3. Navigate to sign in screen
4. Test phone and Google authentication

## Phone Number Testing

For development, Clerk provides test phone numbers:

- **Test Phone:** Use any phone number
- **Test Code:** Check Clerk Dashboard → Users → SMS logs for the verification code
- Or use Clerk's magic development codes (check Clerk docs)

## Troubleshooting

### Issue: "Missing Publishable Key"

**Solution:** Make sure you've created the `.env` files and added your Clerk publishable key.

### Issue: OAuth not working

**Solution:**
1. Check that Google OAuth is enabled in Clerk Dashboard
2. Verify redirect URLs are correct
3. For mobile, ensure `expo-auth-session` and `expo-web-browser` are installed

### Issue: "Redirect URL mismatch"

**Solution:** Make sure your redirect URLs in Clerk Dashboard match:
- Marketing: `http://localhost:3000/*` (dev)
- Web App: `http://localhost:3001/*` (dev)
- Mobile: `exp://localhost:8081/--/expo-auth-session` (dev)

### Issue: Phone authentication not receiving codes

**Solution:**
1. Check Clerk Dashboard → SMS logs
2. For development, use Clerk's test phone numbers
3. In production, configure a proper SMS provider (Twilio, etc.)

### Issue: Mobile - "Invalid hook call" or "Cannot read property 'useContext' of null"

**Solution:** This happens when there are multiple React instances in the monorepo. The fix has already been applied:
1. `react-dom` has been added to mobile app dependencies
2. `metro.config.js` forces single React instance resolution
3. Clear the Metro cache and restart:
   ```bash
   cd apps/mobile
   rm -rf node_modules/.cache
   yarn start --clear
   ```

## Production Deployment

### Marketing Site & Web App

1. Add production environment variables to your deployment platform (Vercel, Netlify, etc.)
2. Update Clerk Dashboard → Domains with production domains
3. Update redirect URLs in Clerk Dashboard

### Mobile App

1. Build with EAS: `eas build --platform all`
2. Update `app.json` with production scheme
3. Add production redirect URLs to Clerk Dashboard:
   ```
   skeye://expo-auth-session
   ```

## Security Notes

- **Never commit `.env` files** to version control
- Keep `.env.example` files for reference
- Use different Clerk applications for development and production
- Rotate secret keys regularly
- Enable MFA for admin users in production

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Quickstart](https://clerk.com/docs/quickstarts/react)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Expo Quickstart](https://clerk.com/docs/quickstarts/expo)
- [Google OAuth Setup](https://clerk.com/docs/authentication/social-connections/google)
- [Phone Authentication](https://clerk.com/docs/authentication/configuration/phone)

## Support

If you encounter issues:
1. Check [Clerk's Status Page](https://status.clerk.com)
2. Search [Clerk's Discord Community](https://clerk.com/discord)
3. Review [Clerk's GitHub Discussions](https://github.com/clerkinc/javascript/discussions)
