export const GAME_CONFIG = {
    WAVE_START_COUNT: 2, // + wave number
    CREDITS_START: 0,
    DIFFICULTY_SCALING_WAVES: 5, // Every 5 waves
    HP_SCALING_FACTOR: 1.5 // +50% HP
};

export const VISUALS_CONFIG = {
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
};
