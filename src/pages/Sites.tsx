import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SitesTable from '../components/Sites/Table/SitesTable';
import SiteDesign from '../components/Sites/Design/SiteDesign';
import { SiteData } from '../common/types/types';
import { SITE_DATA } from '../common/constants/constants'

const SitesPage: React.FC = () => {
	const [data, setData] = useState<SiteData[]>(SITE_DATA);

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
