import { CANVAS } from '../canvas.js';

export class Entity {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.markedForDeletion = false;
    }

    update(dt) {
        // Screen Wrap
        if (this.x < -this.radius) this.x = CANVAS.width + this.radius;
        if (this.x > CANVAS.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = CANVAS.height + this.radius;
        if (this.y > CANVAS.height + this.radius) this.y = -this.radius;
    }

    draw(ctx) {
        // Debug circle
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.strokeStyle = 'red';
        // ctx.stroke();
    }
}
