import React, { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Cost, Device } from '../../../../common/types/types'
import { DEVICE_CATEGORIES,  COST_MULTIPLIERS } from '../../../../common/constants/constants'
import { getDeviceArea, getTotalArea, getTotalCapacity, getHardwareCost } from '../../../../utils/siteUtils'
import { numberToString, numberToMoneyString } from '../../../../utils/formatUtils'

interface InfoPanelProps {
    siteDevices: Device[];
    defaultDevices: Device[];
    systemLayout: Device[][];
    onAddDevice: (name: Device['name']) => void;
    onRemoveDevice: (device: Device['uuid']) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ siteDevices, defaultDevices, systemLayout, onAddDevice, onRemoveDevice }) => {
    const initialCapacity = getTotalCapacity(siteDevices)
    const initialHardwareCost = getHardwareCost(siteDevices)
	const defaultStorageDevices = defaultDevices.filter((device) => device.category === DEVICE_CATEGORIES.STORAGE)

    const [systemCapacity, setSystemCapacity] =useState<number>(initialCapacity);
    const [hardwareCost, setCost] =useState<number>(initialHardwareCost);
    const [deviceArea, setDeviceArea] =useState<number>(getDeviceArea(siteDevices));
    const [systemArea, setSystemArea] =useState<number>(getTotalArea(systemLayout));
    const [totalCost, setTotalCost] =useState<number>(0);

    const getCost = useCallback((cost: Cost): number => {
        let adjustedCost = 0;
        if (cost.multiplier_type === 'percent_of_hardware') {
            adjustedCost = hardwareCost * cost.multiplier
        } else if (cost.multiplier_type === 'cost_per_kwh') {
            adjustedCost = systemCapacity * cost.multiplier
        }
        return adjustedCost;
    }, [hardwareCost, systemCapacity])

    const getTotalCost = useCallback((): number => {
        let totalCost = hardwareCost;

        COST_MULTIPLIERS.forEach((cost) => {
            totalCost += getCost(cost)
        })

        return totalCost;
    }, [getCost, hardwareCost])

    useEffect(() => {
        setSystemCapacity(getTotalCapacity(siteDevices));
        setCost(getHardwareCost(siteDevices));
        setDeviceArea(getDeviceArea(siteDevices));
        setSystemArea(getTotalArea(systemLayout));
        setTotalCost(getTotalCost());
    }, [getTotalCost, siteDevices, systemLayout])

    const handleAddDevice = (device: Device) => {
        onAddDevice(device.name)
    }

    const handleRemoveDevice = (device: Device) => {
        onRemoveDevice(device.uuid)
    }

    return (
        <div className="flex flex-col min-w-1/4 w-1/4 py-4 mt-4 ml-4 rounded-xl border-2 bg-white">
            <div className='mb-4 px-4'>
                <div className='text-2xl font-bold'>{numberToString(systemCapacity)} kWh</div>
                <div className='text-lg font-bold'>{numberToMoneyString(totalCost)}</div>
                <div className='flex items-center'>
                    <div className=''>{numberToString(deviceArea)} sqft</div>
                    <div className='text-xs pl-2'>(Device area)</div>
                </div>
                <div className='flex items-center'>
                    <div className=''>{numberToString(systemArea)} sqft</div>
                    <div className='text-xs pl-2'>(System area w/ Buffer)</div>
                </div>
            </div>
            <div className='flex flex-col h-full overflow-y-auto'>
                <Accordion defaultExpanded
                    sx={{
                        '&:before': {
                            display: 'none',
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="info-panel-devices"
                    >
                        <div className='font-bold'>Devices</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {defaultStorageDevices.map((storageDevice, index) => {
                                return <Button variant="contained" aria-label="add {storageDevice.name}" onClick={() => handleAddDevice(storageDevice)} key={index}>
                                    <AddRoundedIcon />
                                    {storageDevice.name}
                                </Button>
                            })}
                        </div>
                        <div className='flex flex-col gap-2 max-h-40 overflow-y-auto'>
                            {siteDevices
                                .filter((device) => device.category === DEVICE_CATEGORIES.STORAGE)
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((device, index) => (
                                    <div className="w-full flex items-center bg-secondary-light justify-between border rounded px-2" key={index}>
                                        <div>
                                            {device.name}
                                        </div>
                                        <IconButton aria-label="add {storageDevice.name}" onClick={() => handleRemoveDevice(device)}>
                                            <CloseRoundedIcon />
                                        </IconButton>
                                    </div>
                            ))}
                            {siteDevices
                                .filter((device) => device.category === DEVICE_CATEGORIES.TRANSFORMER)
                                .map((device, index) => (
                                    <div className="w-full flex items-center bg-secondary-light justify-between border rounded p-2 opacity-40" key={index}>
                                        <div>
                                            {device.name}
                                        </div>
                                    </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded
                    sx={{
                        '&:before': {
                            display: 'none',
                        },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="info-panel-costs"
                    >
                        <div className='font-bold'>Costs</div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='flex flex-col gap-2 mt-2'>
                            <div className='flex justify-between items-center'>
                                <div>Hardware</div>
                                <div>{numberToMoneyString(hardwareCost)}</div>
                            </div>
                            {COST_MULTIPLIERS.map((cost, index) => {
                                return <div className='flex justify-between items-center' key={index}>
                                    <div>{cost.display}</div>
                                    <div>{numberToMoneyString(getCost(cost))}</div>
                                </div>
                            })}
                            <div className='flex justify-between items-center'>
                                <div className='font-bold'>Total</div>
                                <div className='font-bold'>{numberToMoneyString(totalCost)}</div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default InfoPanel;
