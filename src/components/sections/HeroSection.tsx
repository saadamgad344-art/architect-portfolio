'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll('.char'),
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 1.4, ease: 'power4.out', delay: 0.4 }
      );
    }
  }, []);

  // noise texture
  useEffect(() => {
    const canvas = noiseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 256;
    canvas.height = 256;
    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const line1 = "SHAPING";
  const line2 = "SPACE &";
  const line3 = "VISION";

  let charIndex = 0;

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-start px-16 overflow-hidden">

      {/* خلفية */}
      <div className="absolute inset-0 bg-[#080808]" />

      {/* noise */}
      <canvas
        ref={noiseRef}
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        style={{ imageRendering: 'pixelated', backgroundRepeat: 'repeat' }}
      />

      {/* خط أفقي متحرك */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 origin-left"
      />

      {/* خط عمودي يسار */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute left-16 top-0 w-[1px] h-full bg-white/5 origin-top"
      />

      {/* رقم السنة */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-8 right-16 text-white/20 text-xs tracking-widest"
      >
        EST. 2024
      </motion.span>

      {/* العنوان */}
      <div className="relative z-10">
        <h1
          ref={titleRef}
          className="text-[11vw] font-thin tracking-[-0.03em] leading-[0.9] text-white/90 uppercase"
        >
          {[line1, line2, line3].map((line, li) => (
            <div key={li} className="overflow-hidden">
              <div>
                {line.split('').map((char) => {
                  const ci = charIndex++;
                  return (
                    <span key={ci} className="char inline-block">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </h1>
      </div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="relative z-10 mt-12 flex items-center gap-6"
      >
        <div className="w-12 h-[1px] bg-white/30" />
        <p className="text-white/40 text-sm font-light tracking-widest uppercase">
          Architecture & Interior Design
        </p>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 left-16 flex items-center gap-4"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-[1px] h-14 bg-white/30"
        />
        <span className="text-white/20 text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>

      {/* corner decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        className="absolute bottom-12 right-16 w-16 h-16 border border-white/10 rounded-full"
      />

    </section>
  );
}