import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
 
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const refCode = request.nextUrl.searchParams.get('ref');
  
  if (refCode) {
    try {
      // Track the click on the backend via internal Docker network to avoid loopback issues
      const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:8080';
      const res = await fetch(`${backendUrl}/api/affiliate-track/click?ref_code=${refCode}`, {
        // Edge runtime fetch requires this or default caching
        cache: 'no-store'
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.tracked && data.sessionToken) {
          // Remove ?ref from URL
          const url = request.nextUrl.clone();
          url.searchParams.delete('ref');
          
          // Redirect to the clean URL
          const response = NextResponse.redirect(url);
          
          // Set the session token in a cookie
          response.cookies.set('aff_session', data.sessionToken, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          });
          
          // Save the human-readable code to autofill the UI
          response.cookies.set('aff_ref_code', refCode, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          });

          return response;
        }
      }
    } catch (err) {
      console.error('[Affiliate] Tracking error in middleware:', err);
    }
  }

  // Continue to normal i18n routing
  return intlMiddleware(request);
}
 
export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
