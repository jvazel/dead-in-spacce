import { CANVAS } from './canvas.js';
import { rand } from './utils.js';
import { CONFIG } from './config.js';

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = rand(0, CANVAS.width);
        this.y = rand(0, CANVAS.height);
        this.z = rand(1, CONFIG.VISUALS.STARFIELD.LAYERS); // Depth layer (1 = far, 3 = close)
        this.size = rand(0.5, 1.5) * this.z;
        this.brightness = rand(0.3, 1);
    }

    update(dt, velX, velY) {
        // Parallax effect: closer stars move faster opposite to ship
        // If ship isn't moving, stars can just stay static or drift slightly
        const parallax = 0.1 * this.z;
        this.x -= velX * parallax * dt;
        this.y -= velY * parallax * dt;

        // Screen wrap
        if (this.x < 0) this.x = CANVAS.width;
        if (this.x > CANVAS.width) this.x = 0;
        if (this.y < 0) this.y = CANVAS.height;
        if (this.y > CANVAS.height) this.y = 0;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Nebula {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = rand(0, CANVAS.width);
        this.y = rand(0, CANVAS.height);
        this.radius = rand(200, 500);
        this.color = CONFIG.VISUALS.NEBULA.COLORS[Math.floor(rand(0, CONFIG.VISUALS.NEBULA.COLORS.length))];
        this.driftX = rand(-5, 5); // Very slow drift
        this.driftY = rand(-5, 5);
    }

    update(dt, velX, velY) {
        // Parallax even slower than far stars
        const parallax = 0.05;
        this.x -= (velX * parallax + this.driftX) * dt;
        this.y -= (velY * parallax + this.driftY) * dt;

        // Wrap around with buffer
        const buffer = this.radius;
        if (this.x < -buffer) this.x = CANVAS.width + buffer;
        if (this.x > CANVAS.width + buffer) this.x = -buffer;
        if (this.y < -buffer) this.y = CANVAS.height + buffer;
        if (this.y > CANVAS.height + buffer) this.y = -buffer;
    }

    draw(ctx) {
        ctx.save();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = 'screen'; // Blend nicely
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class Background {
    constructor() {
        this.stars = [];
        this.nebulas = []; // Add nebulas

        for (let i = 0; i < CONFIG.VISUALS.STARFIELD.COUNT; i++) {
            this.stars.push(new Star());
        }

        for (let i = 0; i < CONFIG.VISUALS.NEBULA.COUNT; i++) {
            this.nebulas.push(new Nebula());
        }
    }

    resize() {
        // Redistribute all stars across the new canvas size
        this.stars.forEach(star => star.reset());
        this.nebulas.forEach(neb => neb.reset());
    }

    update(dt, ship) {
        const velX = ship ? ship.velX : 0;
        const velY = ship ? ship.velY : 0;
        this.stars.forEach(star => star.update(dt, velX, velY));
        this.nebulas.forEach(neb => neb.update(dt, velX, velY));
    }

    draw(ctx) {
        // Draw nebulas first (behind stars)
        this.nebulas.forEach(neb => neb.draw(ctx));
        this.stars.forEach(star => star.draw(ctx));
    }
}
