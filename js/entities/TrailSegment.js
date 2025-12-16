import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class TrailSegment extends Entity {
    constructor(x, y, damage) {
        super(x, y, 10); // Initial radius
        this.damage = damage;
        this.life = CONFIG.POWERUP.TYPES.AFTERBURNER.TRAIL_LIFE;
        this.maxLife = this.life;
        this.color = CONFIG.POWERUP.TYPES.AFTERBURNER.COLOR;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (this.life / this.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}
