import { Cost, Device, SiteData, Stage } from '../types/types'

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
        // id: 'fad950fe-60a9-4759-94c8-dd7982604d1a',
        name: 'MegapackXL',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 40,
        cost: 120000,
        release_date: 2022,
        capacity_kwh: 4000,
        color: '#7A8F8A',
    },
    {
        // id: 'bdcd50dd-f072-44d3-b2bc-f9b813683850',
        name: 'Megapack2',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 30,
        cost: 80000,
        release_date: 2021,
        capacity_kwh: 3000,
        color: '#91A69F',
    },
    {
        // id: '488ef798-424e-48ea-898b-211f802e789b',
        name: 'Megapack',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 30,
        cost: 50000,
        release_date: 2005,
        capacity_kwh: 2000,
        color: '#C8D7D4',
    },
    {
        // id: '44cae0e3-32ab-410d-b4b9-426e8ff1ae1b',
        name: 'PowerPack',
        mfg: 'Tesla',
        category: 'storage',
        length: 10,
        width: 10,
        cost: 10000,
        release_date: 2000,
        capacity_kwh: 2000,
        color: '#9BB59A',
    },
]

export const TRANSFORMER_DEVICE: Device = {
    // id: '7ad4e88a-9dec-45e9-beb6-9448a2d8a571',
    name: 'Transformer',
    mfg: 'Tesla',
    category: 'transformer',
    length: 10,
    width: 10,
    cost: 10000,
    release_date: null,
    capacity_kwh: -500,
    color: '#D9D9D9',
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

export const SITE_DATA: SiteData[] = [
	{
		name: 'SunHaven',
		path: 'sunhaven',
		address: 'San Francisco, CA',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-08-01',
		updated_date: '2024-08-10',
		market: 'CAISO',
		metering: 'FOM',
		revenue_streams: ['SGIP', 'Energy Arbitrage'],
		devices: [

		]
	},
	{
		name: 'Solara Grove',
		path: 'solara-grove',
		address: 'Los Angeles, CA',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-07-21',
		updated_date: '2024-08-07',
		market: 'North America',
		metering: 'BTM',
		revenue_streams: ['DRAM', 'SGIP'],
        devices: [

		]
	},
	{
		name: 'Aurora Fields',
		path: 'aurora-fields',
		address: 'Melbourne, AUS',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-06-15',
		updated_date: '2024-08-03',
		market: 'AEMO',
		metering: 'FOM',
		revenue_streams: ['FCAS'],
        devices: [

		]
	},
];