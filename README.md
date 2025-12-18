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
Le code est organisé en modules ES6 pour séparer les données, la logique système et les objets de jeu.

#### 📂 [assets/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/assets)
Contient toutes les ressources graphiques du jeu (fichiers PNG) : `ship.png`, `boss.png`, `ufo.png`, `black_hole.png`, etc.

#### 📂 [js/config/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/config)
Centralise tous les paramètres du jeu pour un équilibrage facile :
- **`game.js`** : Paramètres globaux (fréquence des boss, vagues, difficulté).
- **`entities.js`** : Statistiques brutes de toutes les entités (PV, vitesse, rayon).
- **`upgrades.js`** : Définition des prix et des paliers du magasin permanent.
- **`powerups.js`** : Effets et durées des bonus temporaires.

#### 📂 [js/managers/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/managers)
Cerveaux logiques qui traitent les interactions entre entités :
- **`CollisionManager.js`** : Gère la physique des impacts, les explosions, et le raycasting du laser.
- **`SaveManager.js`** : Gère la persistance (session) des crédits et des améliorations achetées.
- **`WaveManager.js`** : Orchestre le spawn des astéroïdes et l'apparition dramatique du Boss.
- **`UpgradeManager.js`** : Gère les choix d'améliorations offerts à la fin de chaque vague.
- **`UIManager.js`** : Met à jour le HUD (barres de vie, score, timers).

#### 📂 [js/entities/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/entities)
Définition du comportement individuel des objets :
- **`Ship.js`** : Physique à inertie, gestion des armes et systèmes de survie du joueur.
- **`Boss.js`** : Système d'états avec plusieurs phases d'attaque (`spiral`, `burst`).
- **`UFO.js`** : Ennemi avec trajectoire sinusoïdale et tir ciblé.
- **`BlackHole.js`** : Entité physique générant des forces d'attraction.
- **`Drone.js`** : Allié orbital qui assiste le joueur.
- **`Asteroid.js`**, **`Bullet.js`**, **`Mine.js`**, **`Particle.js`**, **`PowerUp.js`**.

#### 📂 [js/ui/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/ui)
Composants d'interface complexes :
- **`GameOverScreen.js`** : Gère l'affichage du score final et l'interface du magasin permanent.

#### 📄 Fichiers Racines (Logic)
- [Game.js](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/Game.js) : Boucle de jeu principale et orchestration globale.
- [Assets.js](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/Assets.js) : Préchargeur d'images.
- [Background.js](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/Background.js) : Moteur de rendu du fond étoilé parallax.
- [InputHandler.js](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/InputHandler.js) : Capture et traite les entrées clavier sans latence.

### Concepts Techniques
- **Delta Time** : Garantit une vitesse de jeu identique quelque soit le taux de rafraîchissement.
- **Système de Managers** : Chaque manager a une responsabilité unique, facilitant le débogage et l'ajout de fonctionnalités.
- **Collisions Avancées** : Support pour les cercles englobants et raycasting pour le laser haute précision.
- **Graphismes Néon** : Rendu optimisé utilisant les gradients et les effets de flou (glow) natifs du canvas.
