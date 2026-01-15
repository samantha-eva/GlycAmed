# GlycAmed

## Description

**GlycAmed** est une application web collaborative permettant de suivre la consommation de sucre et de caféine d’un étudiant nommé Amed.  
Chaque étudiant peut contribuer en temps réel pour enregistrer ce qu’il observe Amed consommer. L’objectif est de sensibiliser Amed à sa consommation et de générer des statistiques et rapports de santé.

---

## Prérequis

- Docker et docker-compose  
- Node.js 18+ (pour développement local sans Docker)  
- Navigateur moderne pour le frontend  

---

## Installation et lancement


Ajouter le .env en prenant appuie sur le .env.example
Ajouter le configSentry dans le frontend/configSentry.js basé sur le configSentry.js.example

Vérifier que les ports 3000 et 8080 ne soit pas déjà utilisé.

Lancer l'environnement docker avec docker-compose-up
Se connecter sur localhost:8080 sur son navigateur