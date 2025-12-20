import { Entity } from '../Entity.js';
import { CONFIG } from '../../config.js';
import { IMAGES } from '../../Assets.js';

/**
 * BossBase Entity
 * Abstract base class for bosses.
 */
export class BossBase extends Entity {
    /**
     * @param {number} x - Start X
     * @param {number} y - Start Y
     * @param {number} wave - Current wave multiplier
     */
    constructor(x, y, wave, image = IMAGES.boss) {
        super(x, y, CONFIG.BOSS.RADIUS);
        this.image = image;
        this.maxHp = CONFIG.BOSS.HP * (1 + (wave * 0.2));
        this.hp = this.maxHp;
        this.speed = CONFIG.BOSS.SPEED;
        this.angle = 0;
        this.attackTimer = 0;
        this.phase = 1;
        this.phaseTimer = 0;
    }

    update(dt, game) {
        super.update(dt);
        // Common update logic if any
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw Boss Sprite (can be overridden or customized by subclasses if they have different sprites)
        // For now, we assume all bosses use the same sprite or fallback
        this.drawSprite(ctx);

        // HP Bar
        this.drawHealthBar(ctx);

        ctx.restore();
    }

    drawSprite(ctx) {
        ctx.globalCompositeOperation = 'screen';
        const size = this.radius * 2.5;
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, -size / 2, -size / 2, size, size);
        } else {
            // Placeholder
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.BOSS.COLOR;
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    drawHealthBar(ctx) {
        const barWidth = 100;
        const barHeight = 10;
        ctx.fillStyle = '#333';
        ctx.fillRect(-barWidth / 2, -this.radius - 20, barWidth, barHeight);
        ctx.fillStyle = '#f00';
        ctx.fillRect(-barWidth / 2, -this.radius - 20, barWidth * (this.hp / this.maxHp), barHeight);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(-barWidth / 2, -this.radius - 20, barWidth, barHeight);
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.markedForDeletion = true;
        }
    }
}
