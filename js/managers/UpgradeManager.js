import { CONFIG } from '../config.js';
import { STATE } from '../constants.js';

export class UpgradeManager {
    constructor() {
    }

    showUpgradeSelection(game) {
        game.state = STATE.UPGRADE;
        const screen = document.getElementById('upgrade-screen');
        const container = document.getElementById('upgrade-container');
        screen.style.display = 'block';
        container.innerHTML = '';

        // Pick Random Upgrades
        const pool = [...CONFIG.ROGUE_UPGRADES.POOL];
        const choices = [];
        for (let i = 0; i < CONFIG.ROGUE_UPGRADES.CHOICES_COUNT; i++) {
            if (pool.length === 0) break;

            // Weighted Random (Simple implementation for now, just random)
            const index = Math.floor(Math.random() * pool.length);
            choices.push(pool[index]);
            pool.splice(index, 1); // Avoid duplicates in one selection
        }

        choices.forEach(choice => {
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="upgrade-icon icon-${choice.TYPE}"></div>
                <div class="upgrade-title">${choice.LABEL}</div>
                <div class="upgrade-desc">${choice.DESCRIPTION}</div>
            `;
            card.onclick = () => this.applyUpgrade(game, choice);
            container.appendChild(card);
        });
    }

    applyUpgrade(game, upgrade) {
        if (!game.ship) return;

        switch (upgrade.TYPE) {
            case 'damage':
                game.ship.damage += upgrade.VALUE;
                break;
            case 'fireRateDelay':
                game.ship.fireRateDelay *= upgrade.VALUE;
                break;
            case 'maxHp':
                game.ship.maxHp += upgrade.VALUE;
                game.ship.hp = Math.min(game.ship.hp + upgrade.VALUE, game.ship.maxHp); // Heal amount too
                break;
            case 'hp':
                game.ship.hp = Math.min(game.ship.hp + upgrade.VALUE, game.ship.maxHp);
                break;
            case 'maxEnergy':
                game.ship.maxEnergy += upgrade.VALUE;
                game.ship.energy = Math.min(game.ship.energy + upgrade.VALUE, game.ship.maxEnergy);
                break;
            case 'multiShotDuration':
                game.ship.multiShotDuration += upgrade.VALUE;
                break;
            case 'droneDamage':
                game.ship.droneDamage += upgrade.VALUE;
                break;
            case 'drone':
                game.ship.addDrone();
                break;
            case 'missileRefill':
                game.ship.addMissile(upgrade.VALUE);
                break;
            case 'powerupDuration':
                game.ship.powerupDurationMultiplier += upgrade.VALUE;
                break;
        }

        game.nextWave();
    }
}
