import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { CONFIG } from '../config.js';
import { dist } from '../utils.js';

export class Drone extends Entity {
    constructor(ship, offsetAngle) {
        super(ship.x, ship.y, CONFIG.DRONE.RADIUS);
        this.ship = ship;
        this.orbitAngle = offsetAngle;
        this.orbitRadius = CONFIG.DRONE.ORBIT_RADIUS;
        this.orbitSpeed = CONFIG.DRONE.ORBIT_SPEED;
        this.lastShotTime = 0;
        this.fireRate = CONFIG.DRONE.FIRE_RATE;
    }

    update(dt, asteroids, game) {
        // Orbit logic
        this.orbitAngle += this.orbitSpeed * dt;
        this.x = this.ship.x + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.y = this.ship.y + Math.sin(this.orbitAngle) * this.orbitRadius;

        super.update(dt); // Handle screen wrap if ship wraps (though attached to ship usually)

        // Shooting logic
        const now = Date.now() / 1000;
        if (now - this.lastShotTime >= this.fireRate) {
            let closest = null;
            let closestDist = CONFIG.DRONE.RANGE;

            // Check asteroids
            for (const a of asteroids) {
                const d = dist(this.x, this.y, a.x, a.y);
                if (d < closestDist) {
                    closestDist = d;
                    closest = a;
                }
            }

            // Check UFOs
            if (game.ufos) {
                for (const u of game.ufos) {
                    const d = dist(this.x, this.y, u.x, u.y);
                    if (d < closestDist) {
                        closestDist = d;
                        closest = u;
                    }
                }
            }

            if (closest) {
                this.lastShotTime = now;
                const angle = Math.atan2(closest.y - this.y, closest.x - this.x);
                // Drones shoot normal bullets but maybe smaller or different color?
                // Using standard bullet for now but could customize
                const isExplosive = this.ship.explosive;
                game.bullets.push(new Bullet(this.x, this.y, angle, {
                    color: isExplosive ? CONFIG.POWERUP.TYPES.EXPLOSIVE.COLOR : CONFIG.VISUALS.COLORS.DRONE,
                    damage: this.ship.droneDamage,
                    explosive: isExplosive
                }));
            }
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.orbitAngle); // Just for visual rotation if we had a sprite

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = CONFIG.VISUALS.COLORS.DRONE;
        ctx.shadowBlur = 5;
        ctx.shadowColor = CONFIG.VISUALS.COLORS.DRONE;
        ctx.fill();

        // Little "eye"
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(2, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
