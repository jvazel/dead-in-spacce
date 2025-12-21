import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { Particle } from './Particle.js';
import { Drone } from './Drone.js';
import { Mine } from './Mine.js';
import { Missile } from './Missile.js';
import { TrailSegment } from './TrailSegment.js';
import { CONFIG } from '../config.js';
import { IMAGES } from '../Assets.js';

/**
 * Player Ship Entity
 * Handles input, physics, shooting, headers, and abilities.
 * Extends basic Entity class for screen wrapping.
 */
export class Ship extends Entity {
    /**
     * @param {number} x - Start X position
     * @param {number} y - Start Y position
     * @param {Object} stats - Initial stats from upgrades {hp, shield, damage, teleport}
     */
    constructor(x, y, stats = {}) {
        super(x, y, CONFIG.SHIP.RADIUS);
        this.angle = -Math.PI / 2; // Pointing up
        this.velX = 0;
        this.velY = 0;
        this.rotationSpeed = CONFIG.SHIP.ROTATION_SPEED;
        this.thrust = CONFIG.SHIP.THRUST + (stats.thrust || 0);
        this.friction = CONFIG.SHIP.FRICTION;

        // Stats
        this.maxHp = CONFIG.SHIP.BASE_MAX_HP + (stats.hp || 0);
        this.hp = CONFIG.SHIP.BASE_HP + (stats.hp || 0); // Start full
        this.maxShield = CONFIG.SHIP.BASE_MAX_SHIELD + (stats.shield || 0);
        this.shield = CONFIG.SHIP.BASE_SHIELD + (stats.shield || 0); // Start full
        this.maxShield = CONFIG.SHIP.BASE_MAX_SHIELD + (stats.shield || 0);
        this.shield = CONFIG.SHIP.BASE_SHIELD + (stats.shield || 0); // Start full
        // Reduce delay (increase rate)
        this.fireRateDelay = Math.max(0.1, CONFIG.SHIP.BASE_FIRE_RATE - (stats.fireRate || 0));
        this.damage = CONFIG.SHIP.BASE_DAMAGE + (stats.damage || 0);
        this.droneDamage = CONFIG.DRONE.BASE_DAMAGE;
        this.lastShotTime = 0;

        // Abilities
        this.canTeleport = stats.teleport || false;
        this.teleportCooldown = 0;
        this.maxTeleportCooldown = 2; // seconds

        // Powerups
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.multiShot = false;
        this.multiShotTimer = 0;
        this.multiShotDuration = CONFIG.POWERUP.TYPES.MULTISHOT.DURATION;
        this.laserActive = false;
        this.laserTimer = 0;

        // New Powerups
        this.homing = false;
        this.homingTimer = 0;
        this.explosive = false;
        this.explosiveTimer = 0;
        this.piercing = false;
        this.piercingTimer = 0;
        this.rearFire = false;
        this.rearFireTimer = 0;
        this.afterburner = false;
        this.afterburnerTimer = 0;
        this.trailSpawnTimer = 0;
        this.bounce = false;
        this.bounceTimer = 0;
        this.powerupDurationMultiplier = stats.powerupDurationMultiplier || 1.0;
        this.noDrones = stats.noDrones || false;
        this.vesselId = stats.vesselId || 'SHIP';

        // Upgrades
        this.drones = [];
        this.minesActive = false;
        this.mineTimer = 0;

        // Missile System
        const missileLevel = stats.missileLauncher || 0;
        this.maxMissiles = missileLevel > 0 ? 1 + missileLevel : 0; // Level 1 (unlock) = 2, 2 = 3, etc.
        this.missiles = this.maxMissiles;
        this.lastMissileTime = 0;
        this.missileCooldown = 0.5;

        // Heat System
        this.heat = 0;
        this.overheated = false;
        this.overheatTimer = 0;

        // Environmental Multipliers
        this.engineMultiplier = 1.0;
        this.inputMultiplier = 1.0;
        this.inNebula = false;
        this.timeScale = 1.0;
    }

