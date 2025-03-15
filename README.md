# 🐾 Macedonian Pet Marketplace

A modern online marketplace for pets in Macedonia built with Next.js and Supabase.

## 🚀 Features

- Browse and search for pets available for adoption/sale
- Filter by pet type, location, price range
- User authentication and profiles
- Post pet listings with photos and details
- Direct messaging between buyers and sellers
- Responsive design for all devices
- Dark/Light mode support

## 💻 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Tailwind CSS with custom theming
- **Deployment**: Vercel

## Google OAuth Setup

To enable Google authentication with Supabase:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Set the application type to "Web application"
6. Add the following authorized redirect URIs:
   - `https://bsyrobgaeadswftzzvay.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
   - Your production URL's callback path (e.g., `https://yourdomain.com/auth/callback`)
7. Click "Create" and note your Client ID and Client Secret
8. In your Supabase dashboard:
   - Go to Authentication > Providers
   - Enable Google
   - Enter your Client ID and Client Secret
   - Save changes

Remember to update your `.env.local` file with the correct `NEXT_PUBLIC_SITE_URL` for your environment.
