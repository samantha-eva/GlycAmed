import { test, expect } from '@playwright/test';

test('la page d\'accueil affiche le titre', async ({ page }) => {
    await page.goto('http://localhost:8080/');

await expect(
  page.getByRole('heading', { name: 'Bienvenue sur Glycamed' })
).toBeVisible();

});