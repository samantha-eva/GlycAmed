### Ce que j'ai mis en place :
- [X] Fichier de configuration central
- [X] Service API centralisé  
- [X] Gestion d'état global (Store/Context)
- [X] Composants réutilisables

### Fichiers créés/modifiés :
- cafe.js
- calorie.js
- sugar.js
- service/api.service.js
- js/store/store.js
- authentification/login.html
- authentification/register.html
- js/card-component.js
- header-component.js

+Tous les fichiers avec un header ont été modifié.

### Difficultés rencontrées :
- Gros problèmes en natif pour utiliser les exports et les imports, pas mal de chose à modifier à cause du passage en type module
- Vibe coding qui à mal fonctionné (en étant honnête)

### Temps passé : 6 heures

### ✅ À faire

1. Ajoutez une gestion d'erreur globale
2. Testez en provoquant volontairement une erreur

---

## 📝 Journal — Partie 2

```markdown
## Partie 2 : Refactoring des composants

### Pages améliorées :
- [X] Login/Register
- [~] Dashboard

### Avant/Après notable :
- Avant : Tout n'était pas centralisé, le backend renvoyait les mauvaises erreurs et faisaient les mauvais check (pas de vérification de mdp)
- Après : Login et register centralisé, bonne erreur affiché, usage du store.

### Temps passé : 3 heures

## ✅ Objectifs Partie 3

- [ ] Au moins **3 tests qui passent**
- [ ] Test de connexion (flow complet)
- [ ] Test du dashboard (affichage des données)
- [ ] Savoir lancer les tests et lire le rapport

---



## 📝 Journal — Partie 3

```markdown
## Partie 3 : Tests E2E

### Tests créés :
- [X] Test page d'accueil
- [ ] Test connexion valide
- [ ] Test connexion invalide
- [ ] Test dashboard
- [ ] Autre : ___

### Sélecteurs utilisés :
- getByRole : oui/non
- getByTestId : oui/non (si oui, lesquels ajoutés ?)
- Autres : ...

### Problèmes rencontrés :
- ...

### Temps passé : ___min


## 📝 Journal — Partie 4

```markdown
## Partie 4 : Monitoring Sentry

### Implémentation :
- [X] SDK installé
- [X] DSN configuré
- [ ] Utilisateur identifié après login
- [X] Error Boundary connecté (React)

### Erreur de test visible dans Sentry : oui / non

Oui quand je faisais l'erreur de test, cela fonctionnait.

### Temps passé : 2 heures


Global : 

    Désolé pour ce TP désastreux, nous n'avons pas eu le temps de tout faire (en plus on rend le compte rendu en retard), on a enchaîné problème sur problème en partie lié au fait qu'on était sur du natif et que l'on a pas l'habitude. Ce choix nous a été couteux.