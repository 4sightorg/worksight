import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export function middleware(request: NextRequest) {
	return updateSession(request);
}

// Ignore static assets and Next internals for performance
export const config = {
	matcher: [
		'/((?!_next|static|favicon.ico|robots.txt|sitemap.xml|images|assets|public|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|css|js|map)$).*)',
	],
};
