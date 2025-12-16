import { CONFIG } from '../config.js';
import { Asteroid } from '../entities/Asteroid.js';
import { CANVAS } from '../canvas.js';
import { rand, dist } from '../utils.js';
import { STATE } from '../constants.js';

export class WaveManager {
    constructor() {
    }

    startWave(game) {
        game.state = STATE.PLAYING;
        game.uiManager.hideOverlays();

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
