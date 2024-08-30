import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SitesTable from '../components/Sites/Table/SitesTable';
import SiteDesign from '../components/Sites/Design/SiteDesign';
import { SiteData } from '../common/types/types';
import { debounce } from 'lodash';
import { getSites } from '../services/apiService';
import { DateTime } from 'luxon';

const SitesPage: React.FC = () => {
	const [sites, setSites] = useState<SiteData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchSites = async () => {
		try {
			const sites = await getSites()
			const updatedSites: SiteData[] = sites.map(site => (
				{
					...site,
					created_date: site.created_date ? DateTime.fromSeconds(site.created_date).toFormat('DD') : '-',
					updated_date: site.updated_date ? DateTime.fromSeconds(site.updated_date).toFormat('DD') : '-',
				}
			))
			setSites(updatedSites);
		} catch (error) {
			console.error('Error fetching sites:', error);
		} finally {
			setLoading(false);
		}
	};

	// Create new site in database
	const debouncedFetchSites = useCallback(
		debounce(async () => {
			try {
				await fetchSites();
			} catch (error) {
				console.error('Error fetching sites:', error);
			}
		}, 1000),
		[]
	);

	useEffect(() => {
		debouncedFetchSites();
		return () => {
			debouncedFetchSites.cancel();
		};
	}, [debouncedFetchSites]);

	const handleAddSite = async () => {
		fetchSites()
	};

	const handleAddSiteLoading = async (loading: boolean) => {
		setLoading(loading)
	};

	const handleSiteChanged = async () => {
		fetchSites()
	};

	return (
		<div className="w-full">
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
				<Routes>
					<Route path="/" element={<SitesTable sites={sites} onAddSite={handleAddSite} onAddSiteLoading={handleAddSiteLoading}/>} />
					<Route path=":path" element={<SiteDesign sites={sites} onSiteChange={handleSiteChanged} />} />
				</Routes>
			)}
		</div>
	);
};

export default SitesPage;
