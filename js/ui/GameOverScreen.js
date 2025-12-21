import { CONFIG } from '../config.js';

export class GameOverScreen {
    constructor(saveManager) {
        this.saveManager = saveManager;
        this.container = document.getElementById('permanent-upgrade-container');
        this.waveElement = document.getElementById('go-wave');
        this.creditsElement = document.getElementById('go-credits');
        this.totalCreditsElement = document.getElementById('go-total-credits');
        this.vesselContainer = document.getElementById('vessel-selection-container');

        // Tab initialization
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');
        this.setupTabs();
    }

    setupTabs() {
        this.tabButtons.forEach(btn => {
            btn.onclick = () => {
                const target = btn.dataset.tab;

                // Update buttons
                this.tabButtons.forEach(b => b.classList.toggle('active', b === btn));

                // Update panes
                this.tabPanes.forEach(pane => {
                    const isTarget = pane.id === `tab-${target}`;
                    pane.classList.toggle('active', isTarget);
                });
            };
        });
    }

    show(wave, earnedCredits) {
        this.waveElement.innerText = wave;
        this.creditsElement.innerText = earnedCredits;
        this.updateTotalCredits();
        this.renderShop();
        this.renderVessels();
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
                <div class="upgrade-icon icon-${key}"></div>
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

    renderVessels() {
        if (!this.vesselContainer) return;
        this.vesselContainer.innerHTML = '';
        const vessels = CONFIG.VESSELS;
        const selectedId = this.saveManager.getSelectedVessel();

        for (const [id, vessel] of Object.entries(vessels)) {
            const card = document.createElement('div');
            const isUnlocked = this.saveManager.isVesselUnlocked(id);
            const isSelected = id === selectedId;
            const canAfford = this.saveManager.getCredits() >= vessel.COST;

            let statusClass = '';
            if (isSelected) statusClass = 'selected';
            else if (isUnlocked) statusClass = 'unlocked';
            else if (!canAfford) statusClass = 'locked';

            card.className = `shop-card vessel-card ${statusClass}`;

            let buttonText = isSelected ? 'SÉLECTIONNÉ' : (isUnlocked ? 'SÉLECTIONNER' : `Débloquer ($${vessel.COST})`);
            let buttonDisabled = isSelected || (!isUnlocked && !canAfford);

            card.innerHTML = `
                <div class="vessel-preview icon-${id}"></div>
                <h3>${vessel.LABEL}</h3>
                <div class="desc">${vessel.DESCRIPTION}</div>
                <button ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>
            `;

            const btn = card.querySelector('button');
            btn.onclick = () => {
                if (isUnlocked) {
                    this.saveManager.selectVessel(id);
                } else {
                    if (this.saveManager.buyVessel(id)) {
                        this.updateTotalCredits();
                    }
                }
                this.renderVessels();
                this.renderShop(); // Refresh shop in case credits changed
            };

            this.vesselContainer.appendChild(card);
        }
    }
}
