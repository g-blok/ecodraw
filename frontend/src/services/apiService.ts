import { Device, SiteData } from '../common/types/types';

const API_URL = 'http://localhost:5000/api';

export const getSites = async (): Promise<SiteData[]> => {
	const response = await fetch(`${API_URL}/sites`);
	if (!response.ok) {
		throw new Error(`Failed to fetch sites: ${response.statusText}`);
	}
	return await response.json();
};

export const updateSiteLayout = async (site: SiteData, updatedLayout: Device[][]): Promise<void> => {
	console.log('updatedLayout: ', updatedLayout)
	const response = await fetch(`${API_URL}/sites/${site.id}`, {
		method: 'PUT',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ layout: updatedLayout }),
	});
	if (!response.ok) {
		throw new Error(`Failed to update site: ${response.statusText}`);
	}
	// return await response.json();
};

export const getDefaultDevices = async (): Promise<Device[]> => {
	const response = await fetch(`${API_URL}/devices`);
	if (!response.ok) {
		throw new Error(`Failed to fetch devices: ${response.statusText}`);
	}
	return await response.json();
};
