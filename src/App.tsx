import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCanvas, drawStroke, setCanvasSize } from './utils/canvasUtils';
import { beginStroke, updateStroke } from './modules/currentStroke/slice';
import { endStroke } from './modules/sharedActions';
import { strokesSelector } from './modules/strokes/slice';
import { currentStrokeSelector } from './modules/currentStroke/slice';
import { historyIndexSelector } from './modules/historyIndex/slice';
import { ColorPanel } from './shared/ColorPanel';
import { EditPanel } from './shared/EditPanel';
import { useCanvas } from './CanvasContext';
import { FilePanel } from './shared/FilePanel';

const WIDTH = 1024;
const HEIGHT = 768;

function App() {
  const canvasRef = useCanvas();
  const currentStroke = useSelector(currentStrokeSelector);
  const historyIndex = useSelector(historyIndexSelector);
  const strokes = useSelector(strokesSelector);

  const getCanvasWithContext = (canvas = canvasRef.current) => {
    return { canvas, context: canvas?.getContext('2d') };
  };

  const isDrawing = !!currentStroke.points.length;

  const dispatch = useDispatch();

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();

    if (!canvas || !context) {
      return;
    }

    requestAnimationFrame(() => {
      clearCanvas(canvas);

      strokes.slice(0, strokes.length - historyIndex).forEach((stroke) => {
        drawStroke(context, stroke.points, stroke.color);
      });
    });
  }, [historyIndex, strokes]);

  useEffect(() => {
    const { context } = getCanvasWithContext();

    if (!context) {
      return;
    }

    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color)
    );
  }, [currentStroke]);

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();

    if (!canvas || !context) {
      return;
    }

    setCanvasSize(canvas, WIDTH, HEIGHT);

    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 5;
    context.strokeStyle = 'black';

    clearCanvas(canvas);
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    dispatch(beginStroke({ x: offsetX, y: offsetY }));
  };

  const endDrawing = () => {
    if (isDrawing) {
      dispatch(endStroke({ historyIndex, stroke: currentStroke }));
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;

    dispatch(updateStroke({ x: offsetX, y: offsetY }));
  };

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Redux Paint</div>
        <div className="title-bar-controls">
          <button aria-label="Close" />
        </div>
      </div>
      <EditPanel />
      <ColorPanel />
      <FilePanel />
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
      />
    </div>
  );
}

export default App;
