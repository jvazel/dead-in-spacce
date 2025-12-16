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

### Graphismes
- **Fond étoilé parallax** animé en temps réel
- **Améliorer le Bouclier** : +1 Bouclier Max (permanent, se régénère lentement)
- **Cadence de Tir** : +10% de vitesse de tir (cumulatif)
- **Durée Multi-Tirs** : +2 secondes au power-up Multi-Tirs
- **Drône Satellite** : Un drône orbite et tire automatiquement (cumulatif)
- **Mines de Proximité** : Largue des mines explosives périodiquement (déblocage)

Les prix augmentent de 50% après chaque achat (sauf Réparer).

### Internationalisation
- **Français** par défaut
- Système i18n extensible dans `js/labels.js`
- Tous les textes sont centralisés et facilement modifiables

## 🎯 Contrôles

- **Flèches directionnelles** : Déplacer et orienter le vaisseau
- **Espace** : Tirer (balles normales, multi-tirs, ou laser selon les power-ups actifs)

## 📘 Manuel du Code

### Structure du Projet
```
space-rock/
├── index.html          # Point d'entrée HTML
├── css/
│   └── style.css       # Styles UI (HUD, overlays)
└── js/
    ├── main.js         # Point d'entrée JavaScript
    ├── Game.js         # Boucle de jeu et logique principale
    ├── config.js       # Configuration centralisée
    ├── labels.js       # Traductions (i18n)
    ├── utils.js        # Utilitaires mathématiques
    ├── canvas.js       # Contexte Canvas
    ├── InputHandler.js # Gestion des entrées clavier
    ├── Background.js   # Fond étoilé parallax
    └── entities/
        ├── Entity.js   # Classe parente (screen wrap)
        ├── Ship.js     # Vaisseau du joueur
        ├── Asteroid.js # Astéroïdes ennemis
        ├── Bullet.js   # Projectiles
        ├── PowerUp.js  # Power-ups (3 types)
        └── Particle.js # Particules visuelles
```

### Modules JavaScript Clés

#### Configuration et Utilitaires
- **`config.js`** : **Fichier central** pour tous les paramètres du jeu (vitesses, PV, coûts, couleurs, etc.). Modifiez ce fichier pour équilibrer le jeu.
- **`labels.js`** : Toutes les chaînes de texte pour l'internationalisation.
- **`utils.js`** : Fonctions mathématiques (`dist`, `rand`, `checkCircleCollision`).
- **`canvas.js`** : Exporte le contexte de rendu Canvas 2D global.
- **`InputHandler.js`** : Gère les entrées clavier avec état persistant.

#### Cœur du Jeu
- **`main.js`** : Point d'entrée, initialise l'instance de `Game`.
- **`Game.js`** : Classe principale qui gère :
  - La boucle de jeu (`loop`) avec delta time
  - Les états (`MENU`, `PLAYING`, `SHOP`, `GAMEOVER`)
  - Les collisions (balles, laser, ship, power-ups)
  - L'interface utilisateur (HUD, magasin)
  - Le système de crédits et d'achats

#### Visuels
- **`Background.js`** : Fond étoilé avec parallax (3 couches à vitesses différentes).
- **`Particle.js`** : Particules pour explosions et effets visuels.

#### Entités (`js/entities/`)
- **`Entity.js`** : Classe parente avec position et "screen wrap" (téléportation aux bords).
- **`Ship.js`** : Vaisseau du joueur avec :
  - Physique à inertie
  - Système de tir (normal, multi-shot, laser)
  - Gestion des power-ups (timers, états)
  - Bouclier régénérant
  - Rendu avec effets glow
- **`Asteroid.js`** : Ennemis avec forme aléatoire et système de fragmentation (large → 2× medium → 2× small).
- **`Bullet.js`** : Projectiles avec durée de vie limitée.
- **`PowerUp.js`** : 3 types de bonus avec visuels distincts (carré, triangle, diamant).

### Modifier le Jeu

#### Équilibrage
Ouvrez `js/config.js` et modifiez les valeurs. Exemples :
- `SHIP.BASE_HP` : Points de vie de départ
- `POWERUP.DROP_CHANCE` : Probabilité d'apparition des power-ups (0.1 = 10%)
- `SHOP.COSTS` : Prix des améliorations
- `ASTEROID.SPAWN_DISTANCE` : Distance minimale de spawn

#### Ajouter une Langue
1. Ouvrez `js/labels.js`
2. Dupliquez l'objet `LABELS`
3. Traduisez toutes les valeurs
4. Exportez le nouvel objet

#### Nouveaux Power-Ups
1. Ajoutez un type dans `CONFIG.POWERUP.TYPES` (`config.js`)
2. Ajoutez le visuel dans `PowerUp.js` (méthode `draw`)
3. Ajoutez la logique d'effet dans `Game.js` (méthode `checkCollisions`)
4. Ajoutez les propriétés nécessaires dans `Ship.js`

## 🎨 Personnalisation Visuelle

Tous les paramètres visuels sont dans `CONFIG.VISUALS` (`config.js`) :
- Couleurs des entités (avec codes hex)
- Paramètres des particules (vitesse, durée, quantité)
- Paramètres du background (nombre d'étoiles, vitesses)

## 🔧 Technologies Utilisées

- **HTML5 Canvas** pour le rendu 2D
- **ES6 Modules** pour l'organisation du code
- **JavaScript vanilla** (aucune dépendance externe pour le jeu)
- **CSS3** pour l'interface utilisateur

## 📝 Notes Techniques

- Le jeu utilise **delta time** pour garantir un framerate constant indépendamment des performances.
- Les collisions utilisent des **cercles englobants** pour les performances.
- Le laser utilise un **algorithme de raycast** pour la détection de collision précise.
- Le background utilise un **système de parallax à 3 couches** pour la profondeur visuelle.
