import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
 
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  console.log("Proxy middleware hit for URL:", request.nextUrl.pathname);
  const refCode = request.nextUrl.searchParams.get('ref');
  
  if (refCode) {
    const backendUrl = process.env.INTERNAL_API_URL || 'http://127.0.0.1:8080';
    const url = request.nextUrl.clone();
    url.searchParams.delete('ref');

    try {
      const trackPromise = fetch(`${backendUrl}/api/affiliate-track/click?ref_code=${refCode}`);
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      
      const res = await Promise.race([trackPromise, timeoutPromise]);
      
      if (res instanceof Response && res.ok) {
        const data = await res.json();
        if (data.tracked && data.sessionToken) {
          const response = NextResponse.redirect(url);
          
          response.cookies.set('aff_session', data.sessionToken, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          });
          
          response.cookies.set('aff_ref_code', refCode, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          });

          return response;
        }
      }
    } catch {
    }
    
    const response = NextResponse.redirect(url);
    return response;
  }

  return intlMiddleware(request);
}
 
export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};