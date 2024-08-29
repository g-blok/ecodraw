import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import SiteHeader from './Header/SiteHeader';
import InfoPanel from './InfoPanel/InfoPanel';
import DesignCanvas from './DesignCanvas/DesignCanvas';
import { Device, SiteData } from '../../../common/types/types';
import { DEVICE_CATEGORIES } from '../../../common/constants/constants';
import { debounce } from 'lodash';
import { getDefaultDevices, updateSiteLayout } from '../../../services/apiService';
import { createSystemLayout } from '../../../utils/layoutUtils';
import FmdBadRoundedIcon from '@mui/icons-material/FmdBadRounded';


interface SiteTableProps {
  sites: SiteData[];
}

const SiteDesign: React.FC<SiteTableProps> = ({ sites }) => {
	const { path } = useParams<{ path: string }>();
	const [siteDevices, setSiteDevices] = useState<Device[]>([]);
	const [systemLayout, setSystemLayout] = useState<Device[][]>([]);
	const [defaultDevices, setDefaultDevices] = useState<Device[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Find the site based on the path parameter
	const site = sites.find(site => site.path === path);

	// Fetch default devices on component mount
	const fetchDefaultDevices = useCallback(async () => {
		try {
			const data: Device[] = await getDefaultDevices();
			setDefaultDevices(data);
		} catch (error) {
			console.error('Error fetching devices:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Initialize site devices using the site's layout
	useEffect(() => {
		if (site?.layout && site.layout.length > 0) {
			setSiteDevices(site.layout.flat());
			setSystemLayout(site.layout);
		}
	}, [site]);

	// Debounced fetch of default devices
	useEffect(() => {
		const debouncedFetch = debounce(fetchDefaultDevices, 300);
		debouncedFetch();
		return () => {
			debouncedFetch.cancel();
		};
	}, [fetchDefaultDevices]);

	// Add required number of transformers
	const addTransformers = (devices: Device[], count: number): Device[] => {
		const transformerDevice = defaultDevices.find(device => device.category === DEVICE_CATEGORIES.TRANSFORMER);
		if (!transformerDevice) return devices;
		
		const newTransformers = Array.from({ length: count }, () => ({
			...transformerDevice,
			uuid: uuidv4(),
		}));
		
		return [...devices, ...newTransformers];
	};
		
	// Remove required number of transformers
	const removeTransformers = (devices: Device[], count: number): Device[] => {
		let removed = 0;
		return devices.filter(device => {
			if (device.category === DEVICE_CATEGORIES.TRANSFORMER && removed < count) {
				removed += 1;
				return false;
			}
			return true;
		});
	};

	// Check and update required number of transformers
	const checkTransformers = (updatedDevices: Device[]) => {
		const storageCount: number = updatedDevices.filter(device => device.category === DEVICE_CATEGORIES.STORAGE).length;
		const transformerCount: number = updatedDevices.filter(device => device.category === DEVICE_CATEGORIES.TRANSFORMER).length;
		const requiredTransformers = Math.ceil(storageCount / 2);
		let finalDevices = [...updatedDevices];
		
		if (transformerCount < requiredTransformers) {
			const transformersToAdd = requiredTransformers - transformerCount;
			finalDevices = addTransformers(finalDevices, transformersToAdd);
		}
		
		if (transformerCount > requiredTransformers) {
			const transformersToRemove = transformerCount - requiredTransformers;
			finalDevices = removeTransformers(finalDevices, transformersToRemove);
		}
		setSiteDevices(finalDevices);
	};

	// Update site layout in database
	const debouncedUpdateLayout = useCallback(
		debounce(async (newLayout: Device[][]) => {
			try {
				await updateSiteLayout(site!, newLayout);
			} catch (error) {
				console.error('Error updating site layout:', error);
			}
		}, 1000),
		[site]
	);

	// Manage update of systemLayout
	useEffect(() => {
		const newLayout = createSystemLayout(siteDevices);
		setSystemLayout(newLayout);

		debouncedUpdateLayout(newLayout);
		return () => {
			debouncedUpdateLayout.cancel();
		};
	}, [debouncedUpdateLayout, siteDevices])

	// Add the device the user clicks on in the InfoPanel
	const addDevice = (name: string) => {
		const matchingDevice = defaultDevices.find(device => device.name === name);
		if (matchingDevice) {
			const clonedDevice = { ...matchingDevice, uuid: uuidv4() };
			const updatedDevices = [...siteDevices, clonedDevice]
			checkTransformers(updatedDevices);
		}
	};

	// Remove the device the user clicks on in the InfoPanel
	const removeDevice = (uuid: string | undefined) => {
		if (!uuid) return;
		const updatedDevices = siteDevices.filter(device => device.uuid !== uuid)
		checkTransformers(updatedDevices);
	};

	if (!site) {
		return (
			<div className="flex w-full h-full m-auto items-center justify-center">
				<FmdBadRoundedIcon />
				<div>Site not found</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full">
			{loading ? (
				<div className='flex p-4 w-full h-full items-center justify-center'>
					<video
						className="h-40 object-cover filter saturate-50"
						src={`/assets/loading.mp4`}
						autoPlay
						loop
						muted
						playsInline
					/>
				</div>
			) : (
				<div>
					<SiteHeader site={site} />
					<div className="flex h-[70vh] max-h-[70vh]">
						<InfoPanel siteDevices={siteDevices} defaultDevices={defaultDevices} onAddDevice={addDevice} onRemoveDevice={removeDevice} />
						<DesignCanvas defaultDevices={defaultDevices} systemLayout={systemLayout} />
					</div>
				</div>
			)}
		</div>
	);
};

export default SiteDesign;
