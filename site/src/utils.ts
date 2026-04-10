/** Prefix a path with the configured base URL so links work for both root-domain and subpath deployments. */
export function joinBaseUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedBase + normalizedPath;
}

export function url(path: string): string {
  return joinBaseUrl(import.meta.env.BASE_URL, path);
}
