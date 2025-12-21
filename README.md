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
- **Vagues de Boss** : Un boss imposant apparaît toutes les 4 vagues (configurable).
- **Variété de Boss** : Le jeu alterne entre différents types de boss pour varier le gameplay :
    - **Boss Alpha** : Utilise des tirs circulaires en spirale et des salves ciblées.
    - **Boss Beta** : Utilise des tirs triples (tri-shot) et pose des mines explosives.
- **IA Évolutive** : Chaque boss possède ses propres patterns de mouvement et sa difficulté augmente avec les vagues.
- **Immunité Tactique** : Les boss sont immunisés contre les déclenchements et les dégâts des mines pour maintenir le défi.

### Classes de Vaisseaux (Méta-Progression)
Le joueur peut débloquer et sélectionner différents modèles de vaisseaux dans le magasin permanent, chacun avec ses caractéristiques uniques :
- **Vaisseau de Base** : Équilibré et polyvalent.
- **L'Intercepteur** : Très rapide, coque fragile, mais démarre avec la **Téléportation** débloquée.
- **Le Tank** : Très résistant (PV élevés), mais plus lent et incapable d'utiliser des drones.
- **Le Spécialiste** : Dégâts de base réduits, mais bénéficie d'une durée prolongée pour tous les bonus récupérés.

### Ennemis et Obstacles
- **OVNIs** : Apparaissent périodiquement, tirent sur le joueur et se déplacent avec un mouvement sinusoïdal.
- **Black Holes** : Génèrent une force d'attraction sur tout ce qui les entoure (joueur, astéroïdes, projectiles). Attention à ne pas vous faire aspirer !
- **Mines** : Peuvent être posées par le joueur ou les boss. Elles possèdent une zone d'explosion (AOE) dévastatrice et sont déclenchées par la proximité de tout objet (astéroïdes, OVNIs, ou joueur).
- **Astéroïdes** : Système de fragmentation (large → 2× medium → 2× small).

### Environnement Interactif (Hazards)
- **Nébuleuses** : Zones de gaz coloré qui ralentissent votre vitesse mais rechargent instantanément votre bouclier. Utilisez-les comme abris !
- **Anomalies Temporelles** : Bulles de distorsion qui ralentissent le temps. Elles affectent tout : votre vaisseau, les projectiles et les astéroïdes.
- **Tempêtes Solaires** : Événements imprévisibles qui inversent vos commandes et brouillent l'affichage. Restez concentré !


### Progression Rogue-lite
- **Améliorations Permanentes** : Dépensez vos crédits dans le menu Game Over pour améliorer votre vaisseau de façon persistante. Chaque amélioration dispose d'une **icône néon dédiée** :
    - **PV & Bouclier** : Augmentez votre résistance maximale.
    - **Dégâts** : Améliorez la puissance de chaque projectile.
    - **Cadence de Tir** : Réduisez le délai entre les tirs.
    - **Téléportation** : Débloqué avec l'amélioration "Téléportation" (Touche Bas).
    - **Lance-Missiles** : Amélioration permanente permettant de tirer des missiles auto-guidés à zone d'effet dévastatrice.
- **Interface à Onglets** : Le menu Game Over est organisé en onglets (**Vaisseaux** / **Améliorations**) pour une navigation fluide et claire.
- **Améliorations In-Game (Rogue Cards)** : À la fin de chaque vague, choisissez parmi 3 bonus aléatoires :
    - **Puissance & Cadence** : Augmente les dégâts ou réduit le délai entre les tirs.
    - **PV & Bouclier** : Augmente votre résistance.
    - **Ravitaillement Missiles** : Récupère instantanément +3 missiles.
    - **Drones** : Ajoute un drone de soutien orbital.
    - **Bonus Étendu** : Augmente la durée de TOUS les bonus (Power-ups) de +20%.
- **Power-ups Temporaires** : Récupérez des bonus orbes colorés sur les ennemis détruits :
    - **Multi-shot** (Orange) : Tire plusieurs balles en éventail.
    - **Laser** (Rouge orangé) : Un rayon continu haute précision qui traverse tout.
    - **Homing** (Magenta) : Projectiles à tête chercheuse.
    - **Piercing** (Vert Printemps) : Projectiles qui traversent plusieurs cibles.
    - **Bouncing Bullets** (Bleu) : Les balles rebondissent sur les bords de l'écran.
    - **Explosive** (Rouge) : Les impacts génèrent des micro-explosions.
    - **Rear Fire** (Blanc) : Tire également vers l'arrière.
    - **Afterburner** (Cyan) : Crée une traînée de feu destructrice derrière le vaisseau.
    - **Invulnerability** (Jaune/Or) : Immunité temporaire aux dégâts.
    - **Health** (Vert) : Restaure une partie des points de vie.
