import React, { useCallback, useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import { Device } from '../../../../common/types/types';
import { DEVICE_CATEGORIES, SPACING } from '../../../../common/constants/constants';
import { getBufferAreaDimensions } from '../../../../utils/layoutUtils'
import { numberToString, numberToMoneyString } from '../../../../utils/formatUtils'

interface DesignCanvasProps {
	defaultDevices: Device[];
	systemLayout: Device[][];
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ defaultDevices, systemLayout }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [scale, setScale] = useState<number>(5);
	const [offsetX, setOffsetX] = useState<number>(0);
	const [offsetY, setOffsetY] = useState<number>(0);
	const [dragging, setDragging] = useState<boolean>(false);
	const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
	const [tooltip, setTooltip] = useState<{ x: number, y: number, content: JSX.Element } | null>(null);
	const [showBuffer, setShowBuffer] = useState<boolean>(false);

	const defaultStorageDevices = defaultDevices.filter((device) => device.category === DEVICE_CATEGORIES.STORAGE)
	const defaultTransformerDevices = defaultDevices.filter((device) => device.category === DEVICE_CATEGORIES.TRANSFORMER)

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

	const drawGrid = useCallback((context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
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
	}, [offsetX, offsetY, scale]);

	const drawBufferArea = useCallback((
		context: CanvasRenderingContext2D,
		bufferXPos: number,
		bufferYPos: number,
		bufferWidth: number,
		bufferLength: number,
		scale: number,
		offsetX: number,
		offsetY: number
	) => {
		if (systemLayout.length === 0) return;
		const patternCanvas = document.createElement('canvas');
		patternCanvas.width = 10;
		patternCanvas.height = 10;
		const patternContext = patternCanvas.getContext('2d');

		if (patternContext) {
			patternContext.strokeStyle = 'rgba(246, 211, 129, 0.2)';
			patternContext.lineWidth = 2;
			patternContext.beginPath();
			patternContext.moveTo(0, 0);
			patternContext.lineTo(10, 10);
			patternContext.moveTo(0, 10);
			patternContext.lineTo(10, 0);
			patternContext.stroke();

			const pattern = context.createPattern(patternCanvas, 'repeat');

			if (pattern) {
				context.fillStyle = pattern;
			}
		}

		// Draw the buffer area
		context.fillRect(
			bufferXPos * scale + offsetX,
			bufferYPos * scale + offsetY,
			bufferWidth * scale,
			bufferLength * scale,
		);

		// Draw the border around the buffer area
		context.strokeStyle = 'rgba(246, 211, 129, 0.6)';
		context.strokeRect(
			bufferXPos * scale + offsetX,
			bufferYPos * scale + offsetY,
			bufferWidth * scale,
			bufferLength * scale,
		);
	}, [systemLayout])

	const redrawCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext('2d');

		if (canvas && context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			//Draw grid
			drawGrid(context, canvas.width, canvas.height);
			
			// Draw buffer
			if (showBuffer) {
				console.log('systemLayout: ', systemLayout)
				const { bufferXPos, bufferYPos, bufferWidth, bufferLength } = getBufferAreaDimensions(systemLayout);
				drawBufferArea(context, bufferXPos, bufferYPos, bufferWidth, bufferLength, scale, offsetX, offsetY);
			}

			// Draw devices
			systemLayout.forEach((row, rowIndex) => {
				let xPos = 0;
				const yPos = rowIndex * 20;
				
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
							xPos += device.width + SPACING.WALKWAY_WIDTH;
						} else if (device.category === DEVICE_CATEGORIES.TRANSFORMER && nextDevice.category === DEVICE_CATEGORIES.TRANSFORMER) {
							xPos += device.width + SPACING.TRANSFORMER_GAP;
						} else {
							xPos += device.width + SPACING.STORAGE_GAP;
						}
					}
				});
			});
		}
	}, [drawBufferArea, drawGrid, offsetX, offsetY, scale, showBuffer, systemLayout])

	// Move all devices to center of canvas
	const handleCenterDevices = useCallback(() => {
		if (systemLayout.length === 0) return;

		const deviceMinX = Math.min(...systemLayout.flat().map((d) => d.x || 0));
		const deviceMinY = Math.min(...systemLayout.flat().map((d) => d.y || 0));
		const deviceMaxX = Math.max(...systemLayout.flat().map((d) => (d.x || 0) + d.width));
		const deviceMaxY = Math.max(...systemLayout.flat().map((d) => (d.y || 0) + d.length));

		const canvas = canvasRef.current;
		if (!canvas) return;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		const centerX = (deviceMinX + deviceMaxX) / 2;
		const centerY = (deviceMinY + deviceMaxY) / 2;

		const layoutWidth = deviceMaxX - deviceMinX;
		const layoutHeight = deviceMaxY - deviceMinY;

		const scaleX = canvasWidth / layoutWidth;
		const scaleY = canvasHeight / layoutHeight;
		const newScale = Math.min(scaleX, scaleY) * 0.7;

		setScale(newScale);
		setOffsetX(canvasWidth / 2 - centerX * newScale);
		setOffsetY(canvasHeight / 2 - centerY * newScale);
	}, [systemLayout]);

	const handleToggleBuffer = () => {
		setShowBuffer(!showBuffer);
	}

	// Manage canvas updates
	useEffect(() => {
		resizeCanvas();
		redrawCanvas();
		window.addEventListener('resize', resizeCanvas);
		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	}, [scale, offsetX, offsetY, systemLayout, showBuffer, redrawCanvas]);

	// Center canvas when layout is updated
	useEffect(() => {
		handleCenterDevices();
	}, [handleCenterDevices, systemLayout])

	// Handle scroll to zoom
	const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
		const zoomFactor = 0.1;
		const newScale = scale + (e.deltaY > 0 ? -zoomFactor : zoomFactor);
		setScale(Math.max(0.1, Math.min(newScale, 5)));
	};

	// Hanlde click to initial dragging
	const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
		setDragging(true);
		setLastMousePos({ x: e.clientX, y: e.clientY });
	};

	// Handle dragging if click engaged
	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (dragging && lastMousePos) {
			const deltaX = e.clientX - lastMousePos.x;
			const deltaY = e.clientY - lastMousePos.y;
			setOffsetX(offsetX + deltaX);
			setOffsetY(offsetY + deltaY);
			setLastMousePos({ x: e.clientX, y: e.clientY });
		}
	};

	// Exit dragging state
	const handleMouseUp = () => {
		setDragging(false);
		setLastMousePos(null);
	};

	// Display tooltip over devices
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
  
	// Generate tooltip content
	const getTooltipContent = (device: Device): JSX.Element => { 
		return (
			<div className='flex flex-col border rounded bg-white p-2'>
				<div className='font-bold text-lg'>
					{device.name}
				</div>
				<div>
					{numberToString(device.capacity_kwh)} kWh
				</div>
				<div className='text-sm'>
					{numberToMoneyString(device.cost)}
				</div>
				<img className="mt-2 max-w-40 rounded" src={`/assets/products/${device.img}`} alt='' />
			</div>
		)
	}

	// Create tooltip element
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

  return (
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
				{defaultStorageDevices.map((device, index) => {
					return <div className='flex justify-between' key={index}>
						<div>{device.name}</div>
						<div className='pl-4 font-bold'>{systemLayout.flat().filter(d => d.name === device.name).length}</div>
					</div>
				})}
				<div className='flex justify-between'>
					<div>{defaultTransformerDevices[0].name}</div>
					<div className='pl-4 font-bold'>{systemLayout.flat().filter(d => d.name === defaultTransformerDevices[0].name).length}</div>
				</div>
			</div>
			<Button variant="outlined" aria-label="center devices on canvas" onClick={handleCenterDevices}>
				<CenterFocusStrongIcon />
				Center
			</Button>
			<Button variant="outlined" aria-label="show buffer area on devices" onClick={handleToggleBuffer}>
				<BorderClearIcon />
				Show Buffer
			</Button>
		</div>
	</div>
  );
};

export default DesignCanvas;
