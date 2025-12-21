import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class TimeAnomaly extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.HAZARDS.TIME_ANOMALY.RADIUS);
        this.duration = CONFIG.HAZARDS.TIME_ANOMALY.DURATION;
        this.timeScale = CONFIG.HAZARDS.TIME_ANOMALY.TIME_SCALE;
        this.color = CONFIG.HAZARDS.TIME_ANOMALY.COLOR;
        this.age = 0;
    }

    update(dt) {
        this.age += dt;
        if (this.age > this.duration) this.markedForDeletion = true;
        super.update(dt);
    }

    draw(ctx) {
        ctx.save();
        const opacity = Math.min(1, (this.duration - this.age) / 2); // Fade out
        ctx.globalAlpha = opacity;

        // Distortion effect ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.lineDashOffset = -this.age * 20;
        ctx.stroke();

        // Inner glow
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, 'rgba(0,255,255,0.1)');
        grad.addColorStop(1, 'rgba(0,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();
    }
}
