"use client";

import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { PointerEvent, useEffect, useRef, useState } from "react";

export type RingGalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  badge?: string;
  image: string;
  actionLabel: string;
  onAction: () => void;
};

type CircularGalleryProps = {
  items: RingGalleryItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  /** Degrees per second when idle. */
  autoRotateSpeed?: number;
};

function mod(value: number, count: number) {
  return ((value % count) + count) % count;
}

export default function CircularGallery({
  items,
  activeIndex,
  onActiveIndexChange,
  autoRotateSpeed = 4
}: CircularGalleryProps) {
  const reduceMotion = useReducedMotion();
  const rotation = useMotionValue(0);
  const [, forceRender] = useState(0);
  const draggingRef = useRef(false);
  const hoveringRef = useRef(false);
  const lastPointerX = useRef(0);
  const settleTimer = useRef<number | null>(null);
  const reportedIndex = useRef(activeIndex);

  const count = Math.max(items.length, 1);
  const anglePerItem = 360 / count;

  function frontIndexFor(angle: number) {
    return mod(Math.round(-angle / anglePerItem), count);
  }

  function snapTo(index: number, immediate = false) {
    const current = rotation.get();
    const target = -index * anglePerItem;
    // take the shortest path around the ring
    const delta = ((target - current) % 360 + 540) % 360 - 180;
    if (immediate || reduceMotion) {
      rotation.set(current + delta);
      return;
    }
    animate(rotation, current + delta, { type: "spring", stiffness: 120, damping: 22 });
  }

  // keep ring in sync when controls outside the gallery change the index
  useEffect(() => {
    if (activeIndex !== reportedIndex.current) {
      reportedIndex.current = activeIndex;
      snapTo(activeIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // re-render on rotation change so per-card opacity/scale stay current,
  // and report the card that faces front
  useEffect(() => {
    return rotation.on("change", (value) => {
      forceRender((tick) => tick + 1);
      const front = frontIndexFor(value);
      if (front !== reportedIndex.current && draggingRef.current) {
        reportedIndex.current = front;
        onActiveIndexChange(front);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anglePerItem, count]);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || draggingRef.current || hoveringRef.current) return;
    rotation.set(rotation.get() - (autoRotateSpeed * delta) / 1000);
  });

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    draggingRef.current = true;
    lastPointerX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const deltaX = event.clientX - lastPointerX.current;
    lastPointerX.current = event.clientX;
    rotation.set(rotation.get() + deltaX * 0.22);
  }

  function handlePointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    // settle onto the nearest card after the drag ends
    const front = frontIndexFor(rotation.get());
    reportedIndex.current = front;
    onActiveIndexChange(front);
    snapTo(front);
  }

  const currentRotation = rotation.get();

  return (
    <div
      className="ringGallery"
      role="region"
      aria-label="Circular 3D gallery of results"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        hoveringRef.current = true;
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
      }}
    >
      <div className="ringGlow" aria-hidden="true" />
      <motion.div className="ringStage" style={{ rotateY: rotation }}>
        {items.map((item, index) => {
          const itemAngle = index * anglePerItem;
          const relativeAngle = mod(itemAngle + currentRotation, 360);
          const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
          const depth = 1 - normalizedAngle / 180;
          const opacity = Math.max(0.25, depth);
          const isFront = index === mod(activeIndex, count);

          return (
            <div
              key={item.id}
              role="group"
              aria-label={item.title}
              className={isFront ? "ringCard front" : "ringCard"}
              style={{
                transform: `rotateY(${itemAngle}deg) translateZ(var(--ring-radius))`,
                opacity,
                zIndex: Math.round(depth * 100)
              }}
            >
              <div className="ringCardBody">
                <img src={item.image} alt={item.title} loading="lazy" draggable={false} />
                <div className="ringCardOverlay">
                  {item.badge && <span className="ringBadge">{item.badge}</span>}
                  <h3>{item.title}</h3>
                  <em>{item.subtitle}</em>
                  <p>{item.meta}</p>
                  <button
                    type="button"
                    tabIndex={isFront ? 0 : -1}
                    onClick={(event) => {
                      event.stopPropagation();
                      item.onAction();
                    }}
                  >
                    {item.actionLabel} <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
      <span className="ringHint">Drag to spin · click a card to open its route</span>
    </div>
  );
}
