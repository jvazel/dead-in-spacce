import { LABELS } from '../labels.js';
import { STATE } from '../constants.js';
import { CONFIG } from '../config.js';

export class UIManager {
    constructor() {
    }

    updateHUD(game) {
        if (game.ship) {
            const hpPercent = (game.ship.hp / game.ship.maxHp) * 100;
            const shieldPercent = game.ship.maxShield > 0 ? (game.ship.shield / game.ship.maxShield) * 100 : 0;

            document.getElementById('hp-bar').style.width = `${Math.max(0, hpPercent)}%`;
            document.getElementById('shield-bar').style.width = `${Math.max(0, shieldPercent)}%`;

            document.getElementById('hud-hp-text').innerText = `${Math.ceil(game.ship.hp)}/${Math.ceil(game.ship.maxHp)}`;
            document.getElementById('hud-shield-text').innerText = Math.ceil(game.ship.shield);

            // Missile HUD
            const missileHUD = document.getElementById('hud-missiles');
            if (game.ship.maxMissiles > 0) {
                missileHUD.style.display = 'block';
                document.getElementById('hud-missile-count').innerText = game.ship.missiles;
            } else {
                missileHUD.style.display = 'none';
            }

            // Heat HUD
            const heatBar = document.getElementById('heat-bar');
            const heatStatus = document.getElementById('hud-heat-status');
            const heatPercent = (game.ship.heat / CONFIG.SHIP.HEAT.MAX) * 100;

            heatBar.style.width = `${heatPercent}%`;

            if (game.ship.overheated) {
                heatBar.classList.add('overheated');
                heatStatus.innerText = 'SURCHAUFFE !';
                heatStatus.style.color = '#ff0000';
            } else {
                heatBar.classList.remove('overheated');
                if (game.ship.heat > CONFIG.SHIP.HEAT.DAMAGE_BONUS_THRESHOLD) {
                    heatStatus.innerText = 'SURCHARGE ACTIVÉE';
                    heatStatus.style.color = '#ffaa00';
                } else {
                    heatStatus.innerText = game.ship.heat > 0 ? 'CHAUFFE...' : 'REFROIDI';
                    heatStatus.style.color = '#fff';
                }
            }
        }
        document.getElementById('hud-wave').innerText = game.wave;
        document.getElementById('hud-credits').innerText = game.credits;
    }

    showGameOver(wave) {
        document.getElementById('game-over-screen').style.display = 'block';
        document.getElementById('go-wave').innerText = wave;
    }

    hideOverlays() {
        document.querySelectorAll('.overlay').forEach(el => el.style.display = 'none');
    }
}
