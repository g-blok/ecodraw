export interface SiteData {
    name: string;
    id: string;
    path: string;
    address: string;
    lat: number;
    long: number;
    stage: string;
    created_date: string;
    updated_date: string;
    market: string;
    metering: string;
    revenue_streams?: string[];
    layout?: Device[][];
}

export interface Device {
    name: string;
    mfg: string;
    category: 'storage' | 'transformer';
    length: number;
    width: number;
    cost: number;
    release_date: number | null;
    capacity_kwh: number;
    color: string;
    x?: number;
    y?: number;
    uuid?: string;
    img?: string;
}

export interface Cost {
    name: string,
    display: string,
    sort: number,
    multiplier_type: 'percent_of_hardware' | 'cost_per_kwh',
    multiplier: number,
}

export interface Stage {
    value: string,
    display: string,
    description: string,
}
  