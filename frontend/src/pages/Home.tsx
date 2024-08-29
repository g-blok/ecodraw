import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'; 

const HomePage = () => {
	const navigate = useNavigate();

	const handleGoToSites = () => {
		navigate(`/sites`);
	};

	return (
		<div className="flex flex-col w-full grow p-10 items-center justify-center">
			<div className='text-4xl font-bold'>Welcome to EcoDraw</div>
			<div className='mb-4'>Your go-to energy asset lifecycle manager</div>
			<img className="mt-2 max-w-1/3 rounded" src={'/assets/green_scene.svg'} alt='' />
			<div className='flex items-center mt-8 justify-between'>
				<Button variant='contained' aria-label='add site' onClick={handleGoToSites}>
					Get Started!
				</Button>
			</div>
		</div>
	);
};

export default HomePage;
