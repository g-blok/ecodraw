import { Device } from '../common/types/types'

export const getDeviceArea = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {length, width}) => n + length * width, 0)
}

export const getTotalArea = (devices: Device[]): number => {
    if (devices.length === 0) return 0;

    // Find the minimum x and y (top-left corner)
    let minX = 0;
    let minY = 0;

    // Find the maximum x + width and y + length (bottom-right corner)
    let maxX = 0;
    let maxY = 0;

    devices.forEach(device => {
        if (device && device.x && device.y) {
            minX = Math.min(minX, device.x);
            minY = Math.min(minY, device.y);
            maxX = Math.max(maxX, device.x + device.width);
            maxY = Math.max(maxY, device.y + device.length);
        }
    });

    // Calculate the width and height of the bounding box
    const boundingWidth = maxX - minX;
    const boundingHeight = maxY - minY;

    // Calculate the area of the bounding box
    return boundingWidth * boundingHeight;
}

export const getTotalCapacity = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {capacity_kwh}) => n + capacity_kwh, 0);
}

export const getHardwareCost = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {cost}) => n + cost, 0);
}