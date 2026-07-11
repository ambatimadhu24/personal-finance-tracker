import { test, expect } from '@playwright/test';

const username = 'demo_user';
const password = 'DemoPass123!';

test('login flow succeeds and navigates to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('http://127.0.0.1:5175/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await expect(page.getByText('Total Income')).toBeVisible();
});
