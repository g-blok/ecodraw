import { Cost, Device, Stage } from '../types/types'

export const SPACING = {
    WALKWAY_WIDTH: 10,
	TRANSFORMER_GAP: 5,
	STORAGE_GAP: 2,
    MAX_DEVICE_WIDTH: 10,
    MAX_SYSTEM_WIDTH: 100,
    OUTER_OFFSET: 10,
}

export const STAGES: Stage[] = [
    {
        value: 'design',
        display: 'Design',
        description: 'Detailed design and layout creation',
    },
    {
        value: 'approval',
        display: 'Approval',
        description: 'Securing necessary permits and approvals',
    },
    {
        value: 'sold',
        display: 'Sold',
        description: 'Contract secured, ready for implementation',
    },
    {
        value: 'pre-installation',
        display: 'Pre-Installation',
        description: 'Preparatory work before installation has begun',
    },
    {
        value: 'installation',
        display: 'Installation',
        description: 'Installation of equipment in progress',
    },
    {
        value: 'commissioning',
        display: 'Commissioning',
        description: 'Testing and final checks before going live',
    },
    {
        value: 'operational',
        display: 'Operational',
        description: 'Site is live and operational',
    },
]

export const DEVICE_CATEGORIES = {
    TRANSFORMER: 'transformer',
    STORAGE: 'storage',
}

export const STORAGE_DEVICES: Device[] = [
    {
        name: 'MegapackXL',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 40,
        cost: 120000,
        release_date: 2022,
        capacity_kwh: 4000,
        color: '#7A8F8A',
        img: 'megapackxl.png'
    },
    {
        name: 'Megapack2',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 30,
        cost: 80000,
        release_date: 2021,
        capacity_kwh: 3000,
        color: '#91A69F',
        img: 'megapack2.jpg'
    },
    {
        name: 'Megapack',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 30,
        cost: 50000,
        release_date: 2005,
        capacity_kwh: 2000,
        color: '#C8D7D4',
        img: 'megapack.png'
    },
    {
        name: 'PowerPack',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 10,
        cost: 10000,
        release_date: 2000,
        capacity_kwh: 2000,
        color: '#9BB59A',
        img: 'powerpack.png'
    },
]

export const TRANSFORMER_DEVICE: Device = {
    name: 'Transformer',
    mfg: 'Tesla',
    category: 'transformer',
    length: 10,
    width: 10,
    cost: 10000,
    release_date: null,
    capacity_kwh: -500,
    color: '#D9D9D9',
    img: 'transformer.jpg'
}

export const COST_MULTIPLIERS: Cost[] = [
    {
        name: 'installation',
        display: 'Installation',
        sort: 0,
        multiplier_type: 'percent_of_hardware',
        multiplier: 0.22,
    },
    {
        name: 'permitting',
        display: 'Permitting',
        sort: 1,
        multiplier_type: 'cost_per_kwh',
        multiplier: 0.5,
    },
    {
        name: 'engineering',
        display: 'Engineering',
        sort: 2,
        multiplier_type: 'percent_of_hardware',
        multiplier: 0.05,
    },
    {
        name: 'development',
        display: 'Development',
        sort: 3,
        multiplier_type: 'percent_of_hardware',
        multiplier: 0.10,
    },
]
