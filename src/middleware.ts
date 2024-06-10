import { NextRequest, NextResponse } from 'next/server';
import { cookieName as lngCookieName, fallbackLng } from '@/i18n/settings';

const themeCookieName = 'theme';

export const middleware = (req: NextRequest) => {
  let lng = fallbackLng;
  let theme = 'light';
  const response = NextResponse.next();

  if (req.cookies.has(lngCookieName)) {
    lng = req.cookies.get(lngCookieName)!.value;
  }

  if (req.cookies.has(themeCookieName)) {
    theme = req.cookies.get(themeCookieName)!.value;
  }

  if (!/^\/_next/.test(req.nextUrl.pathname)) {
    response.cookies
      .set({
        name: 'lng',
        value: lng,
        path: '/'
      })
      .set({
        name: 'theme',
        value: theme,
        path: '/'
      });
  }

  return response;
};
