// tests/e2e/dashboard.spec.ts
import { test, expect, Page } from '@playwright/test';
import { CONFIG } from "../../config/constants";

// Helper pour simuler une connexion
async function loginWithMock(page: Page) {
  // Mock l'API de login
  await page.route('**/api/auth/login', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ 
        user: { email: 'test@example.com' }, 
        token: 'fake-token-123' 
      })
    });
  });

  await page.goto(`${CONFIG.BASE_URL}/authentification/login.html`);
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Mot de passe').fill('password123');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  
  await expect(page).toHaveURL(/index\.html/);
}

test.describe('Page d\'accueil Glycamed', () => {

  test('affiche le titre de bienvenue', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/index.html`);

    await expect(
      page.getByRole('heading', { name: 'Bienvenue sur Glycamed' })
    ).toBeVisible();
  });

  test('affiche les jauges de consommation', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/index.html`);

    // Vérifier les 3 catégories dans le tableau
    await expect(page.getByRole('cell', { name: 'Sucre' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Caféine' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Calorie' })).toBeVisible();

    // Vérifier les limites affichées
    await expect(page.getByText('/50g')).toBeVisible();
    await expect(page.getByText('/400mg')).toBeVisible();
    await expect(page.getByText('/2000kcal')).toBeVisible();
  });

  test('affiche les graphiques', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/index.html`);

    // Vérifier les titres des graphiques
    await expect(page.getByText('Consommation de sucre sur la semaine')).toBeVisible();
    await expect(page.getByText('Consommation de caféïne sur la semaine')).toBeVisible();
    await expect(page.getByText('Prise de calorie sur la semaine')).toBeVisible();

    // Vérifier que les canvas existent
    await expect(page.locator('#myChart')).toBeVisible();
    await expect(page.locator('#myPieChart')).toBeVisible();
    await expect(page.locator('#myLineChart')).toBeVisible();
  });

  test('bouton "Je balance mon Amed" redirige vers rapport', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/index.html`);

    await page.getByRole('button', { name: 'Je balance mon Amed' }).click();

    await expect(page).toHaveURL(/rapport\.html/);
  });

  test('bouton stats avancées redirige vers statistiques', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/index.html`);

    await page.getByRole('button', { name: 'Voir ses stats avancées' }).click();

    await expect(page).toHaveURL(/statistiques\.html/);
  });

});

test.describe('Dashboard après connexion', () => {

  test('accès à la page après login', async ({ page }) => {
    await loginWithMock(page);

    // Vérifie qu'on est bien sur la page d'accueil
    await expect(
      page.getByRole('heading', { name: 'Bienvenue sur Glycamed' })
    ).toBeVisible();
  });

});