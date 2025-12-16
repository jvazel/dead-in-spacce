import { checkCircleCollision, dist, rand } from '../utils.js';
import { CONFIG } from '../config.js';
import { Particle } from '../entities/Particle.js';
import { Asteroid } from '../entities/Asteroid.js';
import { PowerUp } from '../entities/PowerUp.js';

export class CollisionManager {
    constructor() {
    }

    checkCollisions(game) {
        // Bullets vs Asteroids
        for (const b of game.bullets) {
            for (const a of game.asteroids) {
                if (checkCircleCollision(b, a)) {
                    // Handle Piercing
                    if (b.piercing) {
                        b.hitCount++;
                        if (b.hitCount >= b.maxHits) {
                            b.markedForDeletion = true;
                        }
                    } else {
                        b.markedForDeletion = true;
                    }

                    // Bullet Damage
                    a.hp -= b.damage;

                    if (a.hp <= 0) {
                        a.markedForDeletion = true;
                        game.credits += a.scoreValue;

                        // Handle Explosive
                        if (b.explosive) {
                            const blastRadius = CONFIG.POWERUP.TYPES.EXPLOSIVE.BLAST_RADIUS;
                            for (const otherA of game.asteroids) {
                                if (otherA === a) continue;
                                if (dist(a.x, a.y, otherA.x, otherA.y) < blastRadius) {
                                    otherA.markedForDeletion = true;
                                    game.credits += 10;
                                    // Explosion particles for collateral damage
                                    for (let i = 0; i < 5; i++) {
                                        game.particles.push(new Particle(
                                            otherA.x, otherA.y,
                                            CONFIG.VISUALS.COLORS.ASTEROID,
                                            rand(50, 100),
                                            rand(0, Math.PI * 2),
                                            rand(0.3, 0.7)
                                        ));
                                    }
                                }
                            }

                            // Big Explosion Visual
                            for (let i = 0; i < 30; i++) {
                                game.particles.push(new Particle(
                                    a.x, a.y,
                                    CONFIG.POWERUP.TYPES.EXPLOSIVE.COLOR,
                                    rand(100, 300),
                                    rand(0, Math.PI * 2),
                                    rand(0.5, 1.5)
                                ));
                            }
                        }

                        // Explosion Particles
                        for (let i = 0; i < CONFIG.VISUALS.PARTICLES.EXPLOSION_COUNT; i++) {
                            game.particles.push(new Particle(
                                a.x, a.y,
                                CONFIG.VISUALS.COLORS.ASTEROID,
                                rand(CONFIG.VISUALS.PARTICLES.SPEED_MIN, CONFIG.VISUALS.PARTICLES.SPEED_MAX),
                                rand(0, Math.PI * 2),
                                rand(CONFIG.VISUALS.PARTICLES.LIFE_MIN, CONFIG.VISUALS.PARTICLES.LIFE_MAX)
                            ));
                        }

                        // Shockwave
                        game.particles.push(new Particle(
                            a.x, a.y,
                            '#fff',
                            100, // Expansion speed
                            0,
                            0.5, // Life
                            'shockwave'
                        ));

                        // Split Asteroid
                        if (a.size === 'large') {
                            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
                            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
                        } else if (a.size === 'medium') {
                            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
                            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
                        }

                        // Chance for powerup
                        if (Math.random() < CONFIG.POWERUP.DROP_CHANCE) {
                            const types = Object.keys(CONFIG.POWERUP.TYPES);
                            const totalWeight = types.reduce((sum, type) => sum + CONFIG.POWERUP.TYPES[type].WEIGHT, 0);
                            let random = Math.random() * totalWeight;

                            let selectedType = types[0];
                            for (const type of types) {
                                random -= CONFIG.POWERUP.TYPES[type].WEIGHT;
                                if (random <= 0) {
                                    selectedType = type;
                                    break;
                                }
                            }

                            game.powerups.push(new PowerUp(a.x, a.y, selectedType));
                        }
                        break;
                    }
                }
            }
        }

        // Ship vs Asteroids
        for (const a of game.asteroids) {
            if (checkCircleCollision(game.ship, a)) {
                game.ship.takeDamage(CONFIG.SHIP.COLLISION_DAMAGE);
                a.markedForDeletion = true;

                // Visual Effects
                const canvas = document.getElementById('gameCanvas');
                const flash = document.getElementById('flash-overlay');

                // Shake
                canvas.classList.remove('shake');
                void canvas.offsetWidth; // Trigger reflow
                canvas.classList.add('shake');

                // Flash
                flash.classList.remove('flash-active');
                void flash.offsetWidth; // Trigger reflow
                flash.classList.add('flash-active');

                if (game.ship.hp <= 0) {
                    game.gameOver();
                    return;
                }
            }
        }

        // Ship vs Powerups
        for (const p of game.powerups) {
            if (checkCircleCollision(game.ship, p)) {
                p.markedForDeletion = true;

                if (p.type === 'INVULNERABILITY') {
                    game.ship.invulnerable = true;
                    game.ship.invulnerableTimer = CONFIG.POWERUP.TYPES.INVULNERABILITY.DURATION;
                } else if (p.type === 'MULTISHOT') {
                    game.ship.multiShot = true;
                    game.ship.multiShotTimer = game.ship.multiShotDuration;
                } else if (p.type === 'LASER') {
                    game.ship.laserActive = true;
                    game.ship.laserTimer = CONFIG.POWERUP.TYPES.LASER.DURATION;
                } else if (p.type === 'HOMING') {
                    game.ship.homing = true;
                    game.ship.homingTimer = CONFIG.POWERUP.TYPES.HOMING.DURATION;
                } else if (p.type === 'EXPLOSIVE') {
                    game.ship.explosive = true;
                    game.ship.explosiveTimer = CONFIG.POWERUP.TYPES.EXPLOSIVE.DURATION;
                } else if (p.type === 'PIERCING') {
                    game.ship.piercing = true;
                    game.ship.piercingTimer = CONFIG.POWERUP.TYPES.PIERCING.DURATION;
                } else if (p.type === 'REAR_FIRE') {
                    game.ship.rearFire = true;
                    game.ship.rearFireTimer = CONFIG.POWERUP.TYPES.REAR_FIRE.DURATION;
                } else if (p.type === 'AFTERBURNER') {
                    game.ship.afterburner = true;
                    game.ship.afterburnerTimer = CONFIG.POWERUP.TYPES.AFTERBURNER.DURATION;
                } else if (p.type === 'HEALTH') {
                    // Heal the ship
                    game.ship.hp = Math.min(game.ship.hp + CONFIG.POWERUP.TYPES.HEALTH.HEAL_AMOUNT, game.ship.maxHp);
                }
            }
        }

        // Bullets vs UFOs (Player bullets only)
        // & UFO Bullets vs Ship
        for (const b of game.bullets) {
            if (b.isEnemy) {
                // Enemy Bullet vs Ship
                if (checkCircleCollision(b, game.ship)) {
                    game.ship.takeDamage(b.damage || 10);
                    b.markedForDeletion = true;

                    // Shake/Flash handled by takeDamage or here? 
                    // Let's add shake here too as feedback
                    const canvas = document.getElementById('gameCanvas');
                    canvas.classList.remove('shake');
                    void canvas.offsetWidth;
                    canvas.classList.add('shake');

                    if (game.ship.hp <= 0) {
                        game.gameOver();
                        return;
                    }
                }
            } else {
                // Player Bullet vs UFOs
                for (const u of game.ufos) {
                    if (checkCircleCollision(b, u)) {
                        b.markedForDeletion = true; // Bullet dies
                        u.hp -= b.damage;
                        if (u.hp <= 0) {
                            u.markedForDeletion = true;
                            game.credits += u.scoreValue;

                            // Explosion Visual
                            for (let i = 0; i < 20; i++) {
                                game.particles.push(new Particle(
                                    u.x, u.y,
                                    CONFIG.UFO.COLOR,
                                    rand(50, 200),
                                    rand(0, Math.PI * 2),
                                    rand(0.5, 1.0)
                                ));
                            }

                            // Chance for powerup drop (UFO has higher drop rate)
                            if (Math.random() < CONFIG.UFO.DROP_CHANCE) {
                                const types = Object.keys(CONFIG.POWERUP.TYPES);
                                const totalWeight = types.reduce((sum, type) => sum + CONFIG.POWERUP.TYPES[type].WEIGHT, 0);
                                let random = Math.random() * totalWeight;

                                let selectedType = types[0];
                                for (const type of types) {
                                    random -= CONFIG.POWERUP.TYPES[type].WEIGHT;
                                    if (random <= 0) {
                                        selectedType = type;
                                        break;
                                    }
                                }

                                game.powerups.push(new PowerUp(u.x, u.y, selectedType));
                            }
                        }
                        break;
                    }
                }
            }
        }

        // Ship vs UFOs (Crash)
        for (const u of game.ufos) {
            if (checkCircleCollision(game.ship, u)) {
                game.ship.takeDamage(CONFIG.SHIP.COLLISION_DAMAGE);
                u.markedForDeletion = true; // UFO dies on crash

                // Explosion Visual
                for (let i = 0; i < 20; i++) {
                    game.particles.push(new Particle(
                        u.x, u.y,
                        CONFIG.UFO.COLOR,
                        rand(50, 200),
                        rand(0, Math.PI * 2),
                        rand(0.5, 1.0)
                    ));
                }

                if (game.ship.hp <= 0) {
                    game.gameOver();
                    return;
                }
            }
        }

        // Trails vs Asteroids
        for (const t of game.trails) {
            for (const a of game.asteroids) {
                if (dist(t.x, t.y, a.x, a.y) < t.radius + a.radius) {
                    // Constant damage or one-hit? 
                    // Let's make it act like a bullet but persist (piercing infinite)
                    // But to avoid melting instantly, maybe use cooldown or just high damage per tick?
                    // User said "same as classic shot", so `t.damage`.
                    // To prevent 60 hits/sec, we might need a cooldown on the asteroid or the trail?
                    // But trails fade fast. Let's just apply damage and mark trail for deletion?
                    // "Longue trainée" implies perseverance. 
                    // Let's destroy the segment on impact to be safe and balanced, like a mine.
                    t.markedForDeletion = true;
                    a.hp -= t.damage;

                    if (a.hp <= 0) {
                        a.markedForDeletion = true;
                        game.credits += a.scoreValue;
                        // Explosion... (Simplified for brevity, reuse particle logic if needed)
                        for (let i = 0; i < CONFIG.VISUALS.PARTICLES.EXPLOSION_COUNT; i++) {
                            game.particles.push(new Particle(
                                a.x, a.y,
                                CONFIG.VISUALS.COLORS.ASTEROID,
                                rand(CONFIG.VISUALS.PARTICLES.SPEED_MIN, CONFIG.VISUALS.PARTICLES.SPEED_MAX),
                                rand(0, Math.PI * 2),
                                rand(CONFIG.VISUALS.PARTICLES.LIFE_MIN, CONFIG.VISUALS.PARTICLES.LIFE_MAX)
                            ));
                        }

                        if (a.size === 'large') {
                            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
                            game.asteroids.push(new Asteroid(a.x, a.y, 'medium', game.wave));
                        } else if (a.size === 'medium') {
                            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
                            game.asteroids.push(new Asteroid(a.x, a.y, 'small', game.wave));
                        }
                    }
                    break;
                }
            }
        }

        // Mines vs Asteroids
        for (const m of game.mines) {
            for (const a of game.asteroids) {
                if (dist(m.x, m.y, a.x, a.y) < CONFIG.MINE.TRIGGER_RADIUS + a.radius) {
                    m.markedForDeletion = true;

                    // Explosion
                    const blastRadius = CONFIG.MINE.BLAST_RADIUS;
                    for (const otherA of game.asteroids) {
                        if (dist(m.x, m.y, otherA.x, otherA.y) < blastRadius) {
                            otherA.markedForDeletion = true;
                            game.credits += 10;
                            for (let i = 0; i < 5; i++) {
                                game.particles.push(new Particle(
                                    otherA.x, otherA.y,
                                    CONFIG.VISUALS.COLORS.ASTEROID,
                                    rand(50, 100),
                                    rand(0, Math.PI * 2),
                                    rand(0.3, 0.7)
                                ));
                            }
                        }
                    }

                    // Mine Explosion Visual
                    for (let i = 0; i < 20; i++) {
                        game.particles.push(new Particle(
                            m.x, m.y,
                            CONFIG.VISUALS.COLORS.MINE,
                            rand(100, 200),
                            rand(0, Math.PI * 2),
                            rand(0.5, 1.0)
                        ));
                    }
                    break;
                }
            }
        }

        // Laser vs Asteroids
        if (game.ship && game.ship.laserActive && game.input.isDown('Space')) {
            const laserLength = CONFIG.POWERUP.TYPES.LASER.LENGTH;
            // Scale Laser DPS based on Ship Stats
            const damageMult = game.ship.damage / CONFIG.SHIP.BASE_DAMAGE;
            const fireRateMult = CONFIG.SHIP.BASE_FIRE_RATE / game.ship.fireRateDelay;
            const damagePerFrame = (CONFIG.POWERUP.TYPES.LASER.DAMAGE_PER_SECOND * damageMult * fireRateMult) / 60;

            let closestHit = null;
            let closestDist = Infinity;
            let hitType = null; // 'asteroid' or 'ufo'

            // Check asteroids
            for (const a of game.asteroids) {
                const dx = a.x - game.ship.x;
                const dy = a.y - game.ship.y;
                const angle = game.ship.angle;
                const dot = dx * Math.cos(angle) + dy * Math.sin(angle);

                if (dot > 0 && dot < laserLength) {
                    const perpX = game.ship.x + Math.cos(angle) * dot;
                    const perpY = game.ship.y + Math.sin(angle) * dot;
                    const perpDist = dist(perpX, perpY, a.x, a.y);

                    if (perpDist < a.radius && dot < closestDist) {
                        closestHit = a;
                        closestDist = dot;
                        hitType = 'asteroid';
                    }
                }
            }

            // Check UFOs
            for (const u of game.ufos) {
                const dx = u.x - game.ship.x;
                const dy = u.y - game.ship.y;
                const angle = game.ship.angle;
                const dot = dx * Math.cos(angle) + dy * Math.sin(angle);

                if (dot > 0 && dot < laserLength) {
                    const perpX = game.ship.x + Math.cos(angle) * dot;
                    const perpY = game.ship.y + Math.sin(angle) * dot;
                    const perpDist = dist(perpX, perpY, u.x, u.y);

                    if (perpDist < u.radius && dot < closestDist) {
                        closestHit = u;
                        closestDist = dot;
                        hitType = 'ufo';
                    }
                }
            }

            if (closestHit) {
                // Initialize HP if needed (for asteroids without hp set)
                if (hitType === 'asteroid' && closestHit.hp === undefined) {
                    closestHit.hp = closestHit.size === 'large' ? 100 : (closestHit.size === 'medium' ? 50 : 25);
                }

                closestHit.hp -= damagePerFrame;

                // Chain Laser Synergy (Laser + Piercing) - only for asteroids
                if (game.ship.piercing && hitType === 'asteroid') {
                    let secondaryHit = null;
                    let shortestDist = 200; // Chain radius

                    for (const otherA of game.asteroids) {
                        if (otherA === closestHit) continue;
                        const d = dist(closestHit.x, closestHit.y, otherA.x, otherA.y);
                        if (d < shortestDist) {
                            shortestDist = d;
                            secondaryHit = otherA;
                        }
                    }

                    if (secondaryHit) {
                        // Apply half damage to chained target
                        if (secondaryHit.hp === undefined) {
                            secondaryHit.hp = secondaryHit.size === 'large' ? 100 : (secondaryHit.size === 'medium' ? 50 : 25);
                        }
                        secondaryHit.hp -= damagePerFrame * 0.5;

                        // Visuals for Chain
                        const ctx = document.getElementById('gameCanvas').getContext('2d');
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(closestHit.x, closestHit.y);
                        ctx.lineTo(secondaryHit.x, secondaryHit.y);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#00ff88'; // Piercing color
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#00ff88';
                        ctx.stroke();
                        ctx.restore();

                        if (secondaryHit.hp <= 0) {
                            secondaryHit.markedForDeletion = true;
                            // Visuals for secondary death could be added here
                        }
                    }
                }

                if (closestHit.hp <= 0) {
                    closestHit.markedForDeletion = true;
                    game.credits += closestHit.scoreValue || 10;

                    // Explosion particles - use appropriate color
                    const explosionColor = hitType === 'ufo' ? CONFIG.UFO.COLOR : CONFIG.VISUALS.COLORS.ASTEROID;
                    for (let i = 0; i < CONFIG.VISUALS.PARTICLES.EXPLOSION_COUNT; i++) {
                        game.particles.push(new Particle(
                            closestHit.x, closestHit.y,
                            explosionColor,
                            rand(CONFIG.VISUALS.PARTICLES.SPEED_MIN, CONFIG.VISUALS.PARTICLES.SPEED_MAX),
                            rand(0, Math.PI * 2),
                            rand(CONFIG.VISUALS.PARTICLES.LIFE_MIN, CONFIG.VISUALS.PARTICLES.LIFE_MAX)
                        ));
                    }

                    // Shockwave
                    game.particles.push(new Particle(
                        closestHit.x, closestHit.y,
                        '#fff',
                        100,
                        0,
                        0.5,
                        'shockwave'
                    ));

                    // Asteroid-specific: split into smaller asteroids
                    if (hitType === 'asteroid') {
                        if (closestHit.size === 'large') {
                            game.asteroids.push(new Asteroid(closestHit.x, closestHit.y, 'medium', game.wave));
                            game.asteroids.push(new Asteroid(closestHit.x, closestHit.y, 'medium', game.wave));
                        } else if (closestHit.size === 'medium') {
                            game.asteroids.push(new Asteroid(closestHit.x, closestHit.y, 'small', game.wave));
                            game.asteroids.push(new Asteroid(closestHit.x, closestHit.y, 'small', game.wave));
                        }
                    }

                    // Powerup drop - use appropriate drop chance
                    const dropChance = hitType === 'ufo' ? CONFIG.UFO.DROP_CHANCE : CONFIG.POWERUP.DROP_CHANCE;
                    if (Math.random() < dropChance) {
                        const types = Object.keys(CONFIG.POWERUP.TYPES);
                        const totalWeight = types.reduce((sum, type) => sum + CONFIG.POWERUP.TYPES[type].WEIGHT, 0);
                        let random = Math.random() * totalWeight;

                        let selectedType = types[0];
                        for (const type of types) {
                            random -= CONFIG.POWERUP.TYPES[type].WEIGHT;
                            if (random <= 0) {
                                selectedType = type;
                                break;
                            }
                        }

                        game.powerups.push(new PowerUp(closestHit.x, closestHit.y, selectedType));
                    }
                }
            }
        }
    }
}
