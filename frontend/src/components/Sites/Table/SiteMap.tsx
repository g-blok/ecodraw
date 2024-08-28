import React, { useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { SiteData } from '../../../common/types/types';
import { SNAZZY_MAP_STYLE } from '../../../common/constants/snazzy'

interface SiteInfoProps {
    site: Partial<SiteData>;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const SiteMap: React.FC<SiteInfoProps> = ({ site }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });
  const center: google.maps.LatLngLiteral = {
    lat: site.lat || 37.76,
    lng: site.long || -122.45,
  }
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return isLoaded ? (
    <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={{
            styles: SNAZZY_MAP_STYLE,
            disableDefaultUI: true,
            zoomControl: false,
            mapTypeControl: false,
        }}
        onLoad={onMapLoad}
    >
        <MarkerF
          position={center}
          icon={{
            path: 'M11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22Z',
            fillColor: '#ED7855',
            fillOpacity: 1,
        }}
        />
    </GoogleMap>
  ) : null;
};

export default SiteMap;
