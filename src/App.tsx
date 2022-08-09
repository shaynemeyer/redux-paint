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
import { ModalLayer } from './components/modal/ModalLayer';
import { RootState } from './utils/types';

const WIDTH = 1024;
const HEIGHT = 768;

function App() {
  const dispatch = useDispatch();
  const canvasRef = useCanvas();
  const isDrawing = useSelector<RootState>(
    (state) => !!state.currentStroke.points.length
  );

  const historyIndex = useSelector<RootState, RootState['historyIndex']>(
    historyIndexSelector
  );
  const strokes = useSelector<RootState, RootState['strokes']>(strokesSelector);
  const currentStroke = useSelector<RootState, RootState['currentStroke']>(
    currentStrokeSelector
  );

  const getCanvasWithContext = (canvas = canvasRef.current) => {
    return { canvas, context: canvas?.getContext('2d') };
  };

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    dispatch(beginStroke({ x: offsetX, y: offsetY }));
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIndex, strokes]);

  useEffect(() => {
    const { context } = getCanvasWithContext();

    if (!context) {
      return;
    }

    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <ModalLayer />
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
