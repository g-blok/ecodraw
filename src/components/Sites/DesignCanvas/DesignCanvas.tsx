// DesignCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Device, SiteData } from '../../../types/types';

interface DesignCanvasProps {
    site: SiteData;
    devices: Device[];
}

const containerStyle = {
  width: '75%',
  height: '100vh'
};

const DesignCanvas: React.FC<DesignCanvasProps> = ({ site, devices }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [deviceState, setDevices] = useState<Device[]>(devices);

  useEffect(() => {
    if (mapRef.current) {
      // Initialize drag and drop and collision detection logic
    }
  }, [devices]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const isOverlapping = (device1: Device, device2: Device): boolean => {
    if (!device1?.x || !device2.x || !device1?.y || !device2?.y) { return false; }
    return !(
      device1.x + device1.width < device2.x ||
      device1.x > device2.x + device2.width ||
      device1.y + device1.height < device2.y ||
      device1.y > device2.y + device2.height
    );
  };
  
  const handleDragEnd = (index: number, newPosition: { x: number, y: number }) => {
    const updatedDevices = [...deviceState];
    updatedDevices[index] = {
      ...updatedDevices[index],
      x: newPosition.x,
      y: newPosition.y
    };
  
    // Check for collisions
    for (let i = 0; i < updatedDevices.length; i++) {
      if (i !== index && isOverlapping(updatedDevices[i], updatedDevices[index])) {
        alert('Devices cannot overlap!');
        return;
      }
    }
  
    setDevices(updatedDevices);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat: site.lat, lng: site.long }}
      zoom={10}
      onLoad={onLoad}
    >
      {/* Render devices as rectangles on the map */}
      {deviceState.map((device, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: `${device.width}px`,
            height: `${device.height}px`,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            // Position logic based on map
          }}
          draggable
          onDragEnd={(e) => handleDragEnd(index, { x: e.clientX, y: e.clientY })}
        />
      ))}
    </GoogleMap>
  ) : <></>;
};

export default DesignCanvas;
