import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import './CanvasWorkspace.css';

const CanvasWorkspace = forwardRef(({ 
  imageUrl, 
  activeTool, 
  brushSize,
  clearTrigger,
  onMaskUpdate
}, ref) => {
  const containerRef = useRef(null);
  const bgImgRef = useRef(null);
  const maskCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  // Expose mask base64 function to parent
  useImperativeHandle(ref, () => ({
    getMaskBase64: () => {
      const canvas = maskCanvasRef.current;
      if (!canvas) return null;
      // We need a pristine black/white mask. What we drew was red, so we need to flatten to black/white.
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      // Background black
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // Draw mask on top as white
      // Since our mask is red, we can use globalCompositeOperation to turn it white
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(canvas, 0, 0);
      
      // But wait! Canvas drawImage of semi-transparent red will just be dark red.
      // Better to read image data and manually threshold, or draw pure white in drawing function and use CSS for red display.
      // Since we styled ctx.strokeStyle = 'rgba(214, 59, 47, 0.5)' earlier in this file, we must read pixels.
      const imgData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // If red channel is high (we painted it red), make it white, else black
        // Actually, anything that isn't purely black from the background could be white
        if (data[i] > 10 || data[i+1] > 10 || data[i+2] > 10) {
          data[i] = 255;   // R
          data[i+1] = 255; // G
          data[i+2] = 255; // B
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return tempCanvas.toDataURL('image/png');
    }
  }));

  // Reset transform and clear mask when image changes
  useEffect(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    clearMask();
  }, [imageUrl]);

  // Handle external clear trigger
  useEffect(() => {
    if (clearTrigger > 0) {
      clearMask();
    }
  }, [clearTrigger]);

  const clearMask = () => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onMaskUpdate) onMaskUpdate(false);
  };

  // Sync canvas size to image display size on load/resize
  const syncCanvasSize = () => {
    if (!bgImgRef.current || !maskCanvasRef.current) return;
    const img = bgImgRef.current;
    const canvas = maskCanvasRef.current;
    
    // We want the internal resolution of the canvas to match the natural image bounds
    // but its CSS width/height to match the displayed image.
    // For inpainting, Replicate needs mask to match exactly.
    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      // Save old drawing if resize happens? Not strictly necessary for this prototype
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }
  };

  const getCanvasCoordinates = (e) => {
    if (!bgImgRef.current || !maskCanvasRef.current) return null;
    const img = bgImgRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calculate CSS scale factor
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    // Mouse position relative to image rect
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (activeTool === 'roam') {
      setIsPanning(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      panStart.current = { x: clientX - pan.x, y: clientY - pan.y };
    } else if (activeTool === 'brush') {
      setIsDrawing(true);
      const coords = getCanvasCoordinates(e);
      if (coords) drawBrush(coords.x, coords.y);
    }
  };

  const handlePointerMove = (e) => {
    if (activeTool === 'roam' && isPanning) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPan({
        x: clientX - panStart.current.x,
        y: clientY - panStart.current.y
      });
    } else if (activeTool === 'brush' && isDrawing) {
      const coords = getCanvasCoordinates(e);
      if (coords) drawBrush(coords.x, coords.y, true);
    }
  };

  const handlePointerUp = () => {
    if (activeTool === 'roam') {
      setIsPanning(false);
    } else if (activeTool === 'brush') {
      setIsDrawing(false);
      const ctx = maskCanvasRef.current?.getContext('2d');
      // Just a simple check if any non-transparent pixels exist?
      // For performance, we'll just assume they drew something.
      if (onMaskUpdate) onMaskUpdate(true);
    }
  };

  const lastPos = useRef(null);
  
  const drawBrush = (x, y, isMoving = false) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    // Visually it's red and semi-transparent via CSS or canvas alpha
    ctx.strokeStyle = 'rgba(214, 59, 47, 0.5)';
    ctx.fillStyle = 'rgba(214, 59, 47, 0.5)';

    if (!isMoving) {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      lastPos.current = { x, y };
    } else {
      ctx.beginPath();
      if (lastPos.current) {
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPos.current = { x, y };
    }
  };

  const handleWheel = (e) => {
    if (activeTool !== 'roam') return;
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    let newScale = scale + delta;
    newScale = Math.min(Math.max(0.5, newScale), 5); // clamp scale
    setScale(newScale);
  };

  return (
    <div 
      className={`workspace-viewport ${activeTool}`} 
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div 
        className="canvas-transform-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transition: isPanning ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <img 
          ref={bgImgRef}
          src={imageUrl} 
          alt="Room" 
          className="bg-image"
          onLoad={syncCanvasSize}
          draggable={false}
        />
        <canvas 
          ref={maskCanvasRef}
          className="mask-canvas"
        />
      </div>

      {activeTool === 'roam' && (
        <div className="zoom-controls">
          <input 
            type="range" 
            min="50" 
            max="500" 
            value={scale * 100} 
            onChange={e => setScale(e.target.value / 100)} 
          />
          <span>{Math.round(scale * 100)}%</span>
        </div>
      )}
    </div>
  );
});

export default CanvasWorkspace;
