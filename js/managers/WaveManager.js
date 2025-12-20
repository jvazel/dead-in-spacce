import { CONFIG } from '../config.js';
import { Asteroid } from '../entities/Asteroid.js';
import { BossAlpha } from '../entities/bosses/BossAlpha.js';
import { BossBeta } from '../entities/bosses/BossBeta.js';
import { CANVAS } from '../canvas.js';
import { rand, dist } from '../utils.js';
import { STATE } from '../constants.js';

export class WaveManager {
    constructor() {
        this.lastBossType = null;
    }

    startWave(game) {
        game.state = STATE.PLAYING;
        game.uiManager.hideOverlays();

        // Check for Boss Wave
        if (game.wave > 0 && game.wave % CONFIG.GAME.BOSS_FREQUENCY === 0) {
            let BossClass;
            if (this.lastBossType === 'Alpha') {
                BossClass = BossBeta;
                this.lastBossType = 'Beta';
            } else if (this.lastBossType === 'Beta') {
                BossClass = BossAlpha;
                this.lastBossType = 'Alpha';
            } else {
                // First boss: Random
                if (Math.random() < 0.5) {
                    BossClass = BossAlpha;
                    this.lastBossType = 'Alpha';
                } else {
                    BossClass = BossBeta;
                    this.lastBossType = 'Beta';
                }
            }

            game.boss = new BossClass(CANVAS.width / 2, -100, game.wave); // Spawn off-screen top
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
