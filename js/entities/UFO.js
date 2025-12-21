import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { CONFIG } from '../config.js';
import { dist } from '../utils.js';
import { CANVAS } from '../canvas.js';
import { IMAGES } from '../Assets.js';

export class UFO extends Entity {
    constructor(x, y, targetShip) {
        super(x, y, CONFIG.UFO.RADIUS);
        this.targetShip = targetShip;
        this.hp = CONFIG.UFO.HP;
        this.scoreValue = CONFIG.UFO.SCORE;

        // Movement
        this.speed = CONFIG.UFO.SPEED;
        // Determine direction: Left->Right or Right->Left based on start X
        this.dirX = x < 0 ? 1 : -1;
        this.velX = this.dirX * this.speed;
        this.velY = 0;

        // Sine wave movement
        this.baseY = y;
        this.timeAlive = 0;

        // Shooting
        this.fireTimer = CONFIG.UFO.FIRE_RATE;
    }

    update(dt, game) {
        dt *= (this.timeScale || 1.0);
        this.timeAlive += dt;

        // Move
        this.x += this.velX * dt;
        this.y = this.baseY + Math.sin(this.timeAlive * 2) * 50; // Amplitude 50, Freq 2

        // Wrap or Destroy? 
        // UFOs usually fly off screen.
        if (this.dirX > 0 && this.x > CANVAS.width + 100) this.markedForDeletion = true;
        if (this.dirX < 0 && this.x < -100) this.markedForDeletion = true;

        // Shoot
        this.fireTimer -= dt;
        if (this.fireTimer <= 0 && this.targetShip && !this.targetShip.markedForDeletion) {
            this.fireTimer = CONFIG.UFO.FIRE_RATE;
            this.shoot(game);
        }

        super.update(dt);
    }

    shoot(game) {
        const angle = Math.atan2(this.targetShip.y - this.y, this.targetShip.x - this.x);
        // Enemy bullets need a flag or separate array? 
        // For now, let's tag them.
        const bullet = new Bullet(this.x, this.y, angle, {
            color: '#ff00ff',
            speed: CONFIG.UFO.BULLET_SPEED,
            damage: 10, // Fixed UFO damage
            enemy: true
        });
        game.bullets.push(bullet);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw UFO Sprite
        const size = this.radius * 2.5;
        if (IMAGES.ufo && IMAGES.ufo.complete && IMAGES.ufo.naturalWidth !== 0) {
            ctx.drawImage(IMAGES.ufo, -size / 2, -size / 2, size, size);
        } else {
            // Fallback
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius, this.radius / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = CONFIG.UFO.COLOR;
            ctx.fill();

            // Dome
            ctx.beginPath();
            ctx.arc(0, -5, 8, Math.PI, 0);
            ctx.fillStyle = '#cc00cc';
            ctx.fill();
        }

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
