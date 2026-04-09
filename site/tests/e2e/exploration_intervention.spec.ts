import { expect, test } from '@playwright/test';

test('homepage hero and exploration intervention interactions render recovered content', async ({
  page,
}) => {
  await page.goto('/haif-project/');
  const heroImage = page.getByRole('img', {
    name: /patient recovering in a hospital bed after surgery/i,
  });
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveAttribute('src', /hero-banner\.jpg/);
  expect(
    await heroImage.evaluate((image) =>
      image instanceof HTMLImageElement ? image.naturalWidth : 0,
    ),
  ).toBeGreaterThan(0);

  const explorationPage = await page.context().newPage();
  await explorationPage.goto('/haif-project/framework/exploration/');
  await expect(
    explorationPage.getByRole('heading', { name: /intervention/i }),
  ).toBeVisible();

  const manualAcupressureRow = explorationPage
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
