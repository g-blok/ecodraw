import React, { useRef, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { Device } from '../../../../common/types/types';

interface DesignCanvasProps {
  devices: Device[];
}

const DesignCanvas: React.FC<DesignCanvasProps> = ({ devices }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [deviceLayout, setDeviceLayout] = useState<Device[]>([]);
  const [systemLayout, setSystemLayout] = useState<Device[]>([]);
  const [scale, setScale] = useState(5);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);

  const maxHeight = 100;
  const deviceHeightWithMargin = 20; // 10ft device + 10ft margin

  const calculateLayout = (devices: Device[]): Device[] => {
    let currentHeight = 0;
    let currentRow = 0;
    let xPos = 0;
    let yPos = 0;

    const sortedDevices = devices.sort((a, b) => a.width - b.width);

    sortedDevices.forEach((device) => {
      if (currentHeight + deviceHeightWithMargin <= maxHeight) {
        // Place device in the current row
        device.x = xPos;
        device.y = yPos;
        currentHeight += deviceHeightWithMargin;
        xPos += deviceHeightWithMargin;
      } else {
        // Move to a new row
        currentRow++;
        xPos = 0;
        yPos += 20; // Move down by 20ft (10ft device height + 10ft margin)
        device.x = xPos;
        device.y = yPos;
        currentHeight = deviceHeightWithMargin;
        xPos += deviceHeightWithMargin;
      }
    });

    return sortedDevices;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
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
    }
  };

  useEffect(() => {
    resizeCanvas(); // Initial resize
    window.addEventListener('resize', resizeCanvas);

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const layout = calculateLayout(devices);
      setDeviceLayout(layout);

      console.log('layout: ', layout)
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      const gridSize = 10;
      const dotSize = 2;
      context.fillStyle = '#ccc';

      const startX = offsetX % gridSize;
      const startY = offsetY % gridSize;

      for (let x = startX; x < canvas.width; x += gridSize * scale) {
        for (let y = startY; y < canvas.height; y += gridSize * scale) {
          context.fillRect(x, y, dotSize, dotSize);
        }
      }

      // Draw devices
      layout.forEach((device) => {
        if (device.x !== undefined && device.y !== undefined) {
          context.fillStyle = device.color;
          context.fillRect(
            device.x * scale + offsetX,
            device.y * scale + offsetY,
            device.width * scale,
            device.length * scale
          );
          context.strokeStyle = 'black';
          context.strokeRect(
            device.x * scale + offsetX,
            device.y * scale + offsetY,
            device.width * scale,
            device.length * scale
          );
          context.fillStyle = 'black';
          // context.fillText(device.name, device.x * scale + offsetX + 5, device.y * scale + offsetY + 15);
        }
      });
    }
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scale, offsetX, offsetY, devices]);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
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
    <div className='flex grow w-full mt-4 mr-4 ml-4'>
      <div className='flex flex-col grow rounded-xl border-2 w-full'>
        <canvas
          ref={canvasRef}
          // width={1100}
          // height={600}
          style={{ height: '100%', borderRadius: '10px', cursor: dragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      <div className='flex flex-col gap-4 pl-4'>
		<Button variant="outlined" aria-label="center devices on canvas" onClick={handleCenterDevices}>
			<CenterFocusStrongIcon />
			Center
		</Button>
      </div>
    </div>
  );
};

export default DesignCanvas;
