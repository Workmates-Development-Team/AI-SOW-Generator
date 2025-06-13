import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as fabric from 'fabric';

export interface CanvasHandle {
  addObject: (type: string, options?: any) => void;
}

interface CanvasProps {
  width?: number;
  height?: number;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ width = 1200, height = 800 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!fabric || !fabric.Canvas) {
        setError("Fabric.js not loaded properly");
        return;
      }

      if (!canvasRef.current) {
        setError("Canvas element not found");
        return;
      }

      try {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width,
          height,
          backgroundColor: "#f8f9fa",
          selection: true,
        });

        fabricRef.current = fabricCanvas;

        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Error initializing Fabric.js canvas:", err);
        setError(`Initialization error: ${err}`);
      }

      return () => {
        if (fabricRef.current) {
          try {
            fabricRef.current.dispose();
            fabricRef.current = null;
          } catch (err) {
            console.error("Error during cleanup:", err);
          }
        }
      };
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      addObject: (type: string, options?: any) => {
        if (!fabricRef.current) return;
        let obj;
        switch (type) {
          case "rectangle":
            obj = new fabric.Rect({
              left: 100,
              top: 100,
              fill: "#3498db",
              width: 120,
              height: 80,
              stroke: "#2980b9",
              strokeWidth: 2,
              cornerColor: "#e74c3c",
              cornerSize: 6,
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
            break;
          case "circle":
            obj = new fabric.Circle({
              left: 150,
              top: 150,
              fill: "#2ecc71",
              radius: 60,
              stroke: "#27ae60",
              strokeWidth: 2,
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
            break;
          case "triangle":
            obj = new fabric.Triangle({
              left: 200,
              top: 200,
              fill: "#f39c12",
              width: 100,
              height: 100,
              stroke: "#e67e22",
              strokeWidth: 2,
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
            break;
            case "text":
              obj = new fabric.IText("Double-click to edit", {
              left: 250,
              top: 250,
              fontSize: 32,
              fill: "#222",
              fontFamily: "Arial",
              hasControls: true,
              hasBorders: true,
              selectable: true,
            });
            break;
            case "line":
              const style = options?.style || "solid";
              if (style === "solid") {
                obj = new fabric.Line([100, 100, 300, 100], {
                  stroke: "#333",
                  strokeWidth: 4,
                });
              } else if (style === "dashed") {
                obj = new fabric.Line([100, 150, 300, 150], {
                  stroke: "#333",
                  strokeWidth: 4,
                  strokeDashArray: [10, 10],
                });
              } else if (style === "arrow") {
                obj = new fabric.Group([
                  new fabric.Line([100, 200, 300, 200], {
                    stroke: "#333",
                    strokeWidth: 4,
                  }),
              new fabric.Triangle({
                left: 300,
                top: 200,
                width: 16,
                height: 16,
                angle: 90,
                fill: "#333",
                selectable: false,
                originX: "center",
                originY: "center",
              }),
            ]);
          }
          break;
          default:
            return;
        }
        fabricRef.current.add(obj);
        fabricRef.current.setActiveObject(obj);
        fabricRef.current.renderAll();
      },
    }));

    if (error) {
      return (
        <div
          className="border-2 border-dashed border-red-500 p-5 text-red-500 rounded-lg text-center"
        >
          <h3>Canvas Error</h3>
          <p>{error}</p>
          <small>Check console for more details</small>
        </div>
      );
    }

    return (
      <div
        className="border border-gray-300 rounded-lg inline-block bg-white shadow-md relative"
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`block ${isLoaded ? 'opacity-100' : 'opacity-50'} transition-opacity duration-300 ease-in-out rounded-md`}
        />
        {!isLoaded && !error && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
          >
            Loading canvas...
          </div>
        )}
      </div>
    );
  }
);

export default Canvas;