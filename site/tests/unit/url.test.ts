import { describe, expect, it } from 'vitest';
import { joinBaseUrl } from '../../src/utils';

describe('joinBaseUrl', () => {
  it('keeps root-domain asset paths rooted at slash', () => {
    expect(joinBaseUrl('/', '/images/hero-banner.jpg')).toBe(
      '/images/hero-banner.jpg',
    );
  });

  it('preserves an existing subpath deployment when present', () => {
    expect(joinBaseUrl('/haif-project/', '/images/hero-banner.jpg')).toBe(
      '/haif-project/images/hero-banner.jpg',
    );
  });

  it('normalizes paths that are missing a leading slash', () => {
    expect(
      joinBaseUrl('/', 'downloads/ponv_data_extraction_template.xlsx'),
    ).toBe('/downloads/ponv_data_extraction_template.xlsx');
  });
});