- **Explosive** (Rouge) : Les impacts génèrent des micro-explosions et des dégâts de zone (AOE).

### Synergies de Combat
Le jeu propose des synergies puissantes lorsque plusieurs bonus sont actifs simultanément :
- **Laser Explosif** (`LASER` + `EXPLOSIVE`) : Le point d'impact du laser génère des micro-explosions continues.
- **Drones Temporaires** (`INVULNERABILITY` + `MULTISHOT`) : Fait apparaître deux drones de soutien supplémentaires pendant toute la durée des bonus.
- **Postcombustion Insta-Mines** (`AFTERBURNER` + `MINE`) : Quadruple la vitesse de pose des mines tant que l'Afterburner est actif.
- **Laser à Chaîne** (`LASER` + `PIERCING` + `BOUNCE`) : Le laser arc entre les cibles proches, infligeant des dégâts multiples.
- **Pluie de Missiles** (`MISSILES` + `MULTISHOT`) : Le lance-missiles tire une salve de 3 missiles en éventail.
- **Bouclier de Siphon** (`INVULNERABILITY` + `HEALTH`) : Chaque destruction pendant l'invulnérabilité a une chance de restaurer PV et bouclier.

## 🎯 Contrôles

- **Flèches directionnelles** : Déplacer et orienter le vaisseau.
- **Flèche Bas** : Téléportation (si débloquée).
- **Espace** : Tirer (balles normales, multi-tirs, ou laser selon les power-ups).
- **Maj (Shift) ou X** : Lancer un missile (si débloqué et munitions disponibles).

## 📘 Manuel du Code

### Structure du Projet Modulaire
Le code est organisé en modules ES6 pour séparer les données, la logique système et les objets de jeu.

#### 📂 [assets/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/assets)
Contient toutes les ressources graphiques du jeu (fichiers PNG) : `ship.png`, `ufo.png`, `black_hole.png`, etc.
- **📂 [bosses/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/assets/bosses)** : Assets spécifiques aux boss (`boss_alpha.png`, `boss_beta.png`).

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
- **📂 [bosses/](file:///c:/Users/BL207380/Desktop/Projects/space-rock/js/entities/bosses)** : Système de boss modulaire.
    - **`BossBase.js`** : Classe de base abstraite gérant les PV et l'affichage commun.
    - **`BossAlpha.js`** : Implémentation du premier boss.
    - **`BossBeta.js`** : Implémentation du second boss avec mines et tri-shot.
- **`Ship.js`** : Physique à inertie, gestion des armes et systèmes de survie du joueur.
- **`UFO.js`** : Ennemi avec trajectoire sinusoïdale et tir ciblé.
- **`BlackHole.js`** : Entité physique générant des forces d'attraction.
- **Drone.js** : Allié orbital qui assiste le joueur en ciblant prioritairement les menaces (Boss > UFO > Astéroïde).
- **Missile.js** : Projectile auto-guidé avec dégâts de zone (AOE).
- **Asteroid.js**, **`Bullet.js`**, **`Mine.js`**, **`Particle.js`**, **`PowerUp.js`**.

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

### Optimisations Techniques
- **Système de Dégâts Unifié** : Architecture harmonisée utilisant une méthode `takeDamage` pour toutes les entités destructibles, simplifiant la maintenance et assurant un comportement cohérent des projectiles et du laser.
- **Calibrage Laser (DPS)** : Le laser utilise désormais un calcul basé sur le temps réel (`dt`), garantissant une puissance équilibrée indépendamment du taux de rafraîchissement de l'écran (60Hz, 144Hz, etc.).
- **Système de Surcharge (Heat)** : Implémentation d'une gestion de chaleur pour le vaisseau. Introduit une couche de stratégie (Risk-Reward) où le joueur peut infliger +50% de dégâts en restant proche de la limite de surchauffe.
- **Dangers Environnementaux** : Système extensible d'aléas (`EnvironmentManager`) utilisant des propriétés de `timeScale` individuelles pour simuler des distorsions temporelles locales.
- **Performance** : Réduction du nombre d'itérations dans le gestionnaire de collisions grâce à l'unification des boucles de détection.

