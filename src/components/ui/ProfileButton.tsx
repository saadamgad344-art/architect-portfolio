'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ بياناتك الثابتة — غيّر هنا بس
const ME = {
  name: 'Amgad Saad',
  bio: 'I turn ideas into websites that work.',
  email: 'saadamgad344@gmail.com',
  whatsapp: '+21026455778', 
    whatsapp1: '+966577969302',
  instagram: 'https://www.instagram.com/amgad.saad15?igsh=MThmZDluczhlam56Yw%3D%3D',
  facebook: 'https://www.facebook.com/amgad.saad.931180?rdid=Cw9Q2MKRpKKE3d8L&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BPFirKE2X%2F#',
  linkedin: 'www.linkedin.com/in/amgad-saad-a1a2a531a',
  behance: '',
};

export default function ProfileButton() {
  const [open, setOpen] = useState(false);

const socials = [
  { label: 'Instagram', href: ME.instagram || undefined },
  { label: 'Facebook', href: ME.facebook || undefined },
  { label: 'LinkedIn', href: ME.linkedin || undefined },
  { label: 'Behance', href: ME.behance || undefined },
  {
    label: 'WhatsApp 1',
    href: ME.whatsapp
      ? `https://wa.me/${ME.whatsapp.replace(/\D/g, '')}`
      : undefined,
  },
  {
    label: 'WhatsApp 2',
    href: ME.whatsapp1
      ? `https://wa.me/${ME.whatsapp1.replace(/\D/g, '')}`
      : undefined,
  },
].filter((s) => s.href);

  return (
    <>
      {/* الزرار الثابت */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-8 z-[9998] w-12 h-12 rounded-full overflow-hidden border border-white/20 hover:border-white/60 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[99990] bg-black/60 backdrop-blur-sm"
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-24 left-8 z-[99991] w-80 bg-[#0f0f0f] border border-white/10 p-8"
            >
              {/* Logo */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20">
                  <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white/90 font-light text-base">{ME.name}</h3>
                  <p className="text-white/30 text-xs tracking-widest uppercase mt-1">
                    Developer
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/10 mb-6" />

              {/* Bio */}
              <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                {ME.bio}
              </p>

              {/* Email */}
              {ME.email && (
                <a
                  href={`mailto:${ME.email}`}
                  className="text-white/50 text-xs tracking-widest hover:text-white/90 transition-colors block mb-6"
                >
                  {ME.email}
                </a>
              )}

              {/* Socials */}
              {socials.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 text-xs tracking-widest uppercase hover:text-white/80 transition-colors"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              )}

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors text-xs tracking-widest"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}