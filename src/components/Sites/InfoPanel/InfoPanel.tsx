// InfoPanel.tsx
import React from 'react';
import { Device } from '../../../types/types'

interface InfoPanelProps {
    path: string;
    devices: Device[];
    onAddDevice: (type: 'Large Doodad' | 'Medium Widget') => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ path, devices, onAddDevice }) => {
  return (
    <div className="w-1/4 p-4">
      <h2>{path}</h2>
      <h3>Devices</h3>
      <ul>
        {devices.map((device, index) => (
            <li key={index}>{device.type}</li>
        ))}
      </ul>
      <button onClick={() => onAddDevice('Large Doodad')}>Add Large Doodad</button>
      <button onClick={() => onAddDevice('Medium Widget')}>Add Medium Widget</button>
    </div>
  );
};

export default InfoPanel;
