import { CANVAS, CTX } from './canvas.js';
import { InputHandler } from './InputHandler.js';
import { Ship } from './entities/Ship.js';
import { BlackHole } from './entities/BlackHole.js';
import { UFO } from './entities/UFO.js';
import { Background } from './Background.js';
import { CONFIG } from './config.js';
import { STATE } from './constants.js';

// Managers
import { CollisionManager } from './managers/CollisionManager.js';
import { UpgradeManager } from './managers/UpgradeManager.js';
import { UIManager } from './managers/UIManager.js';
import { WaveManager } from './managers/WaveManager.js';

export class Game {
    constructor() {
        this.input = new InputHandler();
        this.lastTime = 0;
        this.state = STATE.MENU;

        // Game Data
        this.wave = 1;
        this.credits = CONFIG.GAME.CREDITS_START;

        // Entities
        this.ship = null;
        this.bullets = [];
        this.asteroids = [];
        this.powerups = [];
        this.powerups = [];
        this.enemies = []; // Not really used yet but kept for structure
        this.ufos = [];
        this.ufoTimer = 0;
        this.mines = [];
        this.blackHoles = [];
        this.blackHoleTimer = 0;
        this.trails = [];
        this.particles = [];
        this.background = new Background();

        // Managers
        this.collisionManager = new CollisionManager();
        this.upgradeManager = new UpgradeManager();
        this.uiManager = new UIManager();
        this.waveManager = new WaveManager();

        // Shop Costs (Legacy/Compatibility, kept for now if any logic checks it, though mostly moved to config/managers)
        this.costs = { ...CONFIG.SHOP.COSTS };

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // UI Bindings
        document.getElementById('btn-start').onclick = () => this.startNewGame();
        document.getElementById('btn-restart').onclick = () => this.startNewGame();

        requestAnimationFrame(t => this.loop(t));
    }

    resize() {
        CANVAS.width = window.innerWidth;
        CANVAS.height = window.innerHeight;
        if (this.background) {
            this.background.resize();
        }
    }

    startNewGame() {
        this.state = STATE.PLAYING;
        this.wave = 1;
        this.credits = 0;
        this.ship = new Ship(CANVAS.width / 2, CANVAS.height / 2);
        this.bullets = [];
        this.asteroids = [];
        this.powerups = [];

        // Reset legacy costs if needed
        this.costs = { ...CONFIG.SHOP.COSTS };

        this.waveManager.startWave(this);
        this.uiManager.updateHUD(this);
        this.uiManager.hideOverlays();
    }

    // Proxy methods for Managers to call back into Game context if needed, 
    // or just direct calls.
    // Managers use 'game' instance passed to them.

    gameOver() {
        this.state = STATE.GAMEOVER;
        this.uiManager.showGameOver(this.wave);
    }

    // Called by UpgradeManager
    nextWave() {
        this.waveManager.nextWave(this);
    }

    // Called by WaveManager logic check
    showUpgradeSelection() {
        this.upgradeManager.showUpgradeSelection(this);
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (this.state === STATE.MENU) {
            this.drawBackground();
        } else {
            this.draw();
            if (this.state === STATE.PLAYING) {
                this.update(dt);
            }
        }

        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        if (!this.ship) return;

        // Immediate Game Over Check
        if (this.ship.hp <= 0) {
            this.gameOver();
            return;
        }

        this.background.update(dt, this.ship);
        this.ship.update(dt, this.input, this);
        this.bullets.forEach(b => b.update(dt, this.asteroids));
        this.asteroids.forEach(a => a.update(dt));
        this.powerups.forEach(p => p.update(dt));
        this.mines.forEach(m => m.update(dt));
        this.trails.forEach(t => t.update(dt));
        this.particles.forEach(p => p.update(dt));

        // Use Manager
        this.collisionManager.checkCollisions(this);

        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.asteroids = this.asteroids.filter(a => !a.markedForDeletion);
        this.powerups = this.powerups.filter(p => !p.markedForDeletion);
        this.mines = this.mines.filter(m => !m.markedForDeletion);
        this.trails = this.trails.filter(t => !t.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);

        this.particles = this.particles.filter(p => !p.markedForDeletion);

        // Update UFOs
        this.updateUFOs(dt);

        // Update Black Holes (Could also be in a BlackHoleManager or Entity Manager)
        this.updateBlackHoles(dt);

        // Wave Clear Check
        if (this.asteroids.length === 0) {
            this.showUpgradeSelection();
        }

        this.uiManager.updateHUD(this);
    }

