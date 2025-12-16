import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';
import { IMAGES } from '../Assets.js';

export class BlackHole extends Entity {
    constructor(x, y) {
        super(x, y, CONFIG.BLACK_HOLE.RADIUS);
        this.lifeTimer = CONFIG.BLACK_HOLE.DURATION;
        this.rotation = 0;
        this.attractionRadius = CONFIG.BLACK_HOLE.ATTRACTION_RADIUS;
        this.force = CONFIG.BLACK_HOLE.FORCE;
    }

    update(dt) {
        // Lifetime
        this.lifeTimer -= dt;
        if (this.lifeTimer <= 0) {
            this.markedForDeletion = true;
        }

        // Swirling effect
        this.rotation += dt * 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const size = this.radius * 3.5; // Visual size larger than hitbox

        // Use 'screen' to blend the black background away
        ctx.globalCompositeOperation = 'screen';

        // Draw Swirl
        ctx.drawImage(IMAGES.black_hole, -size / 2, -size / 2, size, size);

        // Reset blend mode
        ctx.globalCompositeOperation = 'source-over';

        // Optional: Draw event horizon glow
        /* 
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(0,0, this.radius, 0, Math.PI*2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#a0f';
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        */

        ctx.restore();
    }
}
