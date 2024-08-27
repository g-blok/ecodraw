// SitePage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SiteHeader from '../Header/SiteHeader';
import InfoPanel from '../InfoPanel/InfoPanel';
import DesignCanvas from '../DesignCanvas/DesignCanvas';
import { Device, SiteData } from '../../../types/types';


interface SiteTableProps {
  data: SiteData[];
}

const SiteDesign: React.FC<SiteTableProps> = ({ data }) => {
  const { path } = useParams<{ path: string }>();
  const [devices, setDevices] = useState<Device[]>([]);

  console.log('data: ', data)
  // Find the site with the matching name
  const site = data.find(site => site.path === path);
  if (!site) {
    return <div>Site not found</div>;
  }

  const addDevice = (type: 'Large Doodad' | 'Medium Widget') => {
    const newDevice = type === 'Large Doodad' 
      ? { type, width: 40, height: 10 } 
      : { type, width: 20, height: 10 };

    setDevices([...devices, newDevice]);

    // Automatically add a 'Thingy' for every two devices added
    if ((devices.length + 1) % 2 === 0) {
      setDevices([...devices, newDevice, { type: 'Thingy', width: 10, height: 10 }]);
    }
  };

  return (
    <div>
      <SiteHeader site={site} />
      <div className="flex">
        <InfoPanel path={path || ''} devices={devices} onAddDevice={addDevice} />
        <DesignCanvas site={site} devices={devices} />
      </div>
    </div>
  );
};

export default SiteDesign;
