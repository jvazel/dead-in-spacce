import { CONFIG } from '../config.js';
import { Asteroid } from '../entities/Asteroid.js';
import { Boss } from '../entities/Boss.js';
import { CANVAS } from '../canvas.js';
import { rand, dist } from '../utils.js';
import { STATE } from '../constants.js';

export class WaveManager {
    constructor() {
    }

    startWave(game) {
        game.state = STATE.PLAYING;
        game.uiManager.hideOverlays();

        // Check for Boss Wave
        if (game.wave > 0 && game.wave % CONFIG.GAME.BOSS_FREQUENCY === 0) {
            game.boss = new Boss(CANVAS.width / 2, -100, game.wave); // Spawn off-screen top
            return;
        }

        // Spawn Asteroids
        const count = CONFIG.GAME.WAVE_START_COUNT + game.wave;
        for (let i = 0; i < count; i++) {
            let x, y;
            do {
                x = rand(0, CANVAS.width);
                y = rand(0, CANVAS.height);
            } while (dist(x, y, game.ship.x, game.ship.y) < CONFIG.ASTEROID.SPAWN_DISTANCE);

            game.asteroids.push(new Asteroid(x, y, 'large', game.wave));
        }
    }

    nextWave(game) {
        game.wave++;
        this.startWave(game);
    }
}
