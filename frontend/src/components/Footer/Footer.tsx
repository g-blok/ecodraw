import React from 'react';
import plant from '../../assets/plant.svg';

const Footer: React.FC = () => {
	return (
		<div className="w-full flex gap-2 items-end justify-center p-8">
			<div className="flex justify-end text-primary">
				draw a greener world
			</div>
			<img src={plant} alt="" />
		</div>
	);
};

export default Footer;
