# Deployment Instructions for Netlify

## Changes Made for Netlify Deployment

1. **Updated `next.config.ts`**:
   - Added `output: 'export'` for static export
   - Added `trailingSlash: true`
   - Added `unoptimized: true` for images

2. **Created `netlify.toml`**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 18
   - Redirect configuration for SPA routing

3. **Removed API routes**:
   - API routes are not compatible with static export
   - If you need server functions, consider using Netlify Functions

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Environment Variables in Netlify**:
   - Go to Site settings → Environment variables
   - Add these variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://dpqjjmrhqwwjlpgvqgve.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `[your anon key]`
     - `SUPABASE_SERVICE_ROLE_KEY`: `[your service key]`

4. **Deploy**:
   - Netlify will automatically detect the `netlify.toml` configuration
   - The build should complete successfully
   - Your site will be available at the provided Netlify URL

## Local Testing

To test the static export locally:
```bash
npm run build
# Serve the out directory with a static server
npx serve out
```

## Notes

- The application is now configured for static export
- All pages are pre-rendered at build time
- API functionality has been removed (consider Netlify Functions if needed)
- Images are unoptimized for static export compatibility