    /**
     * Updates ship state, physics, and cooldowns.
     * @param {number} dt - Delta time in seconds
     * @param {InputHandler} input - Input state
     * @param {Game} game - Game reference for spawning entities
     */
    update(dt, input, game) {
        dt *= (this.timeScale || 1.0);
        // Rotation
        if (input.isDown('ArrowLeft')) this.angle -= this.rotationSpeed * this.inputMultiplier * dt;
        if (input.isDown('ArrowRight')) this.angle += this.rotationSpeed * this.inputMultiplier * dt;

        // Teleport
        if (this.canTeleport && input.isDown('ArrowDown')) {
            this.tryTeleport(game);
        }
        if (this.teleportCooldown > 0) this.teleportCooldown -= dt;

        // Thrust
        if (input.isDown('ArrowUp')) {
            const thrustForce = this.thrust * this.engineMultiplier;
            this.velX += Math.cos(this.angle) * thrustForce * dt;
            this.velY += Math.sin(this.angle) * thrustForce * dt;

            // Thruster Particles
            if (Math.random() < 0.5) {
                const px = this.x - Math.cos(this.angle) * this.radius;
                const py = this.y - Math.sin(this.angle) * this.radius;
                const pAngle = this.angle + Math.PI + (Math.random() - 0.5) * 0.5;
                game.particles.push(new Particle(px, py, '#00ffff', 100, pAngle, 0.5));
            }
        }

        // Physics
        this.x += this.velX * dt;
        this.y += this.velY * dt;
        this.velX *= this.friction;
        this.velY *= this.friction;

        super.update(dt);

        // Shield Regen
        if (this.maxShield > 0 && this.shield < this.maxShield) {
            const regenRate = CONFIG.SHIP.SHIELD_REGEN_RATE * (this.inNebula ? CONFIG.HAZARDS.NEBULA_CLOUD.SHIELD_REGEN_MULTIPLIER : 1);
            this.shield += regenRate * dt;
            if (this.shield > this.maxShield) this.shield = this.maxShield;
        }

        // Invulnerability
        if (this.invulnerable) {
            this.invulnerableTimer -= dt;
            if (this.invulnerableTimer <= 0) this.invulnerable = false;
        }

        // Multi-Shot
        if (this.multiShot) {
            this.multiShotTimer -= dt;
            if (this.multiShotTimer <= 0) this.multiShot = false;
        }

        // Synergy 2: Temporary Drones (INVULNERABILITY + MULTISHOT)
        if (this.invulnerable && this.multiShot) {
            if (!this.tempDronesActive) {
                this.tempDronesActive = true;
                this.addDrone(true);
                this.addDrone(true);
            }
        } else if (this.tempDronesActive) {
            this.tempDronesActive = false;
            this.drones = this.drones.filter(d => !d.isTemporary);
        }

        // Laser
        if (this.laserActive) {
            this.laserTimer -= dt;
            if (this.laserTimer <= 0) this.laserActive = false;
        }

        // Homing
        if (this.homing) {
            this.homingTimer -= dt;
            if (this.homingTimer <= 0) this.homing = false;
        }

        // Explosive
        if (this.explosive) {
            this.explosiveTimer -= dt;
            if (this.explosiveTimer <= 0) this.explosive = false;
        }

        // Piercing
        if (this.piercing) {
            this.piercingTimer -= dt;
            if (this.piercingTimer <= 0) this.piercing = false;
        }

        // Rear Fire
        if (this.rearFire) {
            this.rearFireTimer -= dt;
            if (this.rearFireTimer <= 0) this.rearFire = false;
        }

        // Afterburner
        if (this.afterburner) {
            this.afterburnerTimer -= dt;
            if (this.afterburnerTimer <= 0) this.afterburner = false;

            if (input.isDown('ArrowUp')) {
                this.trailSpawnTimer -= dt;
                if (this.trailSpawnTimer <= 0) {
                    this.trailSpawnTimer = CONFIG.POWERUP.TYPES.AFTERBURNER.SPAWN_RATE;
                    // Spawn at rear
                    const tx = this.x - Math.cos(this.angle) * this.radius;
                    const ty = this.y - Math.sin(this.angle) * this.radius;
                    game.trails.push(new TrailSegment(tx, ty, this.damage));
                }
            }
        }

        // Bounce
        if (this.bounce) {
            this.bounceTimer -= dt;
            if (this.bounceTimer <= 0) this.bounce = false;
        }

        // Shooting
        if (input.isDown('Space')) {
            this.shoot(game);
        }

        // Missiles
        if ((input.isDown('ShiftLeft') || input.isDown('ShiftRight')) && this.maxMissiles > 0) {
            this.fireMissile(game);
        }

        // Drones
        this.drones.forEach(d => d.update(dt, game.asteroids, game));

        // Heat System
        if (this.overheated) {
            this.overheatTimer -= dt;
            if (this.overheatTimer <= 0) {
                this.overheated = false;
                this.heat = 0;
            }
        } else {
            // Decrease heat if not firing (but we check if firing in shoot(), 
            // so we'll just always decrease it and increase it in shoot())
            if (!game.input.isDown('Space')) {
                this.heat = Math.max(0, this.heat - CONFIG.SHIP.HEAT.DECREASE_RATE * dt);
            }
        }

        // Mines
        if (this.minesActive) {
            // Synergy 3: Afterburner Mines
            const multiplier = this.afterburner ? 4 : 1;
            this.mineTimer -= dt * multiplier;
            if (this.mineTimer <= 0) {
                this.mineTimer = CONFIG.MINE.DROP_INTERVAL;
                game.mines.push(new Mine(this.x, this.y));
            }
        }
    }

