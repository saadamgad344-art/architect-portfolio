'use client';

import { motion, useScroll } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  name: string;
  bio: string;
  years_experience: string;
  projects_count: string;
  awards_count: string;
  countries_count: string;
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [glowing, setGlowing] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profile').select('*').maybeSingle();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const stats = [
    { number: profile?.years_experience || '—', label: 'Years Experience' },
    { number: profile?.projects_count || '—', label: 'Projects Completed' },
    { number: profile?.awards_count || '—', label: 'Awards Won' },
    { number: profile?.countries_count || '—', label: 'Countries' },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-16 overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ originX: 0 }}
        className="w-full h-[1px] bg-white/10 mb-32"
      />

      <div className="grid grid-cols-2 gap-48 items-center">
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/30 text-xs tracking-widest uppercase"
          >About</motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-4 text-5xl font-thin text-white/90 tracking-tight leading-tight"
          >
            {profile?.name?.split(' ').slice(0, 1).join(' ') || '—'}
            <br />
            <span className="text-white/30">
              {profile?.name?.split(' ').slice(1).join(' ') || ''}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-8 text-white/40 text-base font-light leading-relaxed max-w-md"
          >
            {profile?.bio || ''}
          </motion.p>

          <div className="mt-16 grid grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              >
                <span className="text-4xl font-thin text-white/80">{stat.number}</span>
                <p className="mt-1 text-white/30 text-xs tracking-widest uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center"
          onMouseEnter={() => setGlowing(true)}
          onMouseLeave={() => setGlowing(false)}
        >
          {/* توهج خلفي */}
          <motion.div
            animate={{ opacity: glowing ? 1 : 0, scale: glowing ? 1 : 0.6 }}
            transition={{ duration: 0.6 }}
            className="absolute w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none"
          />

          {/* الدائرة الكبيرة */}
          <motion.div
            animate={{
              rotate: 360,
              borderColor: glowing ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
              boxShadow: glowing ? '0 0 40px 4px rgba(255,255,255,0.06)' : '0 0 0px 0px rgba(255,255,255,0)',
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              borderColor: { duration: 0.5 },
              boxShadow: { duration: 0.5 },
            }}
            className="w-64 h-64 border rounded-full"
          />

          {/* الدائرة الوسط */}
          <motion.div
            animate={{
              rotate: -360,
              scale: glowing ? 1.08 : 1,
              borderColor: glowing ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
            }}
            transition={{
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5 },
              borderColor: { duration: 0.5 },
            }}
            className="absolute w-48 h-48 border rounded-full"
          />

          {/* الدائرة الصغيرة */}
          <motion.div
            animate={{
              rotate: 360,
              scale: glowing ? 1.15 : 1,
              opacity: glowing ? 0.6 : 0.1,
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
            }}
            className="absolute w-32 h-32 border border-white/20 rounded-full"
          />

          {/* نقطة في المنتصف */}
          <motion.div
            animate={{ scale: glowing ? 1 : 0, opacity: glowing ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}