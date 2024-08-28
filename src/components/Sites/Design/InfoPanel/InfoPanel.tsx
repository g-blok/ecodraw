import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Cost, Device, SiteData } from '../../../../common/types/types'
import { DEVICE_CATEGORIES, STORAGE_DEVICES, COST_MULTIPLIERS } from '../../../../common/constants/constants'

interface InfoPanelProps {
    site: SiteData;
    devices: Device[];
    onAddDevice: (name: Device['name']) => void;
    onRemoveDevice: (device: Device['id']) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ site, devices, onAddDevice, onRemoveDevice }) => {
    const initialCapacity = devices.reduce((n, {capacity_kwh}) => n + capacity_kwh, 0)
    const initialHardwareCost = devices.reduce((n, {cost}) => n + cost, 0)
    const initialArea = devices.reduce((n, {length, width}) => n + length * width, 0)  // TODO: add buffer for walkways
    // const initialTotalCost = getTotalCost();

    const [systemCapacity, setSystemCapacity] =useState<number>(initialCapacity);
    const [hardwareCost, setCost] =useState<number>(initialHardwareCost);
    const [systemArea, setArea] =useState<number>(initialArea);
    const [totalCost, setTotalCost] =useState<number>(0);

    useEffect(() => {
        setTotalCost(getTotalCost());
    }, [hardwareCost])

    const getTotalCost = (): number => {
        let totalCost = hardwareCost;

        COST_MULTIPLIERS.forEach((cost) => {
            totalCost += getCost(cost)
        })

        return totalCost;
    }

    const handleAddDevice = (device: Device) => {
        setSystemCapacity(systemCapacity + device.capacity_kwh)
        setCost(hardwareCost + device.cost)
        setArea(systemArea + device.length * device.width)
        onAddDevice(device.name)
    }

    const handleRemoveDevice = (device: Device) => {
        setSystemCapacity(systemCapacity - device.capacity_kwh)
        setCost(hardwareCost - device.cost)
        setArea(systemArea - device.length * device.width)
        onRemoveDevice(device.id)
    }

    const getCost = (cost: Cost): number => {
        let adjustedCost = 0;
        if (cost.multiplier_type === 'percent_of_hardware') {
            adjustedCost = hardwareCost * cost.multiplier
        } else if (cost.multiplier_type === 'cost_per_kwh') {
            adjustedCost = systemCapacity * cost.multiplier
        }
        return adjustedCost;
    }

    return (
        <div className="flex flex-col min-w-1/4 w-1/4 py-4 mt-4 ml-4 rounded-xl border-2 bg-white">
            <div className='mb-4 px-4'>
                <div className='text-2xl font-bold'>{systemCapacity} kWh</div>
                <div className=''>${totalCost}</div>
                <div className=''>{systemArea} sqft</div>
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
                            {STORAGE_DEVICES.map((storageDevice, index) => {
                                return <Button variant="contained" aria-label="add {storageDevice.name}" onClick={() => handleAddDevice(storageDevice)} key={index}>
                                    <AddRoundedIcon />
                                    {storageDevice.name}
                                </Button>
                            })}
                        </div>
                        <div className='flex flex-col gap-2 max-h-40 overflow-y-auto'>
                            {devices
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
                            {devices
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
                                <div>${hardwareCost}</div>
                            </div>
                            {COST_MULTIPLIERS.map((cost, index) => {
                                return <div className='flex justify-between items-center' key={index}>
                                    <div>{cost.display}</div>
                                    <div>${getCost(cost)}</div>
                                </div>
                            })}
                            <div className='flex justify-between items-center'>
                                <div className='font-bold'>Total</div>
                                <div className='font-bold'>${totalCost}</div>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
};

export default InfoPanel;
