import { expect, test } from '@playwright/test';

test('homepage hero and exploration intervention interactions render recovered content', async ({
  page,
}) => {
  await page.goto('/haif-project/');
  await expect(
    page.getByRole('img', {
      name: /hospital recovery context from the legacy popa4ease homepage/i,
    }),
  ).toBeVisible();

  const explorationPage = await page.context().newPage();
  await explorationPage.goto('/haif-project/framework/exploration/');
  await expect(
    explorationPage.getByRole('heading', { name: /intervention/i }),
  ).toBeVisible();

  await explorationPage.getByText('Manual Acupressure').scrollIntoViewIfNeeded();
  const firstDetails = explorationPage.locator('details.comparison-toggle').first();
  await firstDetails.locator('summary', { hasText: 'View details' }).click();

  await expect(firstDetails.getByText(/avoids needles/i)).toBeVisible();
});
