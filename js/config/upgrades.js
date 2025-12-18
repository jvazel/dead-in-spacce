export const UPGRADE_CONFIG = {
    SHOP: {
        COSTS: {
            REPAIR: 50,
            MAX_HP: 100,
            SHIELD: 150,
            FIRE_RATE: 200,
            DAMAGE: 250,
            DRONE_DAMAGE: 300,
            MULTISHOT_DURATION: 150,
            DRONE: 500,
            MINE: 300
        },
        REPAIR_AMOUNT: 25,
        MAX_HP_INCREASE: 20,
        SHIELD_INCREASE: 1,
        FIRE_RATE_MULTIPLIER: 0.9,
        DAMAGE_INCREASE: 10,
        DRONE_DAMAGE_INCREASE: 5,
        MULTISHOT_DURATION_INCREASE: 2, // +2 seconds per upgrade
        COST_MULTIPLIER: 1.5
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
    },
    PERMANENT_UPGRADES: {
        BASE_DAMAGE: {
            LABEL: 'Puissance de Base',
            COST: 100,
            COST_SCALING: 1.5,
            INCREMENT: 5,
            MAX_LEVEL: 10,
            DESCRIPTION: 'Augmente les dégâts de base de tous les tirs (+5).'
        },
        BASE_HP: {
            LABEL: 'Structure Renforcée',
            COST: 100,
            COST_SCALING: 1.5,
            INCREMENT: 10,
            MAX_LEVEL: 10,
            DESCRIPTION: 'Augmente les points de vie de départ (+10).'
        },
        BASE_SHIELD: {
            LABEL: 'Bouclier Initial',
            COST: 150,
            COST_SCALING: 1.5,
            INCREMENT: 1,
            MAX_LEVEL: 5,
            DESCRIPTION: 'Ajoute du bouclier dès le début (+1).'
        },
        TELEPORT: {
            LABEL: 'Téléportation (Flèche Bas)',
            COST: 500,
            TYPE: 'unlock',
            DESCRIPTION: 'Débloque la capacité de se téléporter (Touche Bas).'
        },
        BASE_FIRE_RATE: {
            LABEL: 'Cadence de Tir Rapide',
            COST: 200,
            COST_SCALING: 1.5,
            INCREMENT: 0.02, // Reduces delay by 0.02s
            MAX_LEVEL: 10,
            DESCRIPTION: 'Augmente la cadence de tir (Réduit le délai de 0.02s).'
        }
    }
};
