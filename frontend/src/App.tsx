import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/Home';
import SitesPage from './pages/Sites';
import ManagementPage from './pages/Management';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

const App: React.FC = () => {
  return (
	<ThemeProvider theme={theme}>
		<Router>
			<div className="flex flex-col min-h-screen w-full">
				<Header />
				<div className="flex grow">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/sites/*" element={<SitesPage />} />
						<Route path="/management" element={<ManagementPage />} />
					</Routes>
				</div>
				<Footer />
			</div>
		</Router>
	</ThemeProvider>
  );
};

export default App;
