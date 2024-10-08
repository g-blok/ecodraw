import React, { useState, useEffect, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Device } from '../common/types/types';
import { COST_MULTIPLIERS, SPACING } from '../common/constants/constants';
import { getDefaultDevices } from '../services/apiService';
import { debounce } from 'lodash';
import { numberToString, numberToMoneyString } from '../utils/formatUtils';

const ManagementPage = () => {
	const [defaultDevices, setDefaultDevices] = useState<Device[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch default devices on component mount
	const fetchDefaultDevices = useCallback(async () => {
		try {
			const devices: Device[] = await getDefaultDevices();
			setDefaultDevices(devices);
		} catch (error) {
			console.error('Error fetching devices:', error);
		} finally {
			setLoading(false);
		}
	}, []);

	// Debounced fetch of default devices
	useEffect(() => {
		const debouncedFetch = debounce(fetchDefaultDevices, 300);
		debouncedFetch();
		return () => {
			debouncedFetch.cancel();
		};
	}, [fetchDefaultDevices]);

	return (
		<div className="flex flex-col gap-4 p-10 w-full items-center">
			{loading ? (
				<div className="flex p-4 w-full h-full items-center justify-center">
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
				<div className="flex flex-col w-2/3 gap-16">
					<div>
						<div className="font-bold text-lg">Devices</div>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="center">
											Manufacturer
										</TableCell>
										<TableCell align="right">
											Length (ft)
										</TableCell>
										<TableCell align="right">
											Width (ft)
										</TableCell>
										<TableCell align="right">
											Cost
										</TableCell>
										<TableCell align="right">
											Capacity (kWh)
										</TableCell>
										<TableCell align="right">
											Release Date
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{defaultDevices.map((row, index) => (
										<TableRow
											key={index}
											className={`${
												index % 2 === 0
													? 'bg-gray-100'
													: 'bg-white'
											}`}
										>
											<TableCell>{row.name}</TableCell>
											<TableCell align="center">
												{row.mfg}
											</TableCell>
											<TableCell align="right">
												{row.width}
											</TableCell>
											<TableCell align="right">
												{row.length}
											</TableCell>
											<TableCell align="right">
												{numberToMoneyString(row.cost)}
											</TableCell>
											<TableCell align="right">
												{numberToString(
													row.capacity_kwh
												)}
											</TableCell>
											<TableCell align="right">
												{row.release_date}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
					<div>
						<div className="font-bold text-lg">Costs</div>
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="center">Id</TableCell>
										<TableCell align="right">
											Sort
										</TableCell>
										<TableCell align="right">
											Type
										</TableCell>
										<TableCell align="right">
											Multiplier
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{COST_MULTIPLIERS.map((row, index) => (
										<TableRow
											key={index}
											className={`${
												index % 2 === 0
													? 'bg-gray-100'
													: 'bg-white'
											}`}
										>
											<TableCell>{row.display}</TableCell>
											<TableCell align="center">
												{row.name}
											</TableCell>
											<TableCell align="right">
												{row.sort}
											</TableCell>
											<TableCell align="right">
												{row.multiplier_type}
											</TableCell>
											<TableCell align="right">
												{row.multiplier}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
					<div>
						<div className="font-bold text-lg">Spacing</div>
						<div className="flex flex-col gap-2 w-96 mt-2 ml-2">
							<div className="flex justify-between">
								<div>Walkway Width</div>
								<div className="font-bold">
									{SPACING.WALKWAY_WIDTH} ft
								</div>
							</div>
							<div className="flex justify-between">
								<div>Transformer Gap</div>
								<div className="font-bold">
									{SPACING.TRANSFORMER_GAP} ft
								</div>
							</div>
							<div className="flex justify-between">
								<div>Storage Gap</div>
								<div className="font-bold">
									{SPACING.STORAGE_GAP} ft
								</div>
							</div>
							<div className="flex justify-between">
								<div>Max Device Width</div>
								<div className="font-bold">
									{SPACING.MAX_DEVICE_WIDTH} ft
								</div>
							</div>
							<div className="flex justify-between">
								<div>Max System Width</div>
								<div className="font-bold">
									{SPACING.MAX_SYSTEM_WIDTH} ft
								</div>
							</div>
							<div className="flex justify-between">
								<div>Outer Offset</div>
								<div className="font-bold">
									{SPACING.OUTER_OFFSET} ft
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ManagementPage;
