import { defineMiddleware } from 'astro:middleware';
import { getSession } from 'auth-astro/server';

const privateRoutes = ['/protected'];
const publicRoutes = ['/login', '/register'];

export const onRequest = defineMiddleware(
  async ({ url, request, locals, redirect }, next) => {
    const session = await getSession(request);
    const isLoggedIn = !!session;
    const user = session?.user;

    //TODO:
    locals.isLoggedIn = isLoggedIn;
    locals.user = null;
    locals.isAdmin = false;

    if (user) {
      //TODO:
      locals.user = {
        name: user.name!,
        email: user.email!,
      };

      locals.isAdmin = user.role === 'admin';
    }

    //TODO: Whe need to control the access to the routes based on the roles
    if (!locals.isAdmin && url.pathname.startsWith('/dashboard')) {
      return redirect('/');
    }

    if (isLoggedIn && publicRoutes.includes(url.pathname)) {
      return redirect('/');
    }

    return next();
  }
);
