import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import SiteHeader from './Header/SiteHeader';
import InfoPanel from './InfoPanel/InfoPanel';
import DesignCanvas from './DesignCanvas/DesignCanvas';
import { Device, SiteData } from '../../../common/types/types';
import { DEVICE_CATEGORIES, STORAGE_DEVICES, TRANSFORMER_DEVICE } from '../../../common/constants/constants';


interface SiteTableProps {
  data: SiteData[];
}

const SiteDesign: React.FC<SiteTableProps> = ({ data }) => {
  const { path } = useParams<{ path: string }>();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    checkTransformers()
  }, [devices])

  const site = data.find(site => site.path === path);

  if (!site) {
    return <div>Site not found</div>;
  }

  const checkTransformers = () => {
    const storageCount = devices.filter((device) => device.category === DEVICE_CATEGORIES.STORAGE).length
    const transformerCount = devices.filter((device) => device.category === DEVICE_CATEGORIES.TRANSFORMER).length

    if (storageCount / 2 > transformerCount ) {
      addTransformer();
    } else if (storageCount / 2 < transformerCount ) {
      removeTransformer();
    }
  }

  const addTransformer = () => {
    setDevices([...devices, TRANSFORMER_DEVICE]);
  }

  const removeTransformer = () => {
    const index = devices.findIndex(device => device.category === DEVICE_CATEGORIES.TRANSFORMER);

    if (index !== -1) {
      devices.splice(index, 1);
    }
  }

  const addDevice = (name: string) => {
    let newDevice = STORAGE_DEVICES.find((device) => device.name === name);
    if (newDevice) {
      newDevice.id = uuidv4();
      setDevices([...devices, newDevice]);
    }
  };

  const removeDevice = (id: string) => {
      setDevices(devices.filter((device) => device.id !== id));
  };

  return (
    <div>
      <SiteHeader site={site} />
      <div className="flex">
        <InfoPanel site={site} devices={devices} onAddDevice={addDevice} onRemoveDevice={removeDevice} />
        <DesignCanvas site={site} devices={devices} />
      </div>
    </div>
  );
};

export default SiteDesign;
