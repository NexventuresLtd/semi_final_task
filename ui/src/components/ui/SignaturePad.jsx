import { useRef, useState, useEffect } from "react";
import { RotateCcw, Check } from "lucide-react";
import Button from "./Button";

export default function SignaturePad({ onSave, existingSignature }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#12151B";
  }, []);

  const getPos = (e) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;

  // The canvas's internal drawing resolution (360x140) and its displayed
  // CSS size (stretched to w-full) are different — without correcting for
  // that ratio, mouse/touch coordinates drift away from where you're
  // actually pointing, worse the wider the container is than 360px.
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (point.clientX - rect.left) * scaleX,
    y: (point.clientY - rect.top) * scaleY,
  };
};

  const start = (e) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const save = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div>
      {existingSignature && !hasDrawn && (
        <div className="mb-3 p-3 rounded-lg border border-glass-border-light dark:border-glass-border-dark bg-surface-light dark:bg-glass-dark">
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mb-2">Current signature on file</p>
          <img src={existingSignature} alt="Saved signature" className="h-14" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={360}
        height={140}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
        className="w-full rounded-lg border-2 border-dashed border-glass-border-light dark:border-glass-border-dark bg-white cursor-crosshair touch-none"
      />
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-1.5">
        Draw your signature above — it will be applied to every request you submit or approve.
      </p>

      <div className="flex gap-2 mt-3">
        <Button type="button" variant="ghost" size="sm" onClick={clear} className="gap-1.5 cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </Button>
        <Button type="button" size="sm" disabled={!hasDrawn} onClick={save} className="gap-1.5 cursor-pointer">
          <Check className="w-3.5 h-3.5" /> Save signature
        </Button>
      </div>
    </div>
  );
}