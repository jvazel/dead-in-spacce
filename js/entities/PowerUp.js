import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { IMAGES } from '../Assets.js';

export class PowerUp extends Entity {
    constructor(x, y, type = 'INVULNERABILITY') {
        super(x, y, CONFIG.POWERUP.RADIUS);
        this.type = type;
        this.life = CONFIG.POWERUP.LIFE; // Disappear after 10s
        this.blinkTimer = 0;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) this.markedForDeletion = true;
        this.blinkTimer += dt;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.blinkTimer * 3);

        // Get color from config - each powerup type has its own defined color
        let color = '#ffffff'; // Default white
        if (CONFIG.POWERUP.TYPES[this.type] && CONFIG.POWERUP.TYPES[this.type].COLOR) {
            color = CONFIG.POWERUP.TYPES[this.type].COLOR;
        }

        const size = this.radius * 2.5;

        // Draw Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        // Draw Orb Base
        ctx.drawImage(IMAGES.orb, -size / 2, -size / 2, size, size);

        // Tint it
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(-size / 2, -size / 2, size, size);

        // Core brightness (optional, draw a small white dot in center for "energy")
        // ctx.globalCompositeOperation = 'source-over';
        // ctx.globalAlpha = 1;
        // ctx.fillStyle = '#fff';
        // ctx.beginPath(); ctx.arc(0,0, this.radius/3, 0, Math.PI*2); ctx.fill();

        ctx.restore();
    }
}
