import { NebulaCloud } from '../entities/NebulaCloud.js';
import { TimeAnomaly } from '../entities/TimeAnomaly.js';
import { CONFIG } from '../config.js';
import { CANVAS } from '../canvas.js';

export class EnvironmentManager {
    constructor() {
        this.nebulaTimer = 0;
        this.anomalyTimer = 0;
    }

    update(dt, game) {
        // Update Nebula spawning
        this.nebulaTimer += dt;
        if (this.nebulaTimer >= CONFIG.HAZARDS.NEBULA_CLOUD.SPAWN_INTERVAL) {
            this.nebulaTimer = 0;
            this.spawnHazard(game, NebulaCloud);
        }

        // Update Anomaly spawning
        this.anomalyTimer += dt;
        if (this.anomalyTimer >= CONFIG.HAZARDS.TIME_ANOMALY.SPAWN_INTERVAL) {
            this.anomalyTimer = 0;
            this.spawnHazard(game, TimeAnomaly);
        }

        // Clean up
        game.nebulaClouds = game.nebulaClouds.filter(n => !n.markedForDeletion);
        game.timeAnomalies = game.timeAnomalies.filter(a => !a.markedForDeletion);

        game.nebulaClouds.forEach(n => n.update(dt));
        game.timeAnomalies.forEach(a => a.update(dt));
    }

    spawnHazard(game, HazardClass) {
        const x = Math.random() * CANVAS.width;
        const y = Math.random() * CANVAS.height;
        if (HazardClass === NebulaCloud) {
            game.nebulaClouds.push(new NebulaCloud(x, y));
        } else {
            game.timeAnomalies.push(new TimeAnomaly(x, y));
        }
    }

    draw(ctx, game) {
        game.nebulaClouds.forEach(n => n.draw(ctx));
        game.timeAnomalies.forEach(a => a.draw(ctx));
    }
}