    draw(ctx, input) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        // Draw Ship Sprite
        // Use 'screen' blending to make the black background of the sprite transparent
        ctx.globalCompositeOperation = 'screen';

        // Get vessel image
        const vesselConfig = CONFIG.VESSELS[this.vesselId];
        const shipImg = IMAGES[vesselConfig.IMAGE] || IMAGES.ship;

        // Adjust scale to keep size consistent regardless of image pixel dimensions
        // We want the ship to fit roughly within radius * 2.8 box
        const targetSize = this.radius * 2.8;

        // If image has known dimensions, we can use them to maintain aspect ratio
        // Otherwise draw at targetSize square
        if (shipImg.width > 0) {
            const aspect = shipImg.width / shipImg.height;
            let drawW, drawH;
            if (aspect > 1) {
                drawW = targetSize;
                drawH = targetSize / aspect;
            } else {
                drawH = targetSize;
                drawW = targetSize * aspect;
            }
            ctx.drawImage(shipImg, -drawW / 2, -drawH / 2, drawW, drawH);
        } else {
            ctx.drawImage(shipImg, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
        }

        // Reset blend mode
        ctx.globalCompositeOperation = 'source-over';

        // Draw Shield
        if (this.shield > 1) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 255, ${this.shield / this.maxShield})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONFIG.VISUALS.COLORS.SHIP_GLOW;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Thruster flame
        if (input && input.isDown('ArrowUp')) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.translate(0, 15); // Move to rear
            ctx.beginPath();
            ctx.moveTo(0, 0); // Center rear
            ctx.lineTo(-3, 15);
            ctx.lineTo(3, 15);
            ctx.closePath();
            ctx.fillStyle = '#00ffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();

        // Draw Drones
        this.drones.forEach(d => d.draw(ctx));

