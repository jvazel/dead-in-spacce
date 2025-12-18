import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { CONFIG } from '../config.js';
import { IMAGES } from '../Assets.js';
import { dist } from '../utils.js';

/**
 * Boss Entity
 * Powerful enemy with unique behavior and attack phases.
 */
export class Boss extends Entity {
    /**
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} wave - Current wave multiplier
     */
    constructor(x, y, wave) {
        super(x, y, CONFIG.BOSS.RADIUS);
        this.maxHp = CONFIG.BOSS.HP * (1 + (wave * 0.2));
        this.hp = this.maxHp;
        this.speed = CONFIG.BOSS.SPEED;
        this.angle = 0;
        this.attackTimer = 0;
        this.phase = 1; // 1: Circular fire, 2: Targeted burst
        this.phaseTimer = 0;

        this.targetX = x;
        this.targetY = y;
    }

    update(dt, game) {
        if (!game.ship) return;

        this.phaseTimer += dt;
        if (this.phaseTimer > 10) {
            this.phase = this.phase === 1 ? 2 : 1;
            this.phaseTimer = 0;
        }

        // Movement: Slowly drift towards the center or player area
        const distToPlayer = dist(this.x, this.y, game.ship.x, game.ship.y);
        if (distToPlayer > 300) {
            const dx = game.ship.x - this.x;
            const dy = game.ship.y - this.y;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * this.speed * dt;
            this.y += Math.sin(angle) * this.speed * dt;
        }

        // Attack patterns
        this.attackTimer += dt;
        if (this.attackTimer >= CONFIG.BOSS.ATTACK_RATE) {
            this.attackTimer = 0;
            if (this.phase === 1) {
                this.circularFire(game);
            } else {
                this.targetedBurst(game);
            }
        }

        super.update(dt);
    }

    circularFire(game) {
        const numBullets = 12;
        const spread = (Math.PI * 2) / numBullets;
        for (let i = 0; i < numBullets; i++) {
            const angle = i * spread + (Date.now() / 1000); // Rotating spiral
            game.bullets.push(new Bullet(this.x, this.y, angle, {
                color: CONFIG.BOSS.COLOR,
                damage: 10,
                speed: CONFIG.BOSS.BULLET_SPEED,
                enemy: true
            }));
        }
    }

    targetedBurst(game) {
        const angle = Math.atan2(game.ship.y - this.y, game.ship.x - this.x);
        for (let i = -1; i <= 1; i++) {
            const burstAngle = angle + (i * 0.2);
            game.bullets.push(new Bullet(this.x, this.y, burstAngle, {
                color: CONFIG.BOSS.COLOR,
                damage: 15,
                speed: CONFIG.BOSS.BULLET_SPEED * 1.5,
                enemy: true
            }));
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw Boss Sprite
        ctx.globalCompositeOperation = 'screen';
        const size = this.radius * 2.5;
        if (IMAGES.boss.complete) {
            ctx.drawImage(IMAGES.boss, -size / 2, -size / 2, size, size);
        } else {
            // Placeholder
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.BOSS.COLOR;
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';

        // HP Bar
        const barWidth = 100;
        const barHeight = 10;
        ctx.fillStyle = '#333';
        ctx.fillRect(-barWidth / 2, -this.radius - 20, barWidth, barHeight);
        ctx.fillStyle = '#f00';
        ctx.fillRect(-barWidth / 2, -this.radius - 20, barWidth * (this.hp / this.maxHp), barHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(-barWidth / 2, -this.radius - 20, barWidth, barHeight);

        ctx.restore();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.markedForDeletion = true;
        }
    }
}
