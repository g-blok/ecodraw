import { DEVICE_CATEGORIES } from '../common/constants/constants';
import { Device } from '../common/types/types';


const maxDeviceWidth = 10;
const maxWidth = 100;
const walkwayWidth = 10;
const allowableRowCount = maxWidth / (maxDeviceWidth + walkwayWidth);


const getSmallestRowIndex = (layout: Device[][]): number => {
    const rowCapacities: number[] = layout.map((deviceRow) => {
        return deviceRow.reduce((n, {capacity_kwh}) => n + capacity_kwh, 0)
    })
    return rowCapacities.indexOf(Math.min(...rowCapacities))
}

export const createSystemLayout = (devices: Device[]): Device[][] => {
    devices.sort((a, b) => a.width - b.width)
    const transformers = devices.filter(device => device.category === DEVICE_CATEGORIES.TRANSFORMER);
    const storageDevices = devices.filter(device => device.category === DEVICE_CATEGORIES.STORAGE);
    const otherDevices = devices.filter(device => device.category !== DEVICE_CATEGORIES.TRANSFORMER && device.category !== DEVICE_CATEGORIES.STORAGE);
    
    const layout: Device[][] = [];

    // Build rows with one transformer and at least two storage devices
    transformers.forEach(transformer => {
        let row: Device[];
        const smallestRowIndex = getSmallestRowIndex(layout);
        
        if (layout.length < allowableRowCount) {
            row = [transformer];

            // Add two storage devices to the row
            for (let i = 0; i < 2 && storageDevices.length > 0; i++) {
                row.push(storageDevices.shift()!);
            }
            // Add other devices to the row
            // while (storageDevices.length > 0 && row.length < 2) {
            // 	row.push(storageDevices.shift()!);
            // }
            while (otherDevices.length > 0 && row.length < 2) {
                row.push(otherDevices.shift()!);
            }
            layout.push(row);
        } else {
            row = layout[smallestRowIndex];
            row.push(transformer)
            
            // Add two storage devices to the row
            for (let i = 0; i < 2 && storageDevices.length > 0; i++) {
                const smallestRowIndex = getSmallestRowIndex(layout);
                layout[smallestRowIndex].push(storageDevices.shift()!);
            }
            
            // Add other devices to the row
            while (storageDevices.length > 0 && row.length < 2) {
                const smallestRowIndex = getSmallestRowIndex(layout);
                layout[smallestRowIndex].push(storageDevices.shift()!);
            }
            while (otherDevices.length > 0 && row.length < 2) {
                const smallestRowIndex = getSmallestRowIndex(layout);
                layout[smallestRowIndex].push(otherDevices.shift()!);
            }
        }
        row.sort((a, b) => b.name.localeCompare(a.name));
    });

    return layout;
};
