export const ENTITY_CONFIG = {
    SHIP: {
        RADIUS: 15,
        ROTATION_SPEED: 4,
        THRUST: 300,
        FRICTION: 0.98,
        BASE_HP: 100,
        BASE_MAX_HP: 100,
        BASE_ENERGY: 100,          // Énergie de départ
        BASE_MAX_ENERGY: 100,      // Capacité max de départ
        BASE_FIRE_RATE: 0.4,
        BASE_DAMAGE: 20, // Base damage per bullet
        ENERGY: {
            COST_PER_PARRY: 25,    // 25 énergie par parade (4 parades avec 100)
            RECHARGE_RATE: 10      // +10/sec pendant surcharge active
        },
        INVULNERABILITY_DURATION: 5,
        COLLISION_DAMAGE: 20,
        HEAT: {
            MAX: 100,
            INCREASE_PER_SHOT: 5,
            DECREASE_RATE: 20, // per second when not firing
            OVERHEAT_DURATION: 3.0, // seconds of lockout
            DAMAGE_BONUS_THRESHOLD: 70, // Start bonus at 70% heat
            DAMAGE_BONUS_MAX: 1.5 // Max 50% bonus at 100% heat
        },
        PARRY: {
            DURATION: 0.5,
            COOLDOWN: 2.0
        }
    },
    VESSELS: {
        SHIP: {
            ID: 'SHIP',
            LABEL: 'Vaisseau de Base',
            DESCRIPTION: 'Équilibré et polyvalent.',
            STATS: { hp: 0, thrust: 0, damage: 0, powerupDuration: 1.0 },
            IMAGE: 'ship',
            COST: 0
        },
        INTERCEPTOR: {
            ID: 'INTERCEPTOR',
            LABEL: 'L\'Intercepteur',
            DESCRIPTION: 'Rapide, démarre avec Téléportation, mais coque fragile.',
            STATS: { hp: -40, thrust: 200, damage: 0, powerupDuration: 1.0, teleport: true },
            IMAGE: 'player_interceptor',
            COST: 500
        },
        TANK: {
            ID: 'TANK',
            LABEL: 'Le Tank',
            DESCRIPTION: 'Lent et robuste. Impossible d\'utiliser des drones.',
            STATS: { hp: 100, thrust: -150, damage: 0, powerupDuration: 1.0, noDrones: true },
            IMAGE: 'player_tank',
            COST: 600
        },
        SPECIALIST: {
            ID: 'SPECIALIST',
            LABEL: 'Le Spécialiste',
            DESCRIPTION: 'Dégâts de base réduits, mais les power-ups durent 2x plus longtemps.',
            STATS: { hp: 0, thrust: 0, damage: -10, powerupDuration: 2.0 },
            IMAGE: 'player_specialist',
            COST: 800
        }
    },
    BULLET: {
        SPEED: 500,
        LIFE: 1.5,
        RADIUS: 2
    },
    MISSILE: {
        SPEED: 350,
        LIFE: 5,
        RADIUS: 4,
        DAMAGE: 200,
        BLAST_RADIUS: 150,
        TURN_SPEED: 4,
        DETECTION_RADIUS: 800
    },
    ASTEROID: {
        LARGE: { RADIUS: 40, SPEED: 50 },
        MEDIUM: { RADIUS: 20, SPEED: 100 },
        SMALL: { RADIUS: 10, SPEED: 150 },
        VERTICES_MIN: 5,
        VERTICES_MAX: 9,
        SPAWN_DISTANCE: 200, // Min distance from ship
        POINTS: {
            LARGE: 20,
            MEDIUM: 50,
            SMALL: 100
        },
        HP: {
            LARGE: 100,
            MEDIUM: 50,
            SMALL: 20
        }
    },
    DRONE: {
        RADIUS: 5,
        ORBIT_RADIUS: 50,
        ORBIT_SPEED: 2,
        FIRE_RATE: 1,
        RANGE: 200,
        COLOR: '#00ffff',
        BASE_DAMAGE: 10
    },
    MINE: {
        RADIUS: 8,
        DROP_INTERVAL: 5, // Seconds
        TRIGGER_RADIUS: 50,
        BLAST_RADIUS: 120,
        DAMAGE: 100,
        COLOR: '#ff0000',
        BLINK_RATE: 0.5
    },
    BLACK_HOLE: {
        SPAWN_INTERVAL: 20, // Seconds
        CHANCE: 0.4, // 40% chance
        DURATION: 15,
        RADIUS: 80, // Visual size
        ATTRACTION_RADIUS: 600,
        FORCE: 1500,
        KILL_RADIUS: 20
    },
    UFO: {
        SPEED: 60,
        FIRE_RATE: 2.0,
        SCORE: 200,
        HP: 50,
        RADIUS: 25, // Increased size
        COLOR: '#ff00ff', // Magenta
        SPAWN_INTERVAL: 60, // Seconds
        BULLET_SPEED: 300,
        DROP_CHANCE: 0.5 // 50% chance for powerup drop
    },
    BOSS: {
        RADIUS: 60,
        SPEED: 50,
        HP: 1000,
        ATTACK_RATE: 1.5,
        BULLET_SPEED: 250,
        MINION_SPAWN_CHANCE: 0.2,
        COLOR: '#ff0000',
        GLOW_COLOR: '#ff3333',
        SCORE: 1000
    },
    HAZARDS: {
        NEBULA_CLOUD: {
            RADIUS_MIN: 150,
            RADIUS_MAX: 300,
            SPEED_MULTIPLIER: 0.6,
            SHIELD_REGEN_MULTIPLIER: 10,
            COLOR: 'rgba(100, 0, 255, 0.15)', // Purple haze
            SPAWN_INTERVAL: 45
        },
        TIME_ANOMALY: {
            RADIUS: 120,
            TIME_SCALE: 0.1,
            COLOR: 'rgba(0, 255, 255, 0.2)',
            SPAWN_INTERVAL: 60,
            DURATION: 15
        },
        SOLAR_STORM: {
            CHANCE: 0.1, // per wave start
            DURATION: 10,
            COLOR: 'rgba(255, 100, 0, 0.2)'
        }
    }
};
