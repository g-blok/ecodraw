import { Device } from '../common/types/types'
import { SPACING } from '../common/constants/constants';

export const getDeviceArea = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {length, width}) => n + length * width, 0)
}

export const getTotalArea = (layout: Device[][]): number => {
    const offset: number = SPACING.MAX_DEVICE_WIDTH
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    layout.forEach(row => {
        row.forEach(device => {
            if (device && device.x != undefined && device.y != undefined) {
                minX = Math.min(minX, device.x);
                minY = Math.min(minY, device.y);
                maxX = Math.max(maxX, device.x + device.width);
                maxY = Math.max(maxY, device.y + device.length);
            }
        });
    });

    const bufferWidth = Math.max(0, maxX + minX + 2 * offset);
    const bufferLength = Math.max(0, maxY + minY + 2 * offset);

    const minimumBufferSize = 30;

    const validatedBufferWidth = Math.max(bufferWidth, minimumBufferSize);
    const validatedBufferLength = Math.max(bufferLength, minimumBufferSize);
    const totalArea = validatedBufferWidth * validatedBufferLength;

    return totalArea;
}

export const getTotalCapacity = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {capacity_kwh}) => n + capacity_kwh, 0);
}

export const getHardwareCost = (devices: Device[]): number => {
    if (devices.length === 0) return 0;
    return devices.reduce((n, {cost}) => n + cost, 0);
}