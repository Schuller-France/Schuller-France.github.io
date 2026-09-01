# Schuller France — application commerciale

Frontend statique de l'application commerciale Schuller, publié avec GitHub Pages.

## Organisation

- `index.html` : structure de l'interface ;
- `style.css` : présentation ;
- `script.js` : logique côté navigateur ;
- `sw.js` : cache hors ligne et mise à jour ;
- `tarifs.js` : adresse publique du service Apps Script, sans données confidentielles ;
- `assets/` : images et icônes.

Le backend Google Apps Script est maintenu séparément. La version active issue de cette mise à niveau est la version 87. Tant que `clasp` n'est pas reconnecté, l'historique Apps Script reste la source canonique : ne pas publier une ancienne copie locale. Le frontend ne doit contenir aucun mot de passe, jeton, fichier client ou statistique confidentielle.

## Vérification locale

```powershell
node --check script.js
node --check sw.js
```

## Méthode de modification

1. créer une branche ;
2. effectuer la modification ;
3. vérifier la syntaxe et le comportement sur ordinateur et tablette ;
4. vérifier que les versions `?v=` correspondent au cache dans `sw.js` ;
5. fusionner dans `main` uniquement après validation.

Consulter `AGENTS.md` pour Codex et `CLAUDE.md` pour Claude Code.