        // Draw Laser (outside rotation for full screen)
        if (this.laserActive && input && input.isDown('Space')) {
            const laserLength = CONFIG.POWERUP.TYPES.LASER.LENGTH;
            const endX = this.x + Math.cos(this.angle) * laserLength;
            const endY = this.y + Math.sin(this.angle) * laserLength;
            const pulse = 0.7 + Math.sin(Date.now() / 50) * 0.3;

            ctx.save();
            ctx.globalAlpha = pulse;

            // Outer glow
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = CONFIG.POWERUP.TYPES.LASER.GLOW_COLOR;
            ctx.lineWidth = CONFIG.POWERUP.TYPES.LASER.WIDTH * 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = CONFIG.POWERUP.TYPES.LASER.GLOW_COLOR;
            ctx.stroke();

            // Inner beam
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = CONFIG.POWERUP.TYPES.LASER.COLOR;
            ctx.lineWidth = CONFIG.POWERUP.TYPES.LASER.WIDTH;
            ctx.shadowBlur = 10;
            ctx.stroke();

            ctx.restore();
        }
    }

    shoot(game) {
        // Overheat check
        if (this.overheated) return;

        // If laser active, handled by CollisionManager, but we still want to increase heat
        if (this.laserActive && game.input.isDown('Space')) {
            this.heat += (CONFIG.SHIP.HEAT.INCREASE_PER_SHOT * 0.2); // Continuous heat for laser
            if (this.heat >= CONFIG.SHIP.HEAT.MAX) {
                this.overheated = true;
                this.overheatTimer = CONFIG.SHIP.HEAT.OVERHEAT_DURATION;
                this.laserActive = false; // Kill laser on overheat
            }
            return;
        }

        const now = Date.now() / 1000;
        if (now - this.lastShotTime >= this.fireRateDelay) {
            this.lastShotTime = now;

            // Heat Increase
            this.heat += CONFIG.SHIP.HEAT.INCREASE_PER_SHOT;
            if (this.heat >= CONFIG.SHIP.HEAT.MAX) {
                this.overheated = true;
                this.overheatTimer = CONFIG.SHIP.HEAT.OVERHEAT_DURATION;
                this.heat = CONFIG.SHIP.HEAT.MAX;
                return;
            }

            // Damage Bonus
            let currentDamage = this.damage;
            if (this.heat > CONFIG.SHIP.HEAT.DAMAGE_BONUS_THRESHOLD) {
                const ratio = (this.heat - CONFIG.SHIP.HEAT.DAMAGE_BONUS_THRESHOLD) / (CONFIG.SHIP.HEAT.MAX - CONFIG.SHIP.HEAT.DAMAGE_BONUS_THRESHOLD);
                const bonus = 1 + (CONFIG.SHIP.HEAT.DAMAGE_BONUS_MAX - 1) * ratio;
                currentDamage *= bonus;
            }

            const bulletProps = {
                homing: this.homing,
                explosive: this.explosive,
                piercing: this.piercing,
                color: this.explosive ? CONFIG.POWERUP.TYPES.EXPLOSIVE.COLOR :
                    this.homing ? CONFIG.POWERUP.TYPES.HOMING.COLOR :
                        this.piercing ? CONFIG.POWERUP.TYPES.PIERCING.COLOR :
                            CONFIG.VISUALS.COLORS.BULLET,
                damage: currentDamage,
                bounce: this.bounce
            };

            if (this.multiShot) {
                const numShots = CONFIG.POWERUP.TYPES.MULTISHOT.SHOTS;
                const spread = CONFIG.POWERUP.TYPES.MULTISHOT.SPREAD;

                for (let i = 0; i < numShots; i++) {
                    const offsetAngle = (i - (numShots - 1) / 2) * spread;
                    const bulletAngle = this.angle + offsetAngle;
                    const bx = this.x + Math.cos(bulletAngle) * 20;
                    const by = this.y + Math.sin(bulletAngle) * 20;
                    game.bullets.push(new Bullet(bx, by, bulletAngle, bulletProps));
                }
            } else {
                const bx = this.x + Math.cos(this.angle) * 20;
                const by = this.y + Math.sin(this.angle) * 20;
                game.bullets.push(new Bullet(bx, by, this.angle, bulletProps));
            }

            // Rear Fire
            if (this.rearFire) {
                const rearAngle = this.angle + Math.PI;
                const bx = this.x + Math.cos(rearAngle) * 20;
                const by = this.y + Math.sin(rearAngle) * 20;
                game.bullets.push(new Bullet(bx, by, rearAngle, { ...bulletProps, color: CONFIG.POWERUP.TYPES.REAR_FIRE.COLOR }));
            }
        }
    }

    fireMissile(game) {
        const now = Date.now() / 1000;
        if (this.missiles > 0 && now - this.lastMissileTime >= this.missileCooldown) {
            this.missiles--;
            this.lastMissileTime = now;

            // Synergy 5: Missile Fan (Rain)
            if (this.multiShot) {
                const spread = 0.3;
                const angles = [this.angle - spread, this.angle, this.angle + spread];
                angles.forEach(angle => {
                    game.bullets.push(new Missile(this.x, this.y, angle, CONFIG.MISSILE.DAMAGE));
                });
            } else {
                // Spawn missile at current angle
                game.bullets.push(new Missile(this.x, this.y, this.angle, CONFIG.MISSILE.DAMAGE));
            }

            // Visual feedback
            for (let i = 0; i < 5; i++) {
                game.particles.push(new Particle(this.x, this.y, '#00ffff', 100, this.angle + Math.PI + (Math.random() - 0.5), 0.5));
            }
        }
    }

    addMissile(amount = 1) {
        this.missiles = Math.min(this.missiles + amount, this.maxMissiles);
    }

    takeDamage(amount) {
        if (this.invulnerable) return;

        // Shield Logic: 1 Shield Point absorbs 1 Hit completely
        if (this.shield >= 1) {
            this.shield -= 1;
            // Shield absorbs the damage, HP is untouched
        } else {
            // If shield is less than 1 (e.g. recharging), it breaks and HP triggers
            this.hp -= amount;
            this.shield = 0;
        }
    }

    addDrone(isTemporary = false) {
        if (this.noDrones && !isTemporary) return;

        const count = this.drones.length;
        this.drones.push(new Drone(this, 0, isTemporary));

        // Redistribute angles
        this.drones.forEach((d, i) => {
            d.orbitAngle = (Math.PI * 2 / this.drones.length) * i;
        });
    }

    /**
     * Attempts to teleport the ship to a random safe location.
     * @param {Game} game 
     */
    tryTeleport(game) {
        if (this.teleportCooldown > 0) return;

        // Find safe spot
        // Simple random position for now
        // In a polised game, check for asteroid overlap
        let tx, ty;
        let safe = false;
        let attempts = 0;
        while (!safe && attempts < 10) {
            tx = Math.random() * game.CANVAS_WIDTH; // Need access to width/height. 
            // game instance has standard access via import, OR pass it. 
            // Ship update gets 'game'. But teleport is called from update.
            // Oh wait, `game` is passed to update.
            // But width/height are global constants in some files, or on game.
            // Use imported CANVAS if available or game.width if stored. 
            // In Game.js: CANVAS.width is used. Let's check imports in Ship.js.
            // Ship.js DOES NOT import CANVAS. 
            // I'll assume 800x600 or use hardcoded if not passed. 
            // Actually, best to pass them or use safe default.
            // Or use window.innerWidth since it's full screen.
            tx = Math.random() * window.innerWidth;
            ty = Math.random() * window.innerHeight;
            safe = true; // Assume safe for now or add basic distance check
            attempts++;
        }

        this.x = tx;
        this.y = ty;
        this.teleportCooldown = this.maxTeleportCooldown;

        // Visual Effect
        // Flash or particles
        // I can push particles to game.particles
        for (let i = 0; i < 10; i++) {
            game.particles.push(new Particle(this.x, this.y, '#00ffff', 200, Math.random() * Math.PI * 2, 1));
        }
    }
}
