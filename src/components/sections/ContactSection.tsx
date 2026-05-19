'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  name: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  behance: string;
};

export default function ContactSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profile').select('*').single();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const copyEmail = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: 'Instagram', href: profile?.instagram },
    { label: 'Facebook', href: profile?.facebook },
    { label: 'LinkedIn', href: profile?.linkedin },
    { label: 'Behance', href: profile?.behance },
  ].filter(s => s.href);

  return (
    <section id="contact" className="relative py-32 px-16">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ originX: 0 }}
        className="w-full h-[1px] bg-white/10 mb-32"
      />

      <div className="grid grid-cols-2 gap-24 items-end">
        <div>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/30 text-xs tracking-widest uppercase"
          >Contact</motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mt-4 text-5xl font-thin text-white/90 tracking-tight leading-tight"
          >
            Let's build<br />
            <span className="text-white/30">something.</span>
          </motion.h2>

          {/* Email */}
          {profile?.email && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              onClick={copyEmail}
              className="mt-12 flex items-center gap-4 group"
            >
              <span className="text-white/60 text-lg font-light tracking-wide group-hover:text-white/90 transition-colors">
                {profile.email}
              </span>
              <span className="text-white/20 text-xs tracking-widest uppercase group-hover:text-white/60 transition-colors">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </motion.button>
          )}

          {/* WhatsApp */}
          {profile?.whatsapp && (
            <motion.a
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center gap-4 group"
            >
              <span className="text-white/40 text-sm font-light tracking-wide group-hover:text-white/80 transition-colors">
                WhatsApp ↗
              </span>
            </motion.a>
          )}
        </div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col gap-6 items-end"
        >
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-white/30 text-sm tracking-widest uppercase hover:text-white/80 transition-colors"
            >
              {s.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-32 flex items-center justify-between"
      >
        <span className="text-white/20 text-xs tracking-widest uppercase">
          © 2026 {profile?.name || 'Abdullah Al-Saeed'}
        </span>
        <span className="text-white/20 text-xs tracking-widest uppercase">
          Architecture & Interior Design
        </span>
      </motion.div>
    </section>
  );
}