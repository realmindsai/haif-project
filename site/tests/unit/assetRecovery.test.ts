import { describe, expect, it } from 'vitest';
import {
  classifyLegacyUrl,
  isRecoverableLegacyUrl,
  toEvergreenFilename,
} from '../../scripts/lib/assetRecovery.mjs';

describe('asset recovery helpers', () => {
  it('classifies legacy image assets', () => {
    expect(
      classifyLegacyUrl(
        'http://popa4ease.com/site/wp-content/uploads/2018/08/risk-score.png',
      ),
    ).toBe('image');
  });

  it('classifies legacy download assets', () => {
    expect(
      classifyLegacyUrl(
        'http://popa4ease.com/site/wp-content/uploads/2019/05/PONV-study-data-extraction-template.xlsx',
      ),
    ).toBe('download');
  });

  it('recognizes recoverable legacy config assets', () => {
    expect(
      isRecoverableLegacyUrl(
        'http://popa4ease.com/site/wp-content/uploads/imagelinks/1/config.json?ver=1558022196',
      ),
    ).toBe(true);
  });

  it('maps legacy assets to evergreen filenames', () => {
    expect(
      toEvergreenFilename({
        sourcePage: 'http://popa4ease.com/site/index.php/exploration/',
        legacyUrl: 'http://popa4ease.com/site/wp-content/uploads/2018/08/risk-score.png',
        itemType: 'image',
      }),
    ).toBe('exploration_ponv_risk_score.png');
  });
});
