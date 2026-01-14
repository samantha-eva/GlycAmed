// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { CONFIG } from "../../config/constants";

test.describe('Authentification Glycamed', () => {
  
  test('connexion avec identifiants valides', async ({ page }) => {
    // Mock API pour simuler une connexion réussie
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
  });

  test('affiche une erreur avec mauvais mot de passe', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/authentification/login.html`);

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Mot de passe').fill('wrongpassword');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    const errorMsg = page.locator('#errorMessage');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).not.toBeEmpty();
  });

  test('affiche une erreur si champs vides', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/authentification/login.html`);

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Mot de passe').fill('');

    await page.evaluate(() => {
      document.getElementById('loginForm')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    await expect(page.locator('#errorMessage')).toContainText(
      'Veuillez remplir tous les champs'
    );
  });

  test('affiche une erreur si serveur injoignable', async ({ page }) => {
    await page.route('**/api/auth/login', route => route.abort());

    await page.goto(`${CONFIG.BASE_URL}/authentification/login.html`);
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Mot de passe').fill('password123');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page.locator('#errorMessage')).toContainText(
      'Impossible de contacter le serveur'
    );
  });

});

test.describe('Inscription Glycamed', () => {

  test('inscription réussie avec données valides', async ({ page }) => {
    // Mock API pour simuler une inscription réussie
    await page.route('**/api/auth/register', route => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ 
          user: { email: 'nouveau@example.com' }, 
          token: 'fake-token-456' 
        })
      });
    });

   await page.goto(`${CONFIG.BASE_URL}/authentification/register.html`);

    await page.getByLabel('Email').fill('nouveau@example.com');
    // Utiliser l'ID directement pour éviter l'ambiguïté
    await page.locator('#password').fill('password123');
    await page.locator('#confirm-password').fill('password123');
    await page.getByRole('button', { name: "S'inscrire" }).click();

    await expect(page).toHaveURL(/index\.html/);
  });

  test('erreur si mots de passe différents', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/authentification/register.html`);
    await page.getByLabel('Email').fill('test@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('#confirm-password').fill('autrechose');
    await page.getByRole('button', { name: "S'inscrire" }).click();

    await expect(page.locator('#errorMessage')).toContainText(
      'Les mots de passe ne correspondent pas'
    );
  });

  test('erreur si champs vides', async ({ page }) => {
    await page.goto(`${CONFIG.BASE_URL}/authentification/register.html`);

    await page.getByLabel('Email').fill('test@example.com');

    await page.evaluate(() => {
      document.getElementById('registerForm')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });

    await expect(page.locator('#errorMessage')).toContainText(
      'Veuillez remplir tous les champs'
    );
  });

  test('lien vers page de connexion fonctionne', async ({ page }) => {
   await page.goto(`${CONFIG.BASE_URL}/authentification/register.html`);
    
    await page.getByRole('link', { name: /Connectez-vous ici/i }).click();
    
    await expect(page).toHaveURL(/login\.html/);
  });

});