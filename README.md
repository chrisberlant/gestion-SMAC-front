# Gestion SMAC (Front-end)

Cette application permet de gérer des périphériques mobiles (smartphones, tablettes, clés 4G).
Elle a été initialement créée pour simplifier le travail du service téléphonie mobile du Ministère de la Transition écologique et de la Cohésion des territoires.

## API

A utiliser avec le back-end en Node/Express/PostgreSQL stocké sur le repository : <https://github.com/chrisberlant/gestion-SMAC-back>

## Fonctionnalités

-   [x] Changement de thème (sombre/clair)
-   [x] Notifications (toasts) en cas d'échec/succès/annulation
-   [x] Mise en cache des données
-   [x] Mise à jour instantanée de l'interface (_optimistic updates_)
-   [x] Affichage de statistiques
-   [x] Export/import en CSV des données

### Gestion du profil de l'utilisateur connecté

-   [x] Modification des informations (nom, prénom, adresse mail)
-   [x] Modification du mot de passe

### Administration

-   [x] Ajout d'utilisateurs de l'application
-   [x] Modification de leurs droits (consultant, technicien ou administrateur) et informations (nom, prénom, adresse mail)
-   [x] Réinitialisation de mot de passe et envoi par mail
-   [x] Suppression d'un utilisateur
-   [x] Ajout/renommage de services auxquels les agents gérés sont rattachés
-   [x] Ajout de modèles (marque, référence, stockage) d'appareils mobiles
-   [x] Système d'historique des requêtes

### Tableaux permettant la création/lecture/modification/suppression (CRUD)

-   [x] Ajout d'une ligne via l'appui sur un bouton
-   [x] Édition d'une ligne via l'appui sur un bouton qui rend ses cellules éditables individuellement
-   [x] Suppression de lignes via l'appui sur un bouton
-   [x] Recherche d'un élément
-   [x] Tri par colonne
-   [x] Virtualisation (seules un nombre défini de lignes sont rendues au même moment, dans un but de performance)
-   [x] Système de modale en cas de confirmation nécessaire ou de choix à effectuer (si conflit)
-   [x] Système de filtre rapide à l'appui sur un bouton

#### Gestion d'agents

-   [x] Ajout d'agents
-   [x] Modification des informations (nom, prénom, adresse mail, service, statut VIP)
-   [x] Suppression d'agents

#### Gestion d'appareils

-   [x] Ajout d'appareils
-   [x] Modification des informations (IMEI, statut, état, dates de préparation et d'attribution, modèle, propriétaire, commentaires)
-   [x] Suppression d'appareils

#### Gestion de lignes téléphoniques

-   [x] Ajout de lignes téléphoniques
-   [x] Modification des informations (numéro, profil, statut, propriétaire, appareil associé, commentaires)
-   [x] Suppression de lignes téléphoniques

## Détails techniques

### Principale bibliothèques employées

TypeScript  
React  
Mantine UI/Hooks  
Tanstack query  
Tanstack table
Zod  
Sonner

### Utilisation du JSON Web Token

Le JWT est stocké dans le local storage car cela évite les problèmes si le back-end et le front-end sont sur différents serveurs, pour repasser en mode cookie, voir le fichier src/utils/fetchApi.ts de la branche cookie-auth.

### Validation des données

Les données sont validées par Zod avant d'être envoyées à l'API (qui vérifie également celles-ci via Zod), pour éviter les requêtes inutiles au serveur.
