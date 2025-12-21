import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { rand } from '../utils.js';

export class NebulaCloud extends Entity {
    constructor(x, y) {
        const radius = rand(CONFIG.HAZARDS.NEBULA_CLOUD.RADIUS_MIN, CONFIG.HAZARDS.NEBULA_CLOUD.RADIUS_MAX);
        super(x, y, radius);
        this.color = CONFIG.HAZARDS.NEBULA_CLOUD.COLOR;
        this.driftX = rand(-10, 10);
        this.driftY = rand(-10, 10);
        this.pulse = 0;
    }

    update(dt) {
        this.x += this.driftX * dt;
        this.y += this.driftY * dt;
        this.pulse += dt;
        super.update(dt);
    }

    draw(ctx) {
        ctx.save();
        const pulseScale = 1 + Math.sin(this.pulse) * 0.05;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * pulseScale);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * pulseScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
