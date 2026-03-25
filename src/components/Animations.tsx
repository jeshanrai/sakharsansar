"use client";

import { motion } from "framer-motion";
import React from "react";

export const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

export const SlideInRight = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

export const ZoomIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

export const HeroTitleWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.h1 
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.h1>
);

export const HeroSubtitleWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.p 
    className={className}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.p>
);

export const HeroButtonWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);
