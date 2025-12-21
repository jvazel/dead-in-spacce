export const ENTITY_CONFIG = {
    SHIP: {
        RADIUS: 15,
        ROTATION_SPEED: 4,
        THRUST: 300,
        FRICTION: 0.98,
        BASE_HP: 100,
        BASE_MAX_HP: 100,
        BASE_SHIELD: 0,
        BASE_MAX_SHIELD: 0,
        BASE_FIRE_RATE: 0.4,
        BASE_DAMAGE: 20, // Base damage per bullet
        SHIELD_REGEN_RATE: 0.5,
        INVULNERABILITY_DURATION: 5,
        COLLISION_DAMAGE: 20,
        HEAT: {
            MAX: 100,
            INCREASE_PER_SHOT: 5,
            DECREASE_RATE: 20, // per second when not firing
            OVERHEAT_DURATION: 3.0, // seconds of lockout
            DAMAGE_BONUS_THRESHOLD: 70, // Start bonus at 70% heat
            DAMAGE_BONUS_MAX: 1.5 // Max 50% bonus at 100% heat
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
    }
};
