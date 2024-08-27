import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SitesTable from '../components/Sites/Table/SitesTable';
import SiteDesign from '../components/Sites/Design/SiteDesign';
import { SiteData } from '../types/types';

const initialData: SiteData[] = [
	{
		name: 'SunHaven',
		path: 'sunhaven',
		address: 'San Francisco, CA',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-08-01',
		updated_date: '2024-08-10',
		market: 'CAISO',
		metering: 'FOM',
		revenue_streams: ['SGIP', 'Energy Arbitrage'],
	},
	{
		name: 'Solara Grove',
		path: 'solara-grove',
		address: 'Los Angeles, CA',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-07-21',
		updated_date: '2024-08-07',
		market: 'North America',
		metering: 'BTM',
		revenue_streams: ['DRAM', 'SGIP'],
	},
	{
		name: 'Aurora Fields',
		path: 'aurora-fields',
		address: 'Melbourne, AUS',
		lat: 40.7128,
		long: -74.0060,
		stage: 'Design',
		created_date: '2024-06-15',
		updated_date: '2024-08-03',
		market: 'AEMO',
		metering: 'FOM',
		revenue_streams: ['FCAS'],
	},
];

const SitesPage: React.FC = () => {
	const [data, setData] = useState<SiteData[]>(initialData);

	const handleAddSite = (newSite: SiteData) => {
		setData([...data, newSite]);
	};

  return (
    <div className="w-full">
		<Routes>
			<Route path="/" element={<SitesTable data={data} onAddSite={handleAddSite}/>} />
			<Route path=":path" element={<SiteDesign data={data}/>} />
		</Routes>
    </div>
  );
};

export default SitesPage;
