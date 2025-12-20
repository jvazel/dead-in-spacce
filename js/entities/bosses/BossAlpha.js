import { BossBase } from './BossBase.js';
import { Bullet } from '../Bullet.js';
import { CONFIG } from '../../config.js';
import { dist } from '../../utils.js';

/**
 * BossAlpha Entity
 * The original boss with Circular Fire and Targeted Burst patterns.
 */
export class BossAlpha extends BossBase {
    constructor(x, y, wave) {
        super(x, y, wave);
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

        super.update(dt, game);
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
}
