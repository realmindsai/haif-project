/** Prefix a path with the configured base URL so links work on GitHub Pages subpaths. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}
