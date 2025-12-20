import { checkCircleCollision, dist, rand } from '../utils.js';
import { CONFIG } from '../config.js';
import { Particle } from '../entities/Particle.js';
import { Asteroid } from '../entities/Asteroid.js';
import { PowerUp } from '../entities/PowerUp.js';

export class CollisionManager {
    constructor() {
    }

    checkCollisions(game) {
        // --- Bullet Collisions ---
        for (const b of game.bullets) {
            if (b.enemy) {
                // Enemy Bullet vs Ship
                if (game.ship && !game.ship.invulnerable && checkCircleCollision(b, game.ship)) {
                    game.ship.takeDamage(b.damage || 10);
                    b.markedForDeletion = true;
                    this.triggerShake();
                }
            } else {
                // Player Bullet vs Asteroids
                for (const a of game.asteroids) {
                    if (checkCircleCollision(b, a)) {
                        this.handleAsteroidHit(b, a, game);
                        break;
                    }
                }

                // Player Bullet vs UFO
                for (const u of game.ufos) {
                    if (checkCircleCollision(b, u)) {
                        this.handleUFOHit(b, u, game);
                        break;
                    }
                }

                // Player Bullet vs Boss
                if (game.boss && checkCircleCollision(b, game.boss)) {
                    b.markedForDeletion = true;
                    game.boss.takeDamage(b.damage);
                }
            }
        }

        // --- Entity vs Ship (Crash) ---
        if (game.ship && !game.ship.invulnerable) {
            // Ship vs Asteroid
            for (const a of game.asteroids) {
                if (checkCircleCollision(game.ship, a)) {
                    game.ship.takeDamage(CONFIG.SHIP.COLLISION_DAMAGE);
                    a.markedForDeletion = true;
                    this.triggerFlash();
                }
            }

            // Ship vs UFO
            for (const u of game.ufos) {
                if (checkCircleCollision(game.ship, u)) {
                    game.ship.takeDamage(CONFIG.SHIP.COLLISION_DAMAGE);
                    u.markedForDeletion = true;
                }
            }

            // Ship vs Boss
            if (game.boss && checkCircleCollision(game.ship, game.boss)) {
                game.ship.takeDamage(CONFIG.SHIP.COLLISION_DAMAGE);
            }

            // Ship vs Enemy Mines
            for (const m of game.mines) {
                if (m.isEnemy && checkCircleCollision(game.ship, m)) {
                    game.ship.takeDamage(CONFIG.MINE.DAMAGE || 20);
                    m.markedForDeletion = true;
                    this.createExplosion(m.x, m.y, '#ff0000', game);
                }
            }
        }

        // --- Ship vs PowerUp ---
        for (const p of game.powerups) {
            if (checkCircleCollision(game.ship, p)) {
                this.handlePowerUpCollection(p, game.ship);
                p.markedForDeletion = true;
            }
        }

        // --- Specialist Weapons ---
        this.checkSpecialistCollisions(game);
    }

