# Consignes de maintenance Schuller

## Architecture

- Ce dépôt contient uniquement le frontend statique publié par GitHub Pages.
- Le backend actif est le projet Google Apps Script, actuellement déployé en version 87.
- Tant que `clasp` n'est pas reconnecté, l'historique Apps Script est la source canonique du backend. Ne pas pousser aveuglément une ancienne copie locale de `apps-script-schuller`.
- Ne jamais copier `SecureData.js`, la liste des utilisateurs, des mots de passe, des jetons ou des données clients dans ce dépôt.

## Avant toute modification

1. Créer une branche dédiée.
2. Ne jamais modifier directement des données métier générées.
3. Conserver les contrôles d'autorisation dans Apps Script, même si l'interface filtre déjà les données.
4. Exécuter `node --check script.js` et `node --check sw.js`.

## Cache et publication

Lorsqu'un fichier frontend change, utiliser une seule nouvelle version dans `CACHE_NAME`, `APP_SHELL` et les paramètres `?v=` de `index.html`. Les références doivent rester identiques.

## Sécurité

- Toute valeur publiée ici est accessible sur Internet.
- Toute action Apps Script lisant des données doit vérifier la session et filtrer par rôle/secteur côté serveur.
- Ne jamais stocker de nouvelles données confidentielles dans `localStorage`.
- Une déconnexion doit révoquer le jeton côté serveur et effacer les caches de session.

