import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { CANVAS } from '../canvas.js';

export class Bullet extends Entity {
    constructor(x, y, angle, properties = {}) {
        super(x, y, CONFIG.BULLET.RADIUS);
        this.speed = properties.speed || CONFIG.BULLET.SPEED;
        this.angle = angle;
        this.velX = Math.cos(angle) * this.speed;
        this.velY = Math.sin(angle) * this.speed;
        this.life = CONFIG.BULLET.LIFE; // seconds
        this.enemy = properties.enemy || false;

        // Properties
        this.homing = properties.homing || false;
        this.explosive = properties.explosive || false;
        this.piercing = properties.piercing || false;
        this.color = properties.color || CONFIG.VISUALS.COLORS.BULLET;
        this.damage = properties.damage || 10; // Default damage if not provided
        this.bounce = properties.bounce || false;

        if (this.piercing) {
            this.hitCount = 0;
            this.maxHits = CONFIG.POWERUP.TYPES.PIERCING.MAX_HITS;
        }
    }

    update(dt, asteroids = []) {
        dt *= (this.timeScale || 1.0);
        if (this.homing) {
            let closest = null;
            let closestDist = CONFIG.POWERUP.TYPES.HOMING.DETECTION_RADIUS;

            for (const a of asteroids) {
                const d = Math.hypot(a.x - this.x, a.y - this.y);
                if (d < closestDist) {
                    closestDist = d;
                    closest = a;
                }
            }

            if (closest) {
                const targetAngle = Math.atan2(closest.y - this.y, closest.x - this.x);
                let diff = targetAngle - this.angle;

                // Normalize angle difference
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;

                const turnAmount = CONFIG.POWERUP.TYPES.HOMING.TURN_SPEED * dt;

                if (Math.abs(diff) < turnAmount) {
                    this.angle = targetAngle;
                } else {
                    this.angle += Math.sign(diff) * turnAmount;
                }

                // Update velocity based on new angle
                this.velX = Math.cos(this.angle) * this.speed;
                this.velY = Math.sin(this.angle) * this.speed;
            }
        }

        this.x += this.velX * dt;
        this.y += this.velY * dt;
        this.life -= dt;
        if (this.life <= 0) this.markedForDeletion = true;

        if (this.bounce) {
            if (this.x < 0 || this.x > CANVAS.width) {
                this.velX *= -1;
                this.angle = Math.atan2(this.velY, this.velX);
                // Clamp to edges to prevent sticking
                this.x = Math.max(0, Math.min(this.x, CANVAS.width));
            }
            if (this.y < 0 || this.y > CANVAS.height) {
                this.velY *= -1;
                this.angle = Math.atan2(this.velY, this.velX);
                // Clamp to edges to prevent sticking
                this.y = Math.max(0, Math.min(this.y, CANVAS.height));
            }
        } else {
            super.update(dt);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }
}
