import { test, expect } from '@playwright/test';
import { cleanupTestUser, ensureTestUser } from './utils/supabaseAdmin';

const email = process.env.TEST_USER_EMAIL || 'teste@teste.com';
const password = process.env.TEST_USER_PASSWORD || '123456';

test.describe('Supabase Auth', () => {
  test.beforeAll(async () => {
    await ensureTestUser(email, password);
  });

  test.afterAll(async () => {
    await cleanupTestUser(email);
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Email').fill(email);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: /sign in|login|enter|continue/i }).click();

    await expect(page.getByText('Choose your workspace')).toBeVisible();
  });
});
