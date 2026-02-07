import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  blur?: boolean;
  className?: string;
}

export const Reveal = ({
  children,
  width = "fit-content",
  delay = 0,
  duration = 0.8,
  direction = "up",
  blur = true,
  className = "",
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const getHiddenVariant = (): Variant => {
    const base: any = { opacity: 0 };
    if (blur) base.filter = "blur(10px)";
    
    switch (direction) {
      case "up": return { ...base, y: 50 };
      case "down": return { ...base, y: -50 };
      case "left": return { ...base, x: 50 };
      case "right": return { ...base, x: -50 };
      case "none": return { ...base };
      default: return { ...base, y: 50 };
    }
  };

  const getVisibleVariant = (): Variant => {
    const base: any = { opacity: 1 };
    if (blur) base.filter = "blur(0px)";
    
    switch (direction) {
      case "up": return { ...base, y: 0 };
      case "down": return { ...base, y: 0 };
      case "left": return { ...base, x: 0 };
      case "right": return { ...base, x: 0 };
      case "none": return { ...base };
      default: return { ...base, y: 0 };
    }
  };

  return (
    <div ref={ref} style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={{
          hidden: getHiddenVariant(),
          visible: getVisibleVariant(),
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration, delay, ease: [0.25, 0.25, 0, 1] }} // Custom easing for premium feel
      >
        {children}
      </motion.div>
    </div>
  );
};

export const StaggerContainer = ({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerChildren,
          },
        },
      }}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
        visible: { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          transition: {
            duration: 0.8,
            ease: [0.25, 0.25, 0, 1]
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
