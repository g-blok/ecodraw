import { DEVICE_CATEGORIES, SPACING } from '../common/constants/constants';
import { Device } from '../common/types/types';

const allowableRowCount = SPACING.MAX_SYSTEM_WIDTH / (SPACING.MAX_DEVICE_WIDTH + SPACING.WALKWAY_WIDTH);

export const getBufferAreaDimensions = (layout: Device[][], offset: number = SPACING.MAX_DEVICE_WIDTH) => {
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

    const bufferXPos = minX - offset;
    const bufferYPos = minY - offset;
    const bufferWidth = Math.max(0, maxX + minX + 2 * offset);
    const bufferLength = Math.max(0, maxY + minY + 2 * offset);

    const minimumBufferSize = 30;

    const validatedBufferWidth = Math.max(bufferWidth, minimumBufferSize);
    const validatedBufferLength = Math.max(bufferLength, minimumBufferSize);
    const totalArea = validatedBufferWidth * validatedBufferLength;

    return { bufferXPos, bufferYPos, bufferWidth: validatedBufferWidth, bufferLength: validatedBufferLength, totalArea };
}

export const createSystemLayout = (devices: Device[]): Device[][] => {
    devices.sort((a, b) => a.width - b.width)

    // Split transformers and storage units
    const transformers = devices.filter(device => device.category === DEVICE_CATEGORIES.TRANSFORMER);
    const storageDevices = devices.filter(device => device.category === DEVICE_CATEGORIES.STORAGE);
    const otherDevices = devices.filter(device => device.category !== DEVICE_CATEGORIES.TRANSFORMER && device.category !== DEVICE_CATEGORIES.STORAGE);
    
    // determine row count and build layout scaffolding
    const rowCount = Math.min(transformers.length, allowableRowCount);
    const layout: Device[][] = Array.from({ length: rowCount }, () => []);

    // handle transformers
    transformers.forEach((transformer, index) => {
        const layoutRow = index < rowCount ? index : index % rowCount;
        layout[layoutRow].push(transformer);
    })

    // handle storage
    storageDevices.forEach((storage, index) => {
        const layoutRow = index < rowCount ? index : index % rowCount;
        layout[layoutRow].push(storage);
    })

    // handle other
    otherDevices.forEach((other, index) => {
        const layoutRow = index < rowCount ? index : index % rowCount;
        layout[layoutRow].push(other);
    })

    return layout;
};
