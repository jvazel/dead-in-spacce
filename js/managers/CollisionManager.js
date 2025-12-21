import { checkCircleCollision, dist, rand } from '../utils.js';
import { CONFIG } from '../config.js';
import { Particle } from '../entities/Particle.js';
import { Asteroid } from '../entities/Asteroid.js';
import { PowerUp } from '../entities/PowerUp.js';
import { Missile } from '../entities/Missile.js';

export class CollisionManager {
    constructor() {
    }

    checkCollisions(game, dt) {
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
                // Player Bullet/Missile vs Asteroids
                for (const a of game.asteroids) {
                    if (checkCircleCollision(b, a)) {
                        if (b instanceof Missile) {
                            this.detonateMissile(b, game);
                        } else {
                            this.handleAsteroidHit(b, a, game);
                        }
                        break;
                    }
                }

                if (b.markedForDeletion) continue;

                // Player Bullet/Missile vs UFO
                for (const u of game.ufos) {
                    if (checkCircleCollision(b, u)) {
                        if (b instanceof Missile) {
                            this.detonateMissile(b, game);
                        } else {
                            this.handleUFOHit(b, u, game);
                        }
                        break;
                    }
                }

                if (b.markedForDeletion) continue;

                // Player Bullet/Missile vs Boss
                if (game.boss && checkCircleCollision(b, game.boss)) {
                    if (b instanceof Missile) {
                        this.detonateMissile(b, game);
                    } else {
                        b.markedForDeletion = true;
                        game.boss.takeDamage(b.damage);
                    }
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
                    this.detonateMine(m, game);
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
        this.checkSpecialistCollisions(game, dt);
    }

    handleAsteroidHit(bullet, asteroid, game) {
        if (!bullet.piercing) {
            bullet.markedForDeletion = true;
        } else {
            bullet.hitCount = (bullet.hitCount || 0) + 1;
            if (bullet.hitCount >= (bullet.maxHits || 3)) bullet.markedForDeletion = true;
        }

        if (asteroid.takeDamage(bullet.damage)) {
            game.credits += asteroid.scoreValue || 20;
            this.createExplosion(asteroid.x, asteroid.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
            this.splitAsteroid(asteroid, game);

            if (Math.random() < CONFIG.POWERUP.DROP_CHANCE) {
                this.spawnPowerUp(asteroid.x, asteroid.y, game);
            }

            // Synergy 6: Siphon Kills (Invulnerability + Health Upgrade)
            if (game.ship && game.ship.invulnerable && Math.random() < 0.1) {
                game.ship.hp = Math.min(game.ship.hp + 5, game.ship.maxHp);
                if (game.ship.maxShield > 0) game.ship.shield = Math.min(game.ship.shield + 0.5, game.ship.maxShield);
            }
        }

        if (bullet.explosive) {
            this.detonateExplosiveBullet(bullet, game);
        }
    }

    handleUFOHit(bullet, ufo, game) {
        bullet.markedForDeletion = true;
        if (ufo.takeDamage(bullet.damage)) {
            game.credits += ufo.scoreValue || 200;
            if (game.ship) game.ship.addMissile(1);
            this.createExplosion(ufo.x, ufo.y, CONFIG.UFO.COLOR, game);
            if (Math.random() < CONFIG.UFO.DROP_CHANCE) {
                this.spawnPowerUp(ufo.x, ufo.y, game);
            }

            // Synergy 6: Siphon Kills
            if (game.ship && game.ship.invulnerable && Math.random() < 0.2) {
                game.ship.hp = Math.min(game.ship.hp + 10, game.ship.maxHp);
            }
        }

        if (bullet.explosive) {
            this.detonateExplosiveBullet(bullet, game);
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
        const types = CONFIG.POWERUP.TYPES;
        const totalWeight = Object.values(types).reduce((sum, t) => sum + (t.WEIGHT || 1), 0);
        let r = Math.random() * totalWeight;

        for (const [type, data] of Object.entries(types)) {
            r -= (data.WEIGHT || 1);
            if (r <= 0) {
                game.powerups.push(new PowerUp(x, y, type));
                return;
            }
        }
    }

    handlePowerUpCollection(p, ship) {
        const type = p.type;
        const config = CONFIG.POWERUP.TYPES[type];
        if (!config) return;

        if (type === 'HEALTH') {
            ship.hp = Math.min(ship.hp + config.HEAL_AMOUNT, ship.maxHp);
            return;
        }

        // Standard logic for duration-based powerups
        // Map types to ship properties (e.g. MULTISHOT -> multiShot, REAR_FIRE -> rearFire)
        const propName = type.toLowerCase().replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

        if (ship[propName] !== undefined || ship[propName + 'Timer'] !== undefined) {
            ship[propName] = true;
            ship[propName + 'Timer'] = config.DURATION * (ship.powerupDurationMultiplier || 1.0);
        } else {
            // Fallback for types that might not follow the naming convention exactly
            if (type === 'MULTISHOT') {
                ship.multiShot = true;
                ship.multiShotTimer = config.DURATION * (ship.powerupDurationMultiplier || 1.0);
            } else if (type === 'INVULNERABILITY') {
                ship.invulnerable = true;
                ship.invulnerableTimer = config.DURATION * (ship.powerupDurationMultiplier || 1.0);
            } else if (type === 'LASER') {
                ship.laserActive = true;
                ship.laserTimer = config.DURATION * (ship.powerupDurationMultiplier || 1.0);
            }
        }
    }

    checkSpecialistCollisions(game, dt) {
        // Laser
        if (game.ship && game.ship.laserActive && game.input.isDown('Space')) {
            this.handleLaser(game, dt);
        }
        // Mines triggers
        for (const m of game.mines) {
            if (m.markedForDeletion) continue;

            const triggerRadius = CONFIG.MINE.TRIGGER_RADIUS;

            // Asteroids trigger mines
            for (const a of game.asteroids) {
                if (dist(m.x, m.y, a.x, a.y) < triggerRadius + a.radius) {
                    this.detonateMine(m, game);
                    break;
                }
            }
            if (m.markedForDeletion) continue;

            // UFOs trigger mines
            for (const u of game.ufos) {
                if (dist(m.x, m.y, u.x, u.y) < triggerRadius + u.radius) {
                    this.detonateMine(m, game);
                    break;
                }
            }
        }
    }

    detonateMine(mine, game) {
        if (mine.markedForDeletion) return;
        mine.markedForDeletion = true;

        const blastRadius = CONFIG.MINE.BLAST_RADIUS;
        const damage = CONFIG.MINE.DAMAGE;
        const color = mine.isEnemy ? '#ff0000' : CONFIG.VISUALS.COLORS.MINE;

        // Visual: Large Explosion
        for (let i = 0; i < 40; i++) {
            game.particles.push(new Particle(mine.x, mine.y, color, rand(100, 300), rand(0, Math.PI * 2), rand(0.8, 1.5)));
        }
        this.triggerShake();

        // AOE Damage
        // Damage Ship?
        // Let's damage ship if it's within radius of ANY explosion for realism/danger
        if (game.ship && !game.ship.invulnerable) {
            if (dist(mine.x, mine.y, game.ship.x, game.ship.y) < blastRadius + game.ship.radius) {
                game.ship.takeDamage(damage / 2); // Reduced damage for AOE compared to direct hit
                this.triggerFlash();
            }
        }

        // Damage Asteroids
        game.asteroids.forEach(a => {
            if (dist(mine.x, mine.y, a.x, a.y) < blastRadius + a.radius) {
                if (a.takeDamage(damage)) {
                    game.credits += a.scoreValue || 20;
                    this.createExplosion(a.x, a.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
                    this.splitAsteroid(a, game);
                }
            }
        });

        // Damage UFOs
        game.ufos.forEach(u => {
            if (dist(mine.x, mine.y, u.x, u.y) < blastRadius + u.radius) {
                if (u.takeDamage(damage)) {
                    game.credits += u.scoreValue || 200;
                    this.createExplosion(u.x, u.y, CONFIG.UFO.COLOR, game);
                }
            }
        });
    }

    detonateExplosiveBullet(bullet, game) {
        const blastRadius = CONFIG.POWERUP.TYPES.EXPLOSIVE.BLAST_RADIUS;
        const damage = CONFIG.POWERUP.TYPES.EXPLOSIVE.DAMAGE;

        this.createExplosion(bullet.x, bullet.y, bullet.color, game);

        game.asteroids.forEach(a => {
            if (dist(bullet.x, bullet.y, a.x, a.y) < blastRadius + a.radius) {
                if (a.takeDamage(damage)) {
                    game.credits += a.scoreValue || 20;
                    this.createExplosion(a.x, a.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
                    this.splitAsteroid(a, game);
                }
            }
        });

        game.ufos.forEach(u => {
            if (dist(bullet.x, bullet.y, u.x, u.y) < blastRadius + u.radius) {
                if (u.takeDamage(damage)) {
                    game.credits += u.scoreValue || 200;
                    this.createExplosion(u.x, u.y, CONFIG.UFO.COLOR, game);
                }
            }
        });

        if (game.boss && dist(bullet.x, bullet.y, game.boss.x, game.boss.y) < blastRadius + game.boss.radius) {
            game.boss.takeDamage(damage);
        }
    }

    handleLaser(game, dt) {
        const laserLength = CONFIG.POWERUP.TYPES.LASER.LENGTH;
        const dps = CONFIG.POWERUP.TYPES.LASER.DAMAGE_PER_SECOND * dt;

        const checkHit = (entity) => {
            if (!entity || entity.markedForDeletion) return false;

            const distToEntity = dist(game.ship.x, game.ship.y, entity.x, entity.y);
            if (distToEntity > laserLength + entity.radius) return false;

            const lx = Math.cos(game.ship.angle);
            const ly = Math.sin(game.ship.angle);
            const dx = entity.x - game.ship.x;
            const dy = entity.y - game.ship.y;
            const dot = dx * lx + dy * ly;

            if (dot < 0 || dot > laserLength) return false;

            const closestX = game.ship.x + lx * dot;
            const closestY = game.ship.y + ly * dot;
            const d = dist(entity.x, entity.y, closestX, closestY);

            const hit = d < entity.radius + (CONFIG.POWERUP.TYPES.LASER.WIDTH * 2);

            if (hit) {
                // Synergy 1: Explosive Laser
                if (game.ship.explosive && Math.random() < 0.1) {
                    this.createExplosion(closestX, closestY, CONFIG.POWERUP.TYPES.EXPLOSIVE.COLOR, game);
                    this.applyMiniAOE(closestX, closestY, game);
                } else if (Math.random() < 0.3) {
                    game.particles.push(new Particle(closestX, closestY, CONFIG.POWERUP.TYPES.LASER.COLOR, 20, rand(0, Math.PI * 2), 0.3));
                }
            }

            return hit;
        };

        const isChainLaser = game.ship.piercing && game.ship.bounce;

        [...game.asteroids, ...game.ufos].forEach(e => {
            if (checkHit(e)) {
                const destroyed = e.takeDamage(dps);
                if (isChainLaser && Math.random() < 0.05) this.handleChainEffect(e, dps * 5, game);
                if (destroyed) {
                    if (e instanceof Asteroid) {
                        game.credits += e.scoreValue || 20;
                        this.createExplosion(e.x, e.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
                        this.splitAsteroid(e, game);
                    } else {
                        game.credits += e.scoreValue || 200;
                        this.createExplosion(e.x, e.y, CONFIG.UFO.COLOR, game);
                    }
                }
            }
        });

        if (game.boss && checkHit(game.boss)) {
            game.boss.takeDamage(dps);
            if (isChainLaser && Math.random() < 0.05) this.handleChainEffect(game.boss, dps * 5, game);
        }
    }

    applyMiniAOE(x, y, game) {
        const radius = 50;
        const damage = 5;
        game.asteroids.forEach(a => {
            if (dist(x, y, a.x, a.y) < radius + a.radius) a.hp -= damage;
        });
        game.ufos.forEach(u => {
            if (dist(x, y, u.x, u.y) < radius + u.radius) u.hp -= damage;
        });
    }

    handleChainEffect(source, damage, game) {
        const chainRadius = 200;
        let targets = [...game.asteroids, ...game.ufos];
        if (game.boss) targets.push(game.boss);

        // Find up to 3 nearby targets
        let count = 0;
        for (const t of targets) {
            if (t === source || t.markedForDeletion) continue;
            if (dist(source.x, source.y, t.x, t.y) < chainRadius) {
                if (t.takeDamage) t.takeDamage(damage);
                else t.hp -= damage;

                // Visual: Arc
                game.particles.push(new Particle(t.x, t.y, '#00ffff', 50, rand(0, Math.PI * 2), 0.5));
                count++;
                if (count >= 3) break;
            }
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

    detonateMissile(missile, game) {
        if (missile.markedForDeletion) return;
        missile.markedForDeletion = true;

        const blastRadius = CONFIG.MISSILE.BLAST_RADIUS;
        const damage = CONFIG.MISSILE.DAMAGE;
        const color = '#00ffff'; // Missile Cyan Glow

        // Visual: Massive Explosion
        for (let i = 0; i < 60; i++) {
            game.particles.push(new Particle(missile.x, missile.y, color, rand(150, 400), rand(0, Math.PI * 2), rand(1.0, 2.0)));
        }
        this.triggerShake();

        // AOE Damage - Asteroids
        game.asteroids.forEach(a => {
            if (dist(missile.x, missile.y, a.x, a.y) < blastRadius + a.radius) {
                a.hp -= damage;
                if (a.hp <= 0 && !a.markedForDeletion) {
                    a.markedForDeletion = true;
                    game.credits += a.scoreValue || 20;
                    this.createExplosion(a.x, a.y, CONFIG.VISUALS.COLORS.ASTEROID, game);
                    this.splitAsteroid(a, game);
                }
            }
        });

        // AOE Damage - UFOs
        game.ufos.forEach(u => {
            if (dist(missile.x, missile.y, u.x, u.y) < blastRadius + u.radius) {
                u.hp -= damage;
                if (u.hp <= 0 && !u.markedForDeletion) {
                    u.markedForDeletion = true;
                    game.credits += u.scoreValue || 200;
                    this.createExplosion(u.x, u.y, CONFIG.UFO.COLOR, game);
                }
            }
        });

        // AOE Damage - Boss
        if (game.boss && dist(missile.x, missile.y, game.boss.x, game.boss.y) < blastRadius + game.boss.radius) {
            game.boss.takeDamage(damage);
        }
    }
}
