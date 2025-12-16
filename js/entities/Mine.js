import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Mine extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.MINE.RADIUS);
        this.timer = 0;
        this.blinkState = false;
    }

    update(dt) {
        // Mines are stationary or drift very slowly (let's keep them stationary relative to space)
        // No movement update needed unless we want drift

        // Blink animation logic
        this.timer += dt;
        if (this.timer > CONFIG.MINE.BLINK_RATE) {
            this.timer = 0;
            this.blinkState = !this.blinkState;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.strokeStyle = CONFIG.VISUALS.COLORS.MINE;
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Spikes
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(this.radius, 0);
            ctx.lineTo(this.radius + 4, 0);
            ctx.stroke();
        }

        // Blinking light
        if (this.blinkState) {
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.VISUALS.COLORS.MINE;
            ctx.shadowBlur = 10;
            ctx.shadowColor = CONFIG.VISUALS.COLORS.MINE;
            ctx.fill();
        }

        ctx.restore();
    }
}
