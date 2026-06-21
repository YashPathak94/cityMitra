"use client";

import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

export function ContainerScroll({ titleComponent, children }: { titleComponent: ReactNode; children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 1] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="scrollContainer" ref={containerRef}>
      <div className="scrollInner">
        <motion.div className="scrollHeader" style={{ translateY: translate }}>
          {titleComponent}
        </motion.div>
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div className="scrollCard" style={{ rotateX: rotate, scale }}>
      <div className="scrollCardInner">{children}</div>
    </motion.div>
  );
}
