import { BossBase } from './BossBase.js';
import { Bullet } from '../Bullet.js';
import { Mine } from '../Mine.js';
import { CONFIG } from '../../config.js';
import { CANVAS } from '../../canvas.js';
import { IMAGES } from '../../Assets.js';

/**
 * BossBeta Entity
 * New boss variant with Tri-shot and Mine Layer patterns.
 * Moves in a figure-8 pattern or horizontal sweep.
 */
export class BossBeta extends BossBase {
    constructor(x, y, wave) {
        super(x, y, wave, IMAGES.boss_beta || IMAGES.boss); // Fallback
        this.time = 0;
        this.centerX = CANVAS.width / 2;
        this.centerY = CANVAS.height / 3;
        this.moveRadiusX = CANVAS.width / 3;
        this.moveRadiusY = 100;
    }

    update(dt, game) {
        dt *= (this.timeScale || 1.0);
        if (!game.ship) return;

        this.time += dt;
        this.phaseTimer += dt;
        if (this.phaseTimer > 8) { // Switch phases every 8 seconds
            this.phase = this.phase === 1 ? 2 : 1;
            this.phaseTimer = 0;
        }

        // Movement: Figure-8 pattern
        this.x = this.centerX + Math.cos(this.time * 0.5) * this.moveRadiusX;
        this.y = this.centerY + Math.sin(this.time) * this.moveRadiusY;

        // Attack patterns
        this.attackTimer += dt;
        // Phase 1: Tri-shot (faster fire rate)
        if (this.phase === 1 && this.attackTimer >= 0.8) {
            this.attackTimer = 0;
            this.triShot(game);
        }
        // Phase 2: Mine Layer (slower fire rate)
        else if (this.phase === 2 && this.attackTimer >= 2.0) {
            this.attackTimer = 0;
            this.spawnMine(game);
        }

        super.update(dt, game);
    }

    triShot(game) {
        const angle = Math.atan2(game.ship.y - this.y, game.ship.x - this.x);
        const spread = 0.3; // Radians

        for (let i = -1; i <= 1; i++) {
            const shotAngle = angle + (i * spread);
            game.bullets.push(new Bullet(this.x, this.y, shotAngle, {
                color: '#ff00ff', // Magenta bullets for Beta
                damage: 12,
                speed: CONFIG.BOSS.BULLET_SPEED * 1.2,
                enemy: true
            }));
        }
    }

    spawnMine(game) {
        // Spawn a mine at the boss's current location
        game.mines.push(new Mine(this.x, this.y, true));
    }

    drawSprite(ctx) {
        // Tint the boss magenta/purple to distinguish from Alpha
        ctx.save();
        // Use a filter to change the color of the image
        ctx.filter = 'hue-rotate(120deg) saturate(1.5)';
        super.drawSprite(ctx);
        ctx.restore();
    }
}
