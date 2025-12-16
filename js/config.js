export const CONFIG = {
    GAME: {
        WAVE_START_COUNT: 2, // + wave number
        CREDITS_START: 0,
        DIFFICULTY_SCALING_WAVES: 5, // Every 5 waves
        HP_SCALING_FACTOR: 1.5 // +50% HP
    },
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
        BASE_DAMAGE: 20, // New: Base damage per bullet
        SHIELD_REGEN_RATE: 0.5,
        INVULNERABILITY_DURATION: 5,
        COLLISION_DAMAGE: 20
    },
    BULLET: {
        SPEED: 500,
        LIFE: 1.5,
        RADIUS: 2
    },
    ASTEROID: {
        LARGE: { RADIUS: 40, SPEED: 50 },
        MEDIUM: { RADIUS: 20, SPEED: 100 },
        SMALL: { RADIUS: 10, SPEED: 150 },
        VERTICES_MIN: 5,
        VERTICES_MAX: 9,
        SPAWN_DISTANCE: 200, // Min distance from ship
        POINTS: { // New: Points award
            LARGE: 20,
            MEDIUM: 50, // Harder to hit? or just less because smaller? Usually smaller = harder = more points in asteroids
            SMALL: 100
        },
        HP: { // New: Base HP
            LARGE: 100,
            MEDIUM: 50,
            SMALL: 20
        }
    },
    POWERUP: {
        RADIUS: 10,
        LIFE: 10,
        DROP_CHANCE: 0.1, // 10% as requested
        TYPES: {
            INVULNERABILITY: {
                DURATION: 5,
                WEIGHT: 1,
                COLOR: '#ffdd00' // Gold/Yellow
            },
            MULTISHOT: {
                SHOTS: 3,
                DURATION: 10,
                SPREAD: 0.2, // Angle spread in radians
                WEIGHT: 1,
                COLOR: '#ff8800' // Orange
            },
            LASER: {
                DURATION: 8,
                DAMAGE_PER_SECOND: 200, // Continuous damage
                LENGTH: 1000, // Max laser length
                WIDTH: 4,
                COLOR: '#ff3300',
                GLOW_COLOR: '#ff6600',
                WEIGHT: 1
            },
            HOMING: {
                DURATION: 10,
                TURN_SPEED: 5, // Radians per second
                DETECTION_RADIUS: 300,
                WEIGHT: 1,
                COLOR: '#ff00ff' // Magenta
            },
            EXPLOSIVE: {
                DURATION: 10,
                BLAST_RADIUS: 100,
                DAMAGE: 50,
                WEIGHT: 1,
                COLOR: '#ff8800' // Orange
            },
            PIERCING: {
                DURATION: 10,
                MAX_HITS: 3,
                WEIGHT: 1,
                COLOR: '#00ff88' // Spring Green
            },
            REAR_FIRE: {
                DURATION: 15,
                WEIGHT: 1,
                COLOR: '#ffffff' // White (for the powerup orb)
            },
            AFTERBURNER: {
                DURATION: 15,
                WEIGHT: 1,
                COLOR: '#00ffff', // Cyan
                TRAIL_LIFE: 0.5,
                SPAWN_RATE: 0.05
            },
            HEALTH: {
                HEAL_AMOUNT: 30,
                WEIGHT: 0.8, // Slightly less common
                COLOR: '#00ff00' // Green (health cross)
            }
        }
    },
    DRONE: {
        RADIUS: 5,
        ORBIT_RADIUS: 50,
        ORBIT_SPEED: 2,
        FIRE_RATE: 1,
        RANGE: 200,
        COLOR: '#00ffff',
        BASE_DAMAGE: 10 // New
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
    SHOP: {
        COSTS: {
            REPAIR: 50,
            MAX_HP: 100,
            SHIELD: 150,
            FIRE_RATE: 200,
            DAMAGE: 250, // New
            DRONE_DAMAGE: 300, // New
            MULTISHOT_DURATION: 150,
            DRONE: 500,
            MINE: 300
        },
        REPAIR_AMOUNT: 25,
        MAX_HP_INCREASE: 20,
        SHIELD_INCREASE: 1,
        FIRE_RATE_MULTIPLIER: 0.9,
        DAMAGE_INCREASE: 10, // New
        DRONE_DAMAGE_INCREASE: 5, // New
        MULTISHOT_DURATION_INCREASE: 2, // +2 seconds per upgrade
        COST_MULTIPLIER: 1.5
    },
    VISUALS: {
        STARFIELD: {
            COUNT: 100,
            LAYERS: 3
        },
        NEBULA: {
            COUNT: 5,
            COLORS: ['rgba(75, 0, 130, 0.3)', 'rgba(0, 0, 100, 0.3)', 'rgba(100, 0, 100, 0.2)'] // Purple/Blue hues
        },
        PARTICLES: {
            EXPLOSION_COUNT: 15,
            THRUST_RATE: 0.1, // Seconds between particles
            LIFE_MIN: 0.5,
            LIFE_MAX: 1.0,
            SPEED_MIN: 50,
            SPEED_MAX: 150
        },
        COLORS: {
            SHIP: '#0ff', // Cyan
            SHIP_GLOW: '#0ff',
            BULLET: '#ff0', // Yellow
            BULLET_GLOW: '#f00', // Orange/Redish
            ASTEROID: '#aaa',
            ASTEROID_GRADIENT: { START: '#888', END: '#222' }, // For 3D look
            ASTEROID_GLOW: '#fff',
            POWERUP: '#0f0',
            POWERUP_GLOW: '#0f0',
            DRONE: '#00ffff',
            MINE: '#ff0000'
        }
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
        SPEED: 100,
        FIRE_RATE: 2.0,
        SCORE: 200,
        HP: 50,
        RADIUS: 25, // Increased size
        COLOR: '#ff00ff', // Magenta
        SPAWN_INTERVAL: 60, // Seconds
        BULLET_SPEED: 300,
        DROP_CHANCE: 0.5 // 50% chance for powerup drop
    },
    ROGUE_UPGRADES: {
        CHOICES_COUNT: 3,
        POOL: [
            {
                ID: 'DAMAGE_UP',
                LABEL: 'Puissance de Feu',
                DESCRIPTION: 'Augmente les dégâts de vos tirs de +30.',
                TYPE: 'damage',
                VALUE: 30,
                WEIGHT: 1
            },
            {
                ID: 'FIRE_RATE_UP',
                LABEL: 'Cadence de Tir',
                DESCRIPTION: 'Augmente la cadence de tir de 20%.',
                TYPE: 'fireRateDelay',
                VALUE: 0.8, // Multiplier
                WEIGHT: 1
            },
            {
                ID: 'MAX_HP_UP',
                LABEL: 'Coque Renforcée',
                DESCRIPTION: 'Augmente les PV Max de +20 et soigne.',
                TYPE: 'maxHp',
                VALUE: 20,
                WEIGHT: 1
            },
            {
                ID: 'SHIELD_UP',
                LABEL: 'Générateur de Bouclier',
                DESCRIPTION: 'Augmente le bouclier max de +1.',
                TYPE: 'maxShield',
                VALUE: 1,
                WEIGHT: 1
            },
            {
                ID: 'MULTISHOT_UP',
                LABEL: 'Durée Multi-Tirs',
                DESCRIPTION: 'Augmente la durée du bonus Multi-Tirs de +2s.',
                TYPE: 'multiShotDuration',
                VALUE: 2,
                WEIGHT: 1
            },
            {
                ID: 'DRONE_DAMAGE_UP',
                LABEL: 'Dégâts Drône',
                DESCRIPTION: 'Augmente les dégâts de votre drône de +5.',
                TYPE: 'droneDamage',
                VALUE: 5,
                WEIGHT: 1
            },
            {
                ID: 'REPAIR',
                LABEL: 'Réparations d\'Urgence',
                DESCRIPTION: 'Soigne instantanément 30 PV.',
                TYPE: 'hp',
                VALUE: 30,
                WEIGHT: 1
            },
            {
                ID: 'ADD_DRONE',
                LABEL: 'Drône de Soutien',
                DESCRIPTION: 'Ajoute un drône (Max 1 pour l\'instant).',
                TYPE: 'drone',
                VALUE: 1,
                WEIGHT: 0.5 // Rare
            }
        ]
    }
};
