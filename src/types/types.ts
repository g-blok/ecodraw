export interface SiteData {
    name: string;
    path: string;
    address: string;
    lat: number;
    long: number;
    stage: string;
    created_date: string;
    updated_date: string;
    market: string;
    metering: string;
    revenue_streams: string[];
}

export interface Device {
    type: 'Large Doodad' | 'Medium Widget' | 'Thingy';
    width: number;
    height: number;
    x?: number;
    y?: number;
}
  