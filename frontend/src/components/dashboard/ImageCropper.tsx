"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";

const VIEWPORT = 288; // px (w-72 / h-72)
const OUTPUT = 480; // exported square size

/**
 * Dependency-free square image cropper.
 * Drag to reposition, use the slider to zoom, then Apply to export a
 * centre-cropped JPEG data URL of the visible square.
 */
export default function ImageCropper({
  src,
  onCancel,
  onApply,
}: {
  src: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
}) {
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const drag = useRef<{ x: number; y: number } | null>(null);

  // Clamp the offset so the image always covers the viewport.
  const clamp = useCallback(
    (x: number, y: number, dw: number, dh: number) => ({
      x: Math.min(0, Math.max(VIEWPORT - dw, x)),
      y: Math.min(0, Math.max(VIEWPORT - dh, y)),
    }),
    []
  );

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const base = Math.max(VIEWPORT / w, VIEWPORT / h);
    const dw = w * base;
    const dh = h * base;
    setNat({ w, h });
    setBaseScale(base);
    setZoom(1);
    setOffset({ x: (VIEWPORT - dw) / 2, y: (VIEWPORT - dh) / 2 });
  };

  const dw = nat ? nat.w * baseScale * zoom : 0;
  const dh = nat ? nat.h * baseScale * zoom : 0;

  function onZoom(next: number) {
    if (!nat) return;
    const prevDw = nat.w * baseScale * zoom;
    const prevDh = nat.h * baseScale * zoom;
    const nextDw = nat.w * baseScale * next;
    const nextDh = nat.h * baseScale * next;
    // keep the viewport centre anchored while zooming
    const cx = (VIEWPORT / 2 - offset.x) / prevDw;
    const cy = (VIEWPORT / 2 - offset.y) / prevDh;
    const nx = VIEWPORT / 2 - cx * nextDw;
    const ny = VIEWPORT / 2 - cy * nextDh;
    setZoom(next);
    setOffset(clamp(nx, ny, nextDw, nextDh));
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const nx = offset.x + (e.clientX - drag.current.x);
    const ny = offset.y + (e.clientY - drag.current.y);
    drag.current = { x: e.clientX, y: e.clientY };
    setOffset(clamp(nx, ny, dw, dh));
  }
  function onPointerUp() {
    drag.current = null;
  }

  function apply() {
    if (!nat) return;
    const displayScale = baseScale * zoom;
    const sx = -offset.x / displayScale;
    const sy = -offset.y / displayScale;
    const sSize = VIEWPORT / displayScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUTPUT, OUTPUT);
      onApply(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = src;
  }

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-5"
      onClick={onCancel}
    >
      <div
        className="glass-strong w-full max-w-sm rounded-3xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ ["--glass-border" as string]: "rgba(255,255,255,0.14)" }}
      >
        <h3 className="text-lg font-semibold">Crop your photo</h3>
        <p className="mt-1 text-sm text-white/55">Drag to reposition, slide to zoom.</p>

        <div className="mt-5 flex justify-center">
          <div
            className="relative overflow-hidden rounded-full border border-white/15 bg-black/40"
            style={{ width: VIEWPORT, height: VIEWPORT, touchAction: "none", cursor: "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              src={src}
              alt=""
              onLoad={onImgLoad}
              draggable={false}
              className="pointer-events-none max-w-none select-none"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: dw ? `${dw}px` : "auto",
                height: dh ? `${dh}px` : "auto",
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
            {/* subtle framing ring */}
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-xs text-white/50">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => onZoom(Number(e.target.value))}
            className="flex-1 accent-brand-sky"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/70 hover:text-white"
          >
            Cancel
          </button>
          <button type="button" onClick={apply} className="btn-primary !px-5 !py-2.5 !text-sm">
            Apply photo
          </button>
        </div>
      </div>
    </div>
  );
}
