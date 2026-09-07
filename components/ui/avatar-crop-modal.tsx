"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  X,
  Move,
  Crop,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

export interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
  title?: string;
  outputSize?: number;
}

export function AvatarCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  title,
  outputSize = 400
}: AvatarCropModalProps) {
  const { t, dir } = useApp();
  const [mounted, setMounted] = React.useState(false);

  const [zoom, setZoom] = React.useState<number>(1);
  const [pan, setPan] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = React.useState<number>(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = React.useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Multi-touch pinch tracking
  const pinchStartDistRef = React.useRef<number | null>(null);
  const pinchStartZoomRef = React.useRef<number>(1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  // Viewport dimensions optimized for all mobile screens (from 320px width up to desktop)
  const viewportSize = 250;
  const cropDiameter = 210;
  const cropRadius = cropDiameter / 2;

  // Ensure portal only mounts on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Load natural dimensions when imageSrc changes
  React.useEffect(() => {
    if (!imageSrc) return;
    setImageError(false);
    setIsProcessing(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);

    const img = new Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setImageError(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle escape key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  // Lock background scrolling while modal is active
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !imageSrc) return null;

  // Base scale to ensure the image covers at least the crop circle diameter
  const baseScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? Math.max(cropDiameter / naturalSize.width, cropDiameter / naturalSize.height)
      : 1;

  // Max pan bound: allow user to center any part comfortably
  const currentRenderedW = naturalSize.width * baseScale * zoom;
  const currentRenderedH = naturalSize.height * baseScale * zoom;
  const maxPanX = Math.max(30, (currentRenderedW - cropDiameter) / 2 + 50);
  const maxPanY = Math.max(30, (currentRenderedH - cropDiameter) / 2 + 50);

  const clampPan = (newX: number, newY: number) => {
    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY))
    };
  };

  // Pointer / Mouse events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan(clampPan(newX, newY));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore if pointer capture release fails
    }
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomStep = 0.05;
    const delta = e.deltaY < 0 ? zoomStep : -zoomStep;
    setZoom((prev) => Math.min(3.5, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  // Touch Pinch-to-zoom on mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / pinchStartDistRef.current;
      const newZoom = Math.min(3.5, Math.max(0.8, Number((pinchStartZoomRef.current * ratio).toFixed(2))));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
  };

  // Controls
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Crop and export
  const handleConfirmCrop = () => {
    if (!naturalSize.width || !naturalSize.height || isProcessing) return;

    setIsProcessing(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Scale ratio from viewport crop diameter to canvas size
      const scaleRatio = outputSize / cropDiameter;

      // 1. Move to canvas center
      ctx.translate(outputSize / 2, outputSize / 2);

      // 2. Translate by pan scaled to canvas
      ctx.translate(pan.x * scaleRatio, pan.y * scaleRatio);

      // 3. Rotate around that point
      ctx.rotate((rotation * Math.PI) / 180);

      // 4. Scale by baseScale * zoom * scaleRatio
      const drawScale = baseScale * zoom * scaleRatio;
      ctx.scale(drawScale, drawScale);

      // 5. Draw image centered
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          ctx.drawImage(
            img,
            -naturalSize.width / 2,
            -naturalSize.height / 2,
            naturalSize.width,
            naturalSize.height
          );

          // Export as compressed high quality JPEG (around ~40-60KB)
          const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          onCropComplete(croppedDataUrl);
          onClose();
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        setImageError(true);
      };
      img.src = imageSrc;
    } catch {
      setIsProcessing(false);
      setImageError(true);
    }
  };

  // Ratio for live mini preview avatar
  const miniPreviewSize = 46;
  const miniScale = miniPreviewSize / cropDiameter;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      dir={dir}
      onClick={(e) => {
        // Close if backdrop itself is clicked
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      {/* Modal Dialog Box */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-sky-500/10 dark:bg-sky-400/15 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Crop className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 truncate">
                {title || t("تحديد وضبط الصورة الشخصية", "Crop & Adjust Avatar")}
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                {t("اسحب لتحريك الصورة واستخدم الزووم للتركيز على الوجه", "Drag to move, zoom to frame face")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-3 sm:p-4 flex flex-col items-center gap-2.5 sm:gap-3 overflow-y-auto">
          {imageError ? (
            <div className="w-full py-8 flex flex-col items-center justify-center text-center gap-2 text-red-500">
              <AlertCircle className="h-7 w-7" />
              <p className="text-xs font-bold">{t("تعذر تحميل الصورة المحددة. يرجى اختيار صورة أخرى.", "Failed to load image. Please pick another one.")}</p>
            </div>
          ) : (
            <>
              {/* Interactive Cropping Viewport */}
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ width: viewportSize, height: viewportSize }}
                className="relative overflow-hidden rounded-2xl bg-zinc-950 select-none touch-none cursor-grab active:cursor-grabbing border border-zinc-800 shadow-inner flex items-center justify-center shrink-0"
              >
                {/* Image being cropped */}
                {naturalSize.width > 0 && (
                  <img
                    ref={imgRef}
                    src={imageSrc}
                    alt="Avatar crop source"
                    draggable={false}
                    className="absolute pointer-events-none select-none max-w-none origin-center"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${naturalSize.width}px`,
                      height: `${naturalSize.height}px`,
                      transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) rotate(${rotation}deg) scale(${baseScale * zoom})`,
                    }}
                  />
                )}

                {/* SVG Dimmed Mask + Circular Cutout + Alignment Grid */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  viewBox={`0 0 ${viewportSize} ${viewportSize}`}
                >
                  <defs>
                    <mask id="avatar-crop-mask-circle">
                      {/* White covers entire viewport */}
                      <rect width={viewportSize} height={viewportSize} fill="white" />
                      {/* Black circle cuts out transparent hole */}
                      <circle cx={viewportSize / 2} cy={viewportSize / 2} r={cropRadius} fill="black" />
                    </mask>
                  </defs>

                  {/* Dark outer dim mask */}
                  <rect
                    width={viewportSize}
                    height={viewportSize}
                    fill="rgba(0, 0, 0, 0.65)"
                    mask="url(#avatar-crop-mask-circle)"
                  />

                  {/* High contrast circular crop guideline */}
                  <circle
                    cx={viewportSize / 2}
                    cy={viewportSize / 2}
                    r={cropRadius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    className="opacity-90 drop-shadow-sm"
                  />

                  {/* Subtle Rule-of-Thirds Grid inside the circle for framing */}
                  <line
                    x1={viewportSize / 2 - cropRadius * 0.35}
                    y1={viewportSize / 2 - cropRadius * 0.93}
                    x2={viewportSize / 2 - cropRadius * 0.35}
                    y2={viewportSize / 2 + cropRadius * 0.93}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={viewportSize / 2 + cropRadius * 0.35}
                    y1={viewportSize / 2 - cropRadius * 0.93}
                    x2={viewportSize / 2 + cropRadius * 0.35}
                    y2={viewportSize / 2 + cropRadius * 0.93}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={viewportSize / 2 - cropRadius * 0.93}
                    y1={viewportSize / 2 - cropRadius * 0.35}
                    x2={viewportSize / 2 + cropRadius * 0.93}
                    y2={viewportSize / 2 - cropRadius * 0.35}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1={viewportSize / 2 - cropRadius * 0.93}
                    y1={viewportSize / 2 + cropRadius * 0.35}
                    x2={viewportSize / 2 + cropRadius * 0.93}
                    y2={viewportSize / 2 + cropRadius * 0.35}
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                </svg>

                {/* Floating drag badge overlay */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white/90 border border-white/10 flex items-center gap-1 pointer-events-none">
                  <Move className="h-2.5 w-2.5" />
                  <span>{t("اسحب للتحريك", "Drag")}</span>
                </div>
              </div>

              {/* Controls Section */}
              <div className="w-full space-y-2 pt-0.5">
                {/* Zoom Slider Bar */}
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))))}
                    className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                    title={t("تصغير", "Zoom Out")}
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>

                  <input
                    type="range"
                    min="0.8"
                    max="3.5"
                    step="0.02"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-sky-500 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => setZoom((prev) => Math.min(3.5, Number((prev + 0.1).toFixed(2))))}
                    className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
                    title={t("تكبير", "Zoom In")}
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300 w-10 text-center shrink-0">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Quick Action Tools: Rotate, Reset + Live Mini Preview */}
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    {/* Rotate button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRotate}
                      className="h-7 px-2.5 text-[11px] font-bold gap-1 rounded-xl border-zinc-200 dark:border-zinc-700 cursor-pointer"
                    >
                      <RotateCw className="h-3 w-3 text-sky-500" />
                      <span>{t("تدوير", "Rotate")}</span>
                    </Button>

                    {/* Reset button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-7 px-2 text-[11px] font-bold gap-1 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{t("إعادة ضبط", "Reset")}</span>
                    </Button>
                  </div>

                  {/* Real-time Live Mini Avatar Preview */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-400">
                      {t("المعاينة:", "Preview:")}
                    </span>
                    <div
                      className="relative rounded-full overflow-hidden border-2 border-sky-500 shadow-sm bg-zinc-950 shrink-0"
                      style={{ width: miniPreviewSize, height: miniPreviewSize }}
                      title={t("معاينة حية للمظهر النهائي", "Live final appearance preview")}
                    >
                      {naturalSize.width > 0 && (
                        <img
                          src={imageSrc}
                          alt="Preview"
                          draggable={false}
                          className="absolute pointer-events-none select-none max-w-none origin-center"
                          style={{
                            left: "50%",
                            top: "50%",
                            width: `${naturalSize.width}px`,
                            height: `${naturalSize.height}px`,
                            transform: `translate(calc(-50% + ${pan.x * miniScale}px), calc(-50% + ${pan.y * miniScale}px)) rotate(${rotation}deg) scale(${baseScale * zoom * miniScale})`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-850/60 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="h-8 px-3.5 text-xs font-bold rounded-xl cursor-pointer"
          >
            {t("إلغاء", "Cancel")}
          </Button>

          <Button
            type="button"
            onClick={handleConfirmCrop}
            disabled={isProcessing || imageError || naturalSize.width === 0}
            className="h-8 px-4 text-xs font-extrabold rounded-xl bg-sky-600 hover:bg-sky-700 text-white gap-1.5 cursor-pointer shadow-md shadow-sky-500/20"
          >
            {isProcessing ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>{t("جارٍ القص...", "Cropping...")}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>{t("تأكيد وقص الصورة", "Crop & Apply")}</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
