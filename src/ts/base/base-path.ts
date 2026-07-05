function detectBasePath(): string {
  const { pathname } = window.location;

  if (pathname === '/' || pathname.startsWith('/catalog') || pathname.startsWith('/cart') || /^\/\d+/.test(pathname)) {
    return '';
  }

  const match = pathname.match(/^\/[^/]+/);
  return match ? match[0] : '';
}

export const BASE_PATH = detectBasePath();

export function getAppPathname(pathname?: string): string {
  const path = pathname ?? new URL(window.location.href).pathname;

  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    const stripped = path.slice(BASE_PATH.length);
    return stripped || '/';
  }

  return path;
}

export function toAppPath(route: string): string {
  if (!route.startsWith('/')) {
    return route;
  }

  return `${BASE_PATH}${route}`;
}