    // Keeping Black Hole logic here for now or extract to separate method
    updateBlackHoles(dt) {
        this.blackHoleTimer += dt;
        if (this.blackHoleTimer >= CONFIG.BLACK_HOLE.SPAWN_INTERVAL) {
            this.blackHoleTimer = 0;
            if (Math.random() < CONFIG.BLACK_HOLE.CHANCE) {
                const x = Math.random() * CANVAS.width;
                const y = Math.random() * CANVAS.height;
                this.blackHoles.push(new BlackHole(x, y));
            }
        }

        this.blackHoles.forEach(bh => {
            bh.update(dt);
            // Apply Gravity (Keep logic here for now to avoid moving too much at once, or duplicate physics logic)
            // Ideally PhysicsManager would handle this.
            // For this refactor step, I'll inline the gravity logic or create a helper if it was large.
            // It was large in original file? Let's check previously viewed file. 
            // It was about 50 lines. I'll keep it inline for now to minimize risk, 
            // or better yet, move it to BlackHole class? No, it needs access to all entities.
            // I'll keep it here but compacted.
            this.applyBlackHoleGravity(bh, dt);
        });
        this.blackHoles = this.blackHoles.filter(bh => !bh.markedForDeletion);
    }

    updateUFOs(dt) {
        this.ufoTimer += dt;
        if (this.ufoTimer >= CONFIG.UFO.SPAWN_INTERVAL) {
            this.ufoTimer = 0;
            // Spawn UFO
            const y = Math.random() * (CANVAS.height - 100) + 50;
            const startRight = Math.random() < 0.5;
            const x = startRight ? CANVAS.width + 50 : -50;
            this.ufos.push(new UFO(x, y, this.ship));
        }

        this.ufos.forEach(u => u.update(dt, this));
        this.ufos = this.ufos.filter(u => !u.markedForDeletion);
    }

    applyBlackHoleGravity(bh, dt) {
        const pullEntity = (entity) => {
            if (!entity) return;
            const dx = bh.x - entity.x;
            const dy = bh.y - entity.y;
            const distSq = dx * dx + dy * dy;
            const distance = Math.sqrt(distSq);

            if (distance < CONFIG.BLACK_HOLE.ATTRACTION_RADIUS) {
                const force = (CONFIG.BLACK_HOLE.FORCE * 1000) / (distSq + 1000);
                const angle = Math.atan2(dy, dx);

                if (entity.velX !== undefined) {
                    entity.velX += Math.cos(angle) * force * dt;
                    entity.velY += Math.sin(angle) * force * dt;
                }

                if (distance < CONFIG.BLACK_HOLE.KILL_RADIUS) {
                    if (entity === this.ship && !this.ship.invulnerable) {
                        if (this.ship.hp > 0) {
                            this.ship.takeDamage(1000);
                        }
                    } else if (entity.hp !== undefined) {
                        if (!entity.markedForDeletion) {
                            entity.markedForDeletion = true;
                        }
                    } else {
                        entity.markedForDeletion = true;
                    }
                }
            }
        };

        pullEntity(this.ship);
        this.asteroids.forEach(pullEntity);
        this.enemies.forEach(pullEntity);
        this.ufos.forEach(pullEntity);
        this.bullets.forEach(pullEntity);
        this.particles.forEach(pullEntity);
        this.powerups.forEach(pullEntity);
    }

    draw() {
        CTX.fillStyle = '#111';
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

        this.background.draw(CTX);
        this.blackHoles.forEach(bh => bh.draw(CTX));
        this.particles.forEach(p => p.draw(CTX));
        this.mines.forEach(m => m.draw(CTX));
        this.ufos.forEach(u => u.draw(CTX));
        this.powerups.forEach(p => p.draw(CTX));
        this.asteroids.forEach(a => a.draw(CTX));
        this.bullets.forEach(b => b.draw(CTX));
        if (this.ship) this.ship.draw(CTX, this.input);
    }

    drawBackground() {
        CTX.fillStyle = '#111';
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
        this.background.draw(CTX);
    }

    // Legacy support methods if needed (none identified as critical external calls)
    // buy(item) was removed as shop is gone.
}
