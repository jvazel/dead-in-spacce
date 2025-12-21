import { CONFIG } from '../config.js';

export class SaveManager {
    constructor() {
        this.data = {
            credits: 0,
            upgrades: {
                BASE_DAMAGE: 0,
                BASE_HP: 0,
                BASE_SHIELD: 0,
                TELEPORT: 0, // 0 = locked, 1 = unlocked
                BASE_FIRE_RATE: 0,
                MISSILE_LAUNCHER: 0
            },
            vessels: {
                SHIP: true,
                INTERCEPTOR: false,
                TANK: false,
                SPECIALIST: false
            },
            selectedVessel: 'SHIP'
        };
        // No load() needed for session-only persistence
    }

    load() {
        // No-op for session persistence
    }

    save() {
        // No-op for session persistence
    }

    addCredits(amount) {
        this.data.credits += amount;
        this.save();
    }

    getCredits() {
        return this.data.credits;
    }

    getUpgradeLevel(id) {
        return this.data.upgrades[id] || 0;
    }

    getUpgradeCost(id) {
        const config = CONFIG.PERMANENT_UPGRADES[id];
        if (!config) return 0;

        if (config.TYPE === 'unlock') {
            return this.data.upgrades[id] ? Infinity : config.COST;
        }

        const level = this.data.upgrades[id];
        if (level >= config.MAX_LEVEL) return Infinity;

        // Exponential or linear scaling? Config generally implies simple scaling usually, 
        // but given "COST_SCALING": 1.5, it's exponential: Cost * (Scaling ^ Level)
        return Math.floor(config.COST * Math.pow(config.COST_SCALING, level));
    }

    canAfford(id) {
        return this.data.credits >= this.getUpgradeCost(id);
    }

    buyUpgrade(id) {
        const cost = this.getUpgradeCost(id);
        if (this.data.credits >= cost) {
            this.data.credits -= cost;

            const config = CONFIG.PERMANENT_UPGRADES[id];
            if (config.TYPE === 'unlock') {
                this.data.upgrades[id] = 1;
            } else {
                this.data.upgrades[id]++;
            }

            this.save();
            return true;
        }
        return false;
    }

    buyVessel(id) {
        const vessel = CONFIG.VESSELS[id];
        if (!vessel) return false;

        if (this.data.credits >= vessel.COST) {
            this.data.credits -= vessel.COST;
            this.data.vessels[id] = true;
            this.data.selectedVessel = id;
            this.save();
            return true;
        }
        return false;
    }

    selectVessel(id) {
        if (this.data.vessels[id]) {
            this.data.selectedVessel = id;
            this.save();
            return true;
        }
        return false;
    }

    isVesselUnlocked(id) {
        return !!this.data.vessels[id];
    }

    getSelectedVessel() {
        return this.data.selectedVessel;
    }
}
