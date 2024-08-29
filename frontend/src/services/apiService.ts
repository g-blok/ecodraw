import { Device, SiteData } from '../common/types/types';

const API_URL = 'http://localhost:5000/api';

export const getSites = async (): Promise<SiteData[]> => {
	const response = await fetch(`${API_URL}/sites`);
	if (!response.ok) {
		throw new Error(`Failed to fetch sites: ${response.statusText}`);
	}
	return await response.json();
};

export const createSite = async (site: Partial<SiteData>): Promise<boolean> => {
	const response = await fetch(`${API_URL}/sites`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(site),
	});
	if (!response.ok) {
		throw new Error(`Failed to update site: ${response.statusText}`);
	}
	return true;
};

export const updateSiteLayout = async (site: SiteData, updatedLayout: Device[][]): Promise<boolean> => {
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
	return true;
};

export const updateSiteStage = async (site: SiteData, stage: string): Promise<boolean> => {
	const response = await fetch(`${API_URL}/sites/${site.id}`, {
		method: 'PUT',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({ stage: stage }),
	});
	if (!response.ok) {
		throw new Error(`Failed to update site: ${response.statusText}`);
	}
	return true;
};

export const getDefaultDevices = async (): Promise<Device[]> => {
	const response = await fetch(`${API_URL}/devices`);
	if (!response.ok) {
		throw new Error(`Failed to fetch devices: ${response.statusText}`);
	}
	return await response.json();
};
