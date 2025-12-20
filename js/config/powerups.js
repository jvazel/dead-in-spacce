export const POWERUP_CONFIG = {
    POWERUP: {
        RADIUS: 10,
        LIFE: 10,
        DROP_CHANCE: 0.1, // 10%
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
                COLOR: '#ff0000' // Red
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
                TRAIL_LIFE: 1.0,
                SPAWN_RATE: 0.05
            },
            BOUNCE: {
                DURATION: 12,
                WEIGHT: 0.8,
                COLOR: '#0000ff' // Blue
            },
            HEALTH: {
                HEAL_AMOUNT: 30,
                WEIGHT: 0.8, // Slightly less common
                COLOR: '#00ff00' // Green (health cross)
            }
        }
    }
};
