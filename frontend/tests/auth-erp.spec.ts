import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { cleanupTestUser, ensureErpAdminUser } from './utils/supabaseAdmin';

const adminEmail = process.env.ERP_ADMIN_EMAIL;
const adminPassword = process.env.ERP_ADMIN_PASSWORD;

if (!adminEmail || !adminPassword) {
  throw new Error('Missing ERP_ADMIN_EMAIL or ERP_ADMIN_PASSWORD for ERP tests');
}

const erpUserEmail = `erp.user.${Date.now()}@example.com`;
const erpUserPassword = 'SenhaForte123';

const loginAsAdmin = async (page: Page) => {
  await page.goto('/');
  await page.getByPlaceholder('Email').fill(adminEmail);
  await page.getByPlaceholder('Senha').fill(adminPassword);
  await page.getByRole('button', { name: /entrar|login|continuar/i }).click();
  await expect(page.getByText('Escolha sua área de trabalho')).toBeVisible();
};

test.describe('ERP Users', () => {
  test.beforeAll(async () => {
    await ensureErpAdminUser(adminEmail, adminPassword);
  });

  test.afterAll(async () => {
    await cleanupTestUser(adminEmail);
    await cleanupTestUser(erpUserEmail);
  });

  test('creates and deletes an ERP user', async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByRole('button', { name: /erp/i }).first().click();
    await expect(page.getByText('Escolha um módulo')).toBeVisible();

    await page.getByText('Usuários').first().click();
    await expect(page.getByText('Gestão de usuários e permissões')).toBeVisible();

    await page.getByRole('button', { name: 'Novo Usuário' }).click();

    await page.getByPlaceholder('Ex: João da Silva').fill('ERP User Test');
    await page.getByPlaceholder('joao.silva@empresa.com').fill(erpUserEmail);
    await page.getByPlaceholder('Mínimo 8 caracteres').fill(erpUserPassword);

    await page.getByRole('button', { name: 'Vendas' }).click();
    await page.getByRole('button', { name: 'Criar Usuário' }).click();

    await expect(page.getByText(erpUserEmail)).toBeVisible();

    const userCard = page
      .locator('div.bg-gradient-to-br.from-gray-900.to-black', { hasText: erpUserEmail })
      .first();
    await userCard.getByRole('button', { name: 'Excluir usuário' }).first().click();

    await expect(page.getByText(erpUserEmail)).toHaveCount(0);
  });
});
