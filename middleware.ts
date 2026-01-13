import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import * as csp from 'nextjs/csp/index';
import * as middlewares from 'nextjs/middlewares/index';

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  const binaryString = String.fromCharCode(...array);
  return btoa(binaryString);
}

export async function middleware(req: NextRequest) {
  const isPageRequest = req.headers.get('accept')?.includes('text/html');
  const start = Date.now();

  if (!isPageRequest) {
    return;
  }

  const accountResponse = middlewares.account(req);
  if (accountResponse) {
    return accountResponse;
  }

  const res = NextResponse.next();

  const nonce = generateNonce();

  res.cookies.set('x-nonce', nonce, {
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  middlewares.appProfile(req, res);
  middlewares.colorTheme(req, res);
  middlewares.addressFormat(req, res);
  middlewares.scamTokens(req, res);

  const end = Date.now();

  const cspHeader = await csp.get(req, nonce);

  res.headers.append('Content-Security-Policy', cspHeader);
  res.headers.append('Server-Timing', `middleware;dur=${ end - start }`);
  res.headers.append('Docker-ID', process.env.HOSTNAME || '');

  return res;
}

/**
 * Configure which routes should pass through the Middleware.
 */
export const config = {
  matcher: [ '/', '/:notunderscore((?!_next).+)' ],
  // matcher: [
  //   '/((?!.*\\.|api\\/|node-api\\/).*)', // exclude all static + api + node-api routes
  // ],
};
