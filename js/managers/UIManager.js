import { LABELS } from '../labels.js';
import { STATE } from '../constants.js';
import { CONFIG } from '../config.js';

export class UIManager {
    constructor() {
    }

    updateHUD(game) {
        if (game.ship) {
            const hpPercent = (game.ship.hp / game.ship.maxHp) * 100;

            document.getElementById('hp-bar').style.width = `${Math.max(0, hpPercent)}%`;

            document.getElementById('hud-hp-text').innerText = `${Math.ceil(game.ship.hp)}/${Math.ceil(game.ship.maxHp)}`;

            // Energy HUD
            const energyPercent = (game.ship.energy / game.ship.maxEnergy) * 100;
            const energyBar = document.getElementById('energy-bar');
            const energyStatus = document.getElementById('hud-energy-status');

            energyBar.style.width = `${Math.max(0, energyPercent)}%`;

            // Classe "low" si énergie insuffisante pour une parade
            if (game.ship.energy < CONFIG.SHIP.ENERGY.COST_PER_PARRY) {
                energyBar.classList.add('low');
                energyStatus.innerText = 'VIDE';
                energyStatus.style.color = '#ff0044';
            } else {
                energyBar.classList.remove('low');
                // Afficher "EN RECHARGE" si la surcharge est active
                if (game.ship.heat > CONFIG.SHIP.HEAT.DAMAGE_BONUS_THRESHOLD && !game.ship.overheated) {
                    energyStatus.innerText = 'RECHARGE ⚡';
                    energyStatus.style.color = '#ffaa00';
                } else {
                    energyStatus.innerText = 'PRÊT';
                    energyStatus.style.color = '#aa44ff';
                }
            }

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