    handleAsteroidHit(bullet, asteroid, game) {
        if (!bullet.piercing) {
            bullet.markedForDeletion = true;
        } else {
            bullet.hitCount = (bullet.hitCount || 0) + 1;
            if (bullet.hitCount >= (bullet.maxHits || 3)) bullet.markedForDeletion = true;
        }

        asteroid.hp -= bullet.damage;
        if (asteroid.hp <= 0) {
            asteroid.markedForDeletion = true;
            game.credits += asteroid.scoreValue || 20;
            this.createExplosion(asteroid.x, asteroid.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
            this.splitAsteroid(asteroid, game);

            if (Math.random() < CONFIG.POWERUP.DROP_CHANCE) {
                this.spawnPowerUp(asteroid.x, asteroid.y, game);
            }
        }
    }

    handleUFOHit(bullet, ufo, game) {
        bullet.markedForDeletion = true;
        ufo.hp -= bullet.damage;
        if (ufo.hp <= 0) {
            ufo.markedForDeletion = true;
            game.credits += ufo.scoreValue || 200;
            this.createExplosion(ufo.x, ufo.y, CONFIG.UFO.COLOR, game);
            if (Math.random() < CONFIG.UFO.DROP_CHANCE) {
                this.spawnPowerUp(ufo.x, ufo.y, game);
            }
        }
    }

    createExplosion(x, y, color, game) {
        for (let i = 0; i < 15; i++) {
            game.particles.push(new Particle(x, y, color, rand(50, 150), rand(0, Math.PI * 2), rand(0.5, 1.0)));
        }
    }

    splitAsteroid(a, game) {
        if (a.size === 'large') {
            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
        } else if (a.size === 'medium') {
            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
        }
    }

    spawnPowerUp(x, y, game) {
        const types = Object.keys(CONFIG.POWERUP.TYPES);
        const type = types[Math.floor(Math.random() * types.length)];
        game.powerups.push(new PowerUp(x, y, type));
    }

    handlePowerUpCollection(p, ship) {
        const type = p.type;
        if (type === 'HEALTH') {
            ship.hp = Math.min(ship.hp + CONFIG.POWERUP.TYPES.HEALTH.HEAL_AMOUNT, ship.maxHp);
        } else {
            const prop = type.toLowerCase() + 'Timer';
            const activeProp = type.toLowerCase() + 'Active';
            if (ship[prop] !== undefined) {
                ship[prop] = CONFIG.POWERUP.TYPES[type].DURATION;
                ship[activeProp === 'multishotActive' ? 'multiShot' : activeProp] = true;
            } else if (type === 'MULTISHOT') {
                ship.multiShot = true;
                ship.multiShotTimer = CONFIG.POWERUP.TYPES.MULTISHOT.DURATION;
            } else if (type === 'INVULNERABILITY') {
                ship.invulnerable = true;
                ship.invulnerableTimer = CONFIG.POWERUP.TYPES.INVULNERABILITY.DURATION;
            } else {
                // Dynamic flag setter
                const camelType = type.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
                ship[camelType] = true;
                ship[camelType + 'Timer'] = CONFIG.POWERUP.TYPES[type].DURATION;
            }
        }
    }

    checkSpecialistCollisions(game) {
        // Laser
        if (game.ship && game.ship.laserActive && game.input.isDown('Space')) {
            this.handleLaser(game);
        }
        // Mines vs Asteroids
        for (const m of game.mines) {
            if (m.isEnemy) continue; // Enemy mines don't hit asteroids (or maybe they do? Let's say no for now to save them for player)
            for (const a of game.asteroids) {
                if (dist(m.x, m.y, a.x, a.y) < CONFIG.MINE.TRIGGER_RADIUS + a.radius) {
                    m.markedForDeletion = true;
                    a.hp -= CONFIG.MINE.DAMAGE;
                    if (a.hp <= 0) a.markedForDeletion = true;
                    break;
                }
            }
        }
    }

    handleLaser(game) {
        const laserLength = CONFIG.POWERUP.TYPES.LASER.LENGTH;
        const dps = CONFIG.POWERUP.TYPES.LASER.DAMAGE_PER_SECOND / 60;

        const checkHit = (entity) => {
            if (!entity) return false;
            const dx = entity.x - game.ship.x;
            const dy = entity.y - game.ship.y;
            const distToEntity = dist(game.ship.x, game.ship.y, entity.x, entity.y);
            if (distToEntity > laserLength) return false;

            const angleToEntity = Math.atan2(dy, dx);
            let diff = angleToEntity - game.ship.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            return Math.abs(diff) < 0.1; // Narrow beam
        };

        game.asteroids.forEach(a => {
            if (checkHit(a)) {
                a.hp -= dps;
                if (a.hp <= 0 && !a.markedForDeletion) {
                    a.markedForDeletion = true;
                    game.credits += a.scoreValue || 20;
                    this.createExplosion(a.x, a.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
                    this.splitAsteroid(a, game);
                }
            }
        });

        game.ufos.forEach(u => {
            if (checkHit(u)) {
                u.hp -= dps;
                if (u.hp <= 0 && !u.markedForDeletion) {
                    u.markedForDeletion = true;
                    game.credits += u.scoreValue || 200;
                    this.createExplosion(u.x, u.y, CONFIG.UFO.COLOR, game);
                }
            }
        });

        if (game.boss && checkHit(game.boss)) {
            game.boss.takeDamage(dps);
        }
    }

    triggerShake() {
        const canvas = document.getElementById('gameCanvas');
        canvas.classList.remove('shake');
        void canvas.offsetWidth;
        canvas.classList.add('shake');
    }

    triggerFlash() {
        const flash = document.getElementById('flash-overlay');
        flash.classList.remove('flash-active');
        void flash.offsetWidth;
        flash.classList.add('flash-active');
    }
}
