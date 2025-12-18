import { CONFIG } from '../config.js';

export class GameOverScreen {
    constructor(saveManager) {
        this.saveManager = saveManager;
        this.container = document.getElementById('permanent-upgrade-container');
        this.waveElement = document.getElementById('go-wave');
        this.creditsElement = document.getElementById('go-credits');
        this.totalCreditsElement = document.getElementById('go-total-credits');
    }

    show(wave, earnedCredits) {
        this.waveElement.innerText = wave;
        this.creditsElement.innerText = earnedCredits;
        this.updateTotalCredits();
        this.renderShop();
    }

    updateTotalCredits() {
        this.totalCreditsElement.innerText = this.saveManager.getCredits();
    }

    renderShop() {
        this.container.innerHTML = '';
        const upgrades = CONFIG.PERMANENT_UPGRADES;

        for (const [key, upgrade] of Object.entries(upgrades)) {
            const card = document.createElement('div');
            const level = this.saveManager.getUpgradeLevel(key);
            const cost = this.saveManager.getUpgradeCost(key);
            const isUnlock = upgrade.TYPE === 'unlock';
            const isMaxed = !isUnlock && level >= upgrade.MAX_LEVEL;
            const isUnlocked = isUnlock && level > 0;
            const canAfford = this.saveManager.canAfford(key);

            let statusClass = '';
            if (isMaxed || isUnlocked) statusClass = 'unlocked';
            else if (!canAfford) statusClass = 'locked';

            card.className = `shop-card ${statusClass}`;

            let buttonText = `Acheter ($${cost})`;
            let buttonDisabled = !canAfford;

            if (isUnlocked) {
                buttonText = 'DÉBLOQUÉ';
                buttonDisabled = true;
            } else if (isMaxed) {
                buttonText = 'MAX';
                buttonDisabled = true;
            }

            card.innerHTML = `
                <h3>${upgrade.LABEL}</h3>
                <div class="desc">${upgrade.DESCRIPTION}</div>
                <div class="stats">
                    ${isUnlock ? (isUnlocked ? 'Débloqué' : 'Verrouillé') : `Niveau: ${level} / ${upgrade.MAX_LEVEL}`}
                </div>
                <button>${buttonText}</button>
            `;

            const btn = card.querySelector('button');
            if (!buttonDisabled) {
                btn.onclick = () => {
                    if (this.saveManager.buyUpgrade(key)) {
                        this.updateTotalCredits();
                        this.renderShop(); // Re-render to update statuses
                    }
                };
            } else {
                btn.disabled = true;
            }

            this.container.appendChild(card);
        }
    }
}
