import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { dist } from '../utils.js';
import { Particle } from './Particle.js';

export class Missile extends Entity {
    constructor(x, y, angle, damage) {
        super(x, y, CONFIG.MISSILE.RADIUS);
        this.angle = angle;
        this.damage = damage;
        this.speed = CONFIG.MISSILE.SPEED;
        this.life = CONFIG.MISSILE.LIFE;
        this.turnSpeed = CONFIG.MISSILE.TURN_SPEED;
        this.detectionRadius = CONFIG.MISSILE.DETECTION_RADIUS;

        this.velX = Math.cos(angle) * this.speed;
        this.velY = Math.sin(angle) * this.speed;

        this.target = null;
    }

    update(dt, asteroids, ufos, boss) {
        this.life -= dt;
        if (this.life <= 0) {
            this.markedForDeletion = true;
            return;
        }

        // Homing Logic
        this.findTarget(asteroids, ufos, boss);
        if (this.target && !this.target.markedForDeletion) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const targetAngle = Math.atan2(dy, dx);

            // Smooth rotation towards target
            let diff = targetAngle - this.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;

            this.angle += diff * this.turnSpeed * dt;
        }

        this.velX = Math.cos(this.angle) * this.speed;
        this.velY = Math.sin(this.angle) * this.speed;

        this.x += this.velX * dt;
        this.y += this.velY * dt;

        super.update(dt); // Wrap screen? Missiles usually don't wrap in rogue-lites to avoid confusion, but we can if we want.
        // Let's allow wrap for now since it's Space Rock.
    }

    findTarget(asteroids, ufos, boss) {
        if (this.target && !this.target.markedForDeletion) {
            // Keep target or re-evaluate proximity
            return;
        }

        let closest = null;
        let minD = this.detectionRadius;

        // Priority 1: Boss
        if (boss && !boss.markedForDeletion) {
            const d = dist(this.x, this.y, boss.x, boss.y);
            if (d < minD) {
                this.target = boss;
                return;
            }
        }

        // Priority 2: UFOs
        if (ufos) {
            ufos.forEach(u => {
                const d = dist(this.x, this.y, u.x, u.y);
                if (d < minD) {
                    minD = d;
                    closest = u;
                }
            });
        }
        if (closest) {
            this.target = closest;
            return;
        }

        // Priority 3: Asteroids
        asteroids.forEach(a => {
            const d = dist(this.x, this.y, a.x, a.y);
            if (d < minD) {
                minD = d;
                closest = a;
            }
        });

        this.target = closest;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Flame trail
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-12, 3);
        ctx.lineTo(-20, 0);
        ctx.lineTo(-12, -3);
        ctx.closePath();
        ctx.fillStyle = '#ff4400';
        ctx.fill();

        // Missile body
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-8, 5);
        ctx.lineTo(-8, -5);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();

        // Tip glow
        ctx.beginPath();
        ctx.arc(8, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#f00';
        ctx.fill();

        ctx.restore();
    }
}
