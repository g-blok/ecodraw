import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SitesTable from '../components/Sites/Table/SitesTable';
import SiteDesign from '../components/Sites/Design/SiteDesign';
import { SiteData } from '../common/types/types';
import { debounce } from 'lodash';
import { getSites } from '../services/apiService';


const SitesPage: React.FC = () => {
	const [sites, setSites] = useState<SiteData[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchSites = async () => {
		try {
			const data: SiteData[] = await getSites()
			setSites(data);
		} catch (error) {
			console.error('Error fetching sites:', error);
		} finally {
			setLoading(false);
		}
	};

	const debouncedFetchSites = useCallback(debounce(fetchSites, 300), []);

	useEffect(() => {
		debouncedFetchSites();
		return () => {
			debouncedFetchSites.cancel();
		};
	}, [debouncedFetchSites]);

	const handleAddSite = (newSite: SiteData) => {
		setSites([...sites, newSite]);
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
					<Route path="/" element={<SitesTable sites={sites} onAddSite={handleAddSite} />} />
					<Route path=":path" element={<SiteDesign sites={sites} />} />
				</Routes>
			)}
		</div>
	);
};

export default SitesPage;
