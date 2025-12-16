import { Entity } from './Entity.js';
import { rand } from '../utils.js';
import { CONFIG } from '../config.js';

export class Particle extends Entity {
    constructor(x, y, color, speed, angle, life, type = 'normal') {
        super(x, y, type === 'shockwave' ? 10 : rand(1, 3)); // Start small for shockwave
        this.color = color;
        this.velX = Math.cos(angle) * speed;
        this.velY = Math.sin(angle) * speed;
        this.life = life;
        this.maxLife = life;
        this.alpha = 1;
        this.type = type;
        this.expansionRate = speed; // Reuse speed as expansion rate for shockwaves
    }

    update(dt) {
        if (this.type === 'shockwave') {
            // Stationary but expanding
            this.radius += this.expansionRate * dt;
        } else {
            this.x += this.velX * dt;
            this.y += this.velY * dt;
        }

        this.life -= dt;
        this.alpha = this.life / this.maxLife;

        if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.type === 'shockwave') {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4 * this.alpha; // Thin out as it fades
            ctx.beginPath();
            // Radius expands based on life lost? Or just use speed? 
            // In update, x/y changes. For shockwave, we want expansion.
            // Let's assume for shockwave: speed = expansion rate.
            // We need to track current radius. 
            // Reuse 'x' variable? No, 'x' is position.
            // We need a separate radius tracker. 
            // But `Entity` has `radius`. 
            // Let's use `radius` as the current size.
            // Update logic needs to change for shockwave.

            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
