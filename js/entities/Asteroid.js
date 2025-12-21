import { Entity } from './Entity.js';
import { rand } from '../utils.js';
import { CONFIG } from '../config.js';

export class Asteroid extends Entity {
    constructor(x, y, size, wave = 1) { // Added wave param
        let radius, speed, hp, points;
        if (size === 'medium') {
            radius = CONFIG.ASTEROID.MEDIUM.RADIUS;
            speed = CONFIG.ASTEROID.MEDIUM.SPEED;
            hp = CONFIG.ASTEROID.HP.MEDIUM;
            points = CONFIG.ASTEROID.POINTS.MEDIUM;
        } else if (size === 'small') {
            radius = CONFIG.ASTEROID.SMALL.RADIUS;
            speed = CONFIG.ASTEROID.SMALL.SPEED;
            hp = CONFIG.ASTEROID.HP.SMALL;
            points = CONFIG.ASTEROID.POINTS.SMALL;
        } else {
            radius = CONFIG.ASTEROID.LARGE.RADIUS;
            speed = CONFIG.ASTEROID.LARGE.SPEED;
            hp = CONFIG.ASTEROID.HP.LARGE;
            points = CONFIG.ASTEROID.POINTS.LARGE;
        }

        // Difficulty Scaling
        const scalingSteps = Math.floor((wave - 1) / CONFIG.GAME.DIFFICULTY_SCALING_WAVES);
        if (scalingSteps > 0) {
            hp *= Math.pow(CONFIG.GAME.HP_SCALING_FACTOR, scalingSteps);
        }

        super(x, y, radius);
        this.size = size || 'large';
        this.hp = hp;
        this.maxHp = hp;
        this.scoreValue = Number(points) || 0; // Renamed from points to avoid collision with vertex points

        const angle = rand(0, Math.PI * 2);
        this.velX = Math.cos(angle) * speed;
        this.velY = Math.sin(angle) * speed;

        // Shape generation
        this.points = [];
        const numPoints = Math.floor(rand(CONFIG.ASTEROID.VERTICES_MIN, CONFIG.ASTEROID.VERTICES_MAX));
        for (let i = 0; i < numPoints; i++) {
            const a = (i / numPoints) * Math.PI * 2;
            const r = this.radius * rand(0.8, 1.2);
            this.points.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
        }
        this.rotAngle = 0;
        this.rotSpeed = rand(-2, 2);
    }

    update(dt) {
        this.x += this.velX * dt;
        this.y += this.velY * dt;
        this.rotAngle += this.rotSpeed * dt;
        super.update(dt);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotAngle);

        // Pseudo-3D shading
        // Light source top-left (relative to screen) -> so highlight is -x, -y relative to center
        const grad = ctx.createRadialGradient(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.1, 0, 0, this.radius);
        grad.addColorStop(0, CONFIG.VISUALS.COLORS.ASTEROID_GRADIENT.START);
        grad.addColorStop(1, CONFIG.VISUALS.COLORS.ASTEROID_GRADIENT.END);

        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();

        // Fill first for body
        ctx.fill();

        // Subtle stroke for definition
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0 && !this.markedForDeletion) {
            this.markedForDeletion = true;
            return true; // Destroyed
        }
        return false;
    }
}
