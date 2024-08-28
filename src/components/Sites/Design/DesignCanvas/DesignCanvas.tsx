import React, { useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { Device } from '../../../../common/types/types';
import { DEVICE_CATEGORIES, STORAGE_DEVICES, TRANSFORMER_DEVICE } from '../../../../common/constants/constants';

interface DesignCanvasProps {
  devices: Device[];
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ devices }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [systemLayout, setSystemLayout] = useState<Device[][]>([]);
	const [scale, setScale] = useState(5);
	const [offsetX, setOffsetX] = useState(0);
	const [offsetY, setOffsetY] = useState(0);
	const [dragging, setDragging] = useState(false);
	const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
	const [tooltip, setTooltip] = useState<{ x: number, y: number, content: JSX.Element } | null>(null);

	const maxDeviceWidth = 10;
	const maxWidth = 100;

	const walkwayWidth = 10;
	const transformerGap = 5;
	const storageGap = 2;
	const allowableRowCount = maxWidth / (maxDeviceWidth + walkwayWidth);

	const updateSystemLayout = (devices: Device[]): Device[][] => {
		devices.sort((a, b) => a.width - b.width)
		const transformers = devices.filter(device => device.category === DEVICE_CATEGORIES.TRANSFORMER);
		const storageDevices = devices.filter(device => device.category === DEVICE_CATEGORIES.STORAGE);
		const otherDevices = devices.filter(device => device.category !== DEVICE_CATEGORIES.TRANSFORMER && device.category !== DEVICE_CATEGORIES.STORAGE);
		
		const layout: Device[][] = [];
		let systemHeight = 0;

		// Build rows with one transformer and at least two storage devices
		transformers.forEach(transformer => {
			let row: Device[];
			const smallestRowIndex = getSmallestRowIndex(layout);
			
			if (layout.length < allowableRowCount) {
				row = [transformer];

				// Add two storage devices to the row
				for (let i = 0; i < 2 && storageDevices.length > 0; i++) {
					row.push(storageDevices.shift()!);
				}
				// Add other devices to the row
				// while (storageDevices.length > 0 && row.length < 2) {
				// 	row.push(storageDevices.shift()!);
				// }
				while (otherDevices.length > 0 && row.length < 2) {
					row.push(otherDevices.shift()!);
				}
				systemHeight += transformer.width;
				layout.push(row);
			} else {
				row = layout[smallestRowIndex];
				row.push(transformer)
				
				// Add two storage devices to the row
				for (let i = 0; i < 2 && storageDevices.length > 0; i++) {
					const smallestRowIndex = getSmallestRowIndex(layout);
					layout[smallestRowIndex].push(storageDevices.shift()!);
				}
				
				// Add other devices to the row
				while (storageDevices.length > 0 && row.length < 2) {
					const smallestRowIndex = getSmallestRowIndex(layout);
					layout[smallestRowIndex].push(storageDevices.shift()!);
				}
				while (otherDevices.length > 0 && row.length < 2) {
					const smallestRowIndex = getSmallestRowIndex(layout);
					layout[smallestRowIndex].push(otherDevices.shift()!);
				}
			}
			row.sort((a, b) => b.name.localeCompare(a.name));
		});
	
		return layout;
	};

	const getSmallestRowIndex = (layout: Device[][]): number => {
		const rowCapacities: number[] = layout.map((deviceRow) => {
			return deviceRow.reduce((n, {capacity_kwh}) => n + capacity_kwh, 0)
		})
		return rowCapacities.indexOf(Math.min(...rowCapacities))
	}

	const resizeCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas?.parentElement) return;

		const parentWidth = canvas.parentElement?.clientWidth;
		const parentHeight = canvas.parentElement?.clientHeight;
		
		// Adjust canvas resolution
		const dpr = window.devicePixelRatio || 1;
		canvas.width = parentWidth * dpr;
		canvas.height = parentHeight * dpr;
		canvas.style.width = `${parentWidth}px`;
		canvas.style.height = `${parentHeight}px`;
	
		// Scale the context to match the device pixel ratio
		const context = canvas.getContext('2d');
		if (context) {
			context.scale(dpr, dpr);
		}
	};

	const drawGrid = (context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
		const gridSize = 10;
		const dotSize = 2;
		context.fillStyle = '#ccc';
	
		const startX = offsetX % gridSize;
		const startY = offsetY % gridSize;
	
		for (let x = startX; x < canvasWidth; x += gridSize * scale) {
			for (let y = startY; y < canvasHeight; y += gridSize * scale) {
			context.fillRect(x, y, dotSize, dotSize);
			}
		}
	};

	useEffect(() => {
		setSystemLayout(updateSystemLayout(devices));
		handleCenterDevices()
	}, [devices]);

	useEffect(() => {
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d');

		if (canvas && context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			drawGrid(context, canvas.width, canvas.height);

			// Draw devices
			systemLayout.forEach((row, rowIndex) => {
				let xPos = 0;
				let yPos = rowIndex * 20;
				
				row.forEach((device, deviceIndex) => {
					device.x = xPos;
					device.y = yPos;
					context.fillStyle = device.color;
					context.fillRect(
						xPos * scale + offsetX,
						yPos * scale + offsetY,
						device.width * scale,
						device.length * scale,
					);
					context.strokeStyle = 'black';
					context.strokeRect(
						xPos * scale + offsetX,
						yPos * scale + offsetY,
						device.width * scale,
						device.length * scale,
					);
					context.fillStyle = 'black';

					// Update xPos for the next device
					if (deviceIndex < row.length - 1) {
						const nextDevice = row[deviceIndex + 1];
						if (device.category === DEVICE_CATEGORIES.TRANSFORMER && nextDevice.category === DEVICE_CATEGORIES.STORAGE) {
							xPos += device.width + walkwayWidth;
						} else if (device.category === DEVICE_CATEGORIES.TRANSFORMER && nextDevice.category === DEVICE_CATEGORIES.TRANSFORMER) {
							xPos += device.width + transformerGap;
						} else {
							xPos += device.width + storageGap;
						}
					}
				});
			});
		}
		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [scale, offsetX, offsetY, systemLayout]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const zoomFactor = 0.1;
    const newScale = scale + (e.deltaY > 0 ? -zoomFactor : zoomFactor);
    setScale(Math.max(0.1, Math.min(newScale, 5)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging && lastMousePos) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      setOffsetX(offsetX + deltaX);
      setOffsetY(offsetY + deltaY);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMoveTooltip = (e: React.MouseEvent<HTMLCanvasElement>) => {
	const canvas = canvasRef.current;
	if (!canvas) return;
  
	const rect = canvas.getBoundingClientRect();
	const mouseX = (e.clientX - rect.left - offsetX) / scale;
	const mouseY = (e.clientY - rect.top - offsetY) / scale;
  
	let found = false;
	systemLayout.forEach(row => {
	  row.forEach(device => {
		if (device?.x === undefined) return;
		if (device?.y === undefined) return;
		if (
		  mouseX >= device.x &&
		  mouseX <= device.x + device.width &&
		  mouseY >= device.y &&
		  mouseY <= device.y + device.length
		) {
		  setTooltip({
			x: e.clientX,
			y: e.clientY,
			content: getTooltipContent(device),
		  });
		  found = true;
		}
	  });
	});
  
	if (!found) {
	  setTooltip(null);
	}
  };
  
  const getTooltipContent = (device: Device): JSX.Element => { 
	return (
		<div className='flex flex-col border rounded bg-white p-2'>
			<div className='font-bold text-lg'>
				{device.name}
			</div>
			<div>
				{device.capacity_kwh} kWh
			</div>
			<div className='text-sm'>
				${device.cost}
			</div>
			<img className="mt-2 max-w-40 rounded" src={`/assets/products/${device.img}`} alt='' />
		</div>
	)
  }

  const renderTooltip = () => {
	if (!tooltip) return null;
	if (!canvasRef?.current) return null;
	return (
	  <div
		style={{
		  position: 'absolute',
		  left: tooltip.x - canvasRef.current.width / 3,
		  top: tooltip.y - canvasRef.current.height / 3,
		  zIndex: 10,
		  pointerEvents: 'none',
		  transform: 'translate(-100%, -100%)',
		}}
	  >
		{tooltip.content}
	  </div>
	);
  };
  
  const handleMouseUp = () => {
    setDragging(false);
    setLastMousePos(null);
  };

  const handleCenterDevices = () => {
    if (devices.length === 0) return;

    const deviceMinX = Math.min(...devices.map((d) => d.x || 0));
    const deviceMinY = Math.min(...devices.map((d) => d.y || 0));
    const deviceMaxX = Math.max(...devices.map((d) => (d.x || 0) + d.width));
    const deviceMaxY = Math.max(...devices.map((d) => (d.y || 0) + d.length));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const centerX = (deviceMinX + deviceMaxX) / 2;
    const centerY = (deviceMinY + deviceMaxY) / 2;

    setOffsetX(canvasWidth / 2 - centerX * scale);
    setOffsetY(canvasHeight / 2 - centerY * scale);
  };

  return (
    // <div className='flex grow min-w-1/2 w-3/4 mt-4 mr-4 ml-4'>
      <div className='flex flex-col grow rounded-xl border-2 min-w-1/2 w-3/4  mt-4 mr-4 ml-4 relative'>
		{renderTooltip()}
        <canvas
          ref={canvasRef}
          style={{ height: '100%', borderRadius: '10px', cursor: dragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={(e) => {
			handleMouseMove(e);
			handleMouseMoveTooltip(e);
		  }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
		<div className='absolute right-4 top-4 flex flex-col gap-4'>
			<div className='border-2 rounded-lg px-4 py-2 bg-white'>
				{STORAGE_DEVICES.map((device, index) => {
					return <div className='flex justify-between' key={index}>
						<div>{device.name}</div>
						<div className='pl-4 font-bold'>{devices.filter(d => d.name === device.name).length}</div>
					</div>
				})}
				<div className='flex justify-between'>
					<div>{TRANSFORMER_DEVICE.name}</div>
					<div className='pl-4 font-bold'>{devices.filter(d => d.name === TRANSFORMER_DEVICE.name).length}</div>
				</div>
			</div>
			<Button variant="outlined" aria-label="center devices on canvas" onClick={handleCenterDevices}>
				<CenterFocusStrongIcon />
				Center
			</Button>
		</div>
      </div>
    // </div>
  );
};

export default DesignCanvas;
