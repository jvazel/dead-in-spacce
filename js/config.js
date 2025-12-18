/**
 * Configuration Module
 * Aggregates all sub-configuration files into a single CONFIG object.
 */

import { GAME_CONFIG, VISUALS_CONFIG } from './config/game.js';
import { ENTITY_CONFIG } from './config/entities.js';
import { POWERUP_CONFIG } from './config/powerups.js';
import { UPGRADE_CONFIG } from './config/upgrades.js';

export const CONFIG = {
    GAME: GAME_CONFIG,
    VISUALS: VISUALS_CONFIG,
    ...ENTITY_CONFIG,
    ...POWERUP_CONFIG,
    ...UPGRADE_CONFIG
};
