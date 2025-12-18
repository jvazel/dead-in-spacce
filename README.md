# Space Rock Rogue-lite

Jeu de tir spatial de type rogue-lite avec graphismes néon, système de progression et power-ups variés.

## 🚀 Comment lancer le jeu

Ce jeu utilise des modules ES6 modernes. Pour des raisons de sécurité (CORS), il doit être lancé via un serveur web local.

### Option 1 : Node.js (Recommandé)
```bash
npx -y serve -l 3500
```

### Option 2 : Python
```bash
python -m http.server 3500
```

Ensuite, ouvrez votre navigateur à `http://localhost:3500`.

## 🎮 Fonctionnalités

### Système de Boss
- **Vagues de Boss** : Un boss imposant apparaît toutes les 4 vagues.
- **Phases de Combat** : Le boss alterne entre deux phases d'attaque (Tir circulaire en spirale et Salve ciblée).
- **IA Évolutive** : Le boss se déplace vers le joueur et sa difficulté augmente avec les vagues.

### Ennemis et Obstacles
- **OVNIs** : Apparaissent périodiquement, tirent sur le joueur et se déplacent avec un mouvement sinusoïdal.
- **Trous Noirs** : Génèrent une force d'attraction sur tout ce qui les entoure (joueur, astéroïdes, projectiles). Attention à ne pas vous faire aspirer !
- **Astéroïdes** : Système de fragmentation (large → 2× medium → 2× small).

### Progression Rogue-lite
- **Améliorations Permanentes** : Dépensez vos crédits dans le menu Game Over pour améliorer votre vaisseau de façon persistante :
    - **PV & Bouclier** : Augmentez votre résistance maximale.
    - **Dégâts** : Améliorez la puissance de chaque projectile.
    - **Cadence de Tir** : Réduisez le délai entre les tirs.
    - **Téléportation** : Débloquez la capacité de sauter dans l'espace (Flèche Bas).
- **Power-ups Temporaires** : Récupérez des bonus sur les ennemis détruits (Multi-shot, Laser, Homing, Piercing, etc.).

## 🎯 Contrôles

- **Flèches directionnelles** : Déplacer et orienter le vaisseau.
- **Flèche Bas** : Téléportation (si débloquée).
- **Espace** : Tirer (balles normales, multi-tirs, ou laser selon les power-ups).

## 📘 Manuel du Code

### Structure du Projet Modulaire
Le code a été refactorisé pour être hautement modulaire et extensible :

```
space-rock/
├── assets/             # Sprites et images (PNG)
├── js/
│   ├── Game.js         # Coordinateur central (Boucle de jeu)
│   ├── config/         # Fichiers de configuration séparés
│   │   ├── game.js     # Vagues, difficulté, fréquences
│   │   ├── entities.js # Statistiques (Vitesse, PV, dégâts)
│   │   ├── powerups.js # Bonus temporaires
│   │   └── upgrades.js # Améliorations permanentes (shop)
│   ├── managers/       # Systèmes logique
│   │   ├── CollisionManager.js # Détection et résolution des impacts
│   │   ├── WaveManager.js      # Contrôle du spawn (Astéroïdes et Boss)
│   │   ├── SaveManager.js      # Gestion de la progression et crédits
│   │   ├── UpgradeManager.js   # Galerie de choix de upgrades temporaires
│   │   └── UIManager.js        # Gestion du HUD et des overlays
│   └── entities/       # Objets de jeu
│       ├── Boss.js     # IA complexe du boss
│       ├── Ship.js     # Logique complexe du joueur
│       ├── UFO.js      # Ennemi tactique
│       ├── BlackHole.js# Perturbation physique
│       └── ...
```

### Concepts Techniques
- **Delta Time** : Garantit une vitesse de jeu identique quelque soit le taux de rafraîchissement.
- **Système de Managers** : Chaque manager a une responsabilité unique, facilitant le débogage et l'ajout de fonctionnalités.
- **Collisions Avancées** : Support pour les cercles englobants et raycasting pour le laser haute précision.
- **Graphismes Néon** : Rendu optimisé utilisant les gradients et les effets de flou (glow) natifs du canvas.
