import { expect, test } from '@playwright/test';

test('homepage hero and exploration intervention interactions render recovered content', async ({
  page,
}) => {
  await page.goto('/');
  const heroImage = page.getByRole('img', {
    name: /patient recovering in a hospital bed after surgery/i,
  });
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute('src', '/images/hero-banner.jpg');
  expect(
    await heroImage.evaluate((image) =>
      image instanceof HTMLImageElement ? image.naturalWidth : 0,
    ),
  ).toBeGreaterThan(0);

  const explorationLink = page.getByRole('link', {
    name: /phase 1: exploration/i,
  });
  await Promise.all([
    page.waitForURL('**/framework/exploration/'),
    explorationLink.click(),
  ]);
  expect(new URL(page.url()).pathname).toBe('/framework/exploration/');
  await expect(page.getByRole('heading', { name: /intervention/i })).toBeVisible();

  const manualAcupressureRow = page
    .locator('tbody tr')
    .filter({ hasText: 'Manual Acupressure' });
  await manualAcupressureRow.scrollIntoViewIfNeeded();
  const manualAcupressureDetails = manualAcupressureRow.locator(
    'details.comparison-toggle',
  );
  await manualAcupressureDetails
    .locator('summary', { hasText: 'View details' })
    .click();

  await expect(
    manualAcupressureDetails.getByText(/avoids needles/i),
  ).toBeVisible();
});
