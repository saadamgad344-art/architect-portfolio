'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profile = {
  name: string;
  bio: string;
  avatar_url: string;
  years_experience: string;
  projects_count: string;
  awards_count: string;
  countries_count: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  behance: string;
};

// أيقونات SVG
const Icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  behance: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.69.767-.64.166-1.31.254-2.01.254H0V4.51h6.938v-.007zM16.94 16.665c.44.428 1.073.643 1.894.643.59 0 1.1-.148 1.53-.447.428-.29.7-.61.807-.947h2.95c-.47 1.475-1.19 2.527-2.17 3.153-1 .627-2.16.94-3.5.94-.951 0-1.81-.152-2.57-.455-.76-.305-1.408-.73-1.943-1.278-.535-.55-.95-1.2-1.24-1.956-.29-.755-.44-1.58-.44-2.473 0-.864.153-1.67.457-2.42.305-.75.735-1.4 1.29-1.943.556-.545 1.21-.97 1.97-1.273.76-.302 1.597-.454 2.51-.454 1.02 0 1.92.19 2.67.566.75.38 1.36.9 1.84 1.56.48.66.82 1.43 1.03 2.3.21.87.3 1.79.27 2.75h-8.803c0 1.016.34 1.99.777 2.418zM15.516 11.3c-.352-.385-.88-.578-1.584-.578-.46 0-.847.08-1.163.24-.315.16-.57.36-.76.6-.19.24-.324.5-.403.78-.08.28-.124.55-.135.81h4.728c-.07-.75-.33-1.468-.683-1.852zM9.701 10.07c-.388-.29-.956-.43-1.7-.43H3.16v3.248h4.935c.742 0 1.308-.17 1.697-.507.39-.337.584-.84.584-1.51 0-.7-.225-1.21-.675-1.8zm-.334 5.39c-.47-.33-1.1-.494-1.893-.494H3.16v3.67h4.312c.348 0 .67-.035.96-.107.29-.073.54-.19.75-.354.21-.165.375-.38.495-.645.12-.265.18-.59.18-.97 0-.73-.23-1.27-.69-1.6z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
};

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from('profile').select('*').maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, []);

  const copyEmail = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { number: profile?.years_experience || '—', label: 'Years Experience' },
    { number: profile?.projects_count || '—', label: 'Projects' },
    { number: profile?.awards_count || '—', label: 'Awards' },
    { number: profile?.countries_count || '—', label: 'Countries' },
  ];

  const socials = [
    { label: 'Instagram', icon: Icons.instagram, href: profile?.instagram },
    { label: 'Facebook', icon: Icons.facebook, href: profile?.facebook },
    { label: 'LinkedIn', icon: Icons.linkedin, href: profile?.linkedin },
    { label: 'Behance', icon: Icons.behance, href: profile?.behance },
  ].filter(s => s.href);

  return (
    <section ref={sectionRef} id="about" className="relative py-16 md:py-32 px-6 md:px-16 overflow-hidden">

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ originX: 0 }}
        className="w-full h-[1px] bg-white/10 mb-16 md:mb-32"
      />

      {/* ═══ DESKTOP: جنب بجنب ═══ */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-24 items-start">

        {/* Left */}
        <div className="flex flex-col gap-16">
          <div>
            <span className="text-white/30 text-xs tracking-widest uppercase">About</span>
            <h2 className="mt-4 text-5xl font-thin text-white/90 tracking-tight leading-tight">
              {profile?.name?.split(' ').slice(0, 1).join(' ') || '—'}
              <br />
              <span className="text-white/30">{profile?.name?.split(' ').slice(1).join(' ') || ''}</span>
            </h2>
            <p className="mt-8 text-white/40 text-base font-light leading-relaxed">{profile?.bio || ''}</p>
            <div className="mt-12 grid grid-cols-2 gap-8">
              {stats.map((stat, i) => (
                <div key={stat.label} className="border-l border-white/10 pl-4">
                  <span className="text-4xl font-thin text-white/80">{stat.number}</span>
                  <p className="mt-1 text-white/30 text-xs tracking-widest uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/10" />

          {/* Contact Desktop */}
          <div>
            <span className="text-white/30 text-xs tracking-widest uppercase">Contact</span>
            <h3 className="mt-4 text-4xl font-thin text-white/90 tracking-tight leading-tight">
              Let's build<br /><span className="text-white/30">something.</span>
            </h3>
            <div className="mt-10 flex flex-col gap-3">
              {profile?.email && (
                <button onClick={copyEmail} className="group w-full text-left border border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/6 transition-all duration-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/40">{Icons.email}</span>
                    <span className="text-white/30 text-xs tracking-widest uppercase">Email</span>
                  </div>
                  <span className="text-white/70 text-base font-light group-hover:text-white transition-colors break-all">{profile.email}</span>
                  <span className="text-white/20 text-xs tracking-widest uppercase block mt-3 group-hover:text-white/50 transition-colors">{copied ? '✓ Copied!' : 'Click to copy'}</span>
                </button>
              )}
              {profile?.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} target="_blank" className="group w-full border border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/6 transition-all duration-300 p-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-white/40">{Icons.whatsapp}</span>
                      <span className="text-white/30 text-xs tracking-widest uppercase">WhatsApp</span>
                    </div>
                    <span className="text-white/70 text-base font-light group-hover:text-white transition-colors">{profile.whatsapp}</span>
                  </div>
                  <span className="text-white/30 text-xl group-hover:text-white/70 group-hover:translate-x-1 group-hover:-translate-y-1 inline-block transition-all duration-300">↗</span>
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank"
                    className="group border border-white/10 hover:border-white/30 bg-white/3 hover:bg-white/8 transition-all duration-300 p-4 flex flex-col items-center justify-center gap-2"
                    title={s.label}
                  >
                    <span className="text-white/40 group-hover:text-white transition-colors">{s.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <span className="text-white/20 text-xs tracking-widest uppercase">© 2026 {profile?.name || ''}</span>
            <span className="text-white/20 text-xs tracking-widest uppercase">Architecture & Interior Design</span>
          </div>
        </div>

        {/* Right - Photo Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative sticky top-24"
        >
          {profile?.avatar_url ? (
            <div className="relative overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <motion.img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" whileHover={{ scale: 1.03 }} transition={{ duration: 0.6 }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white/30 text-xs tracking-widest uppercase">Architect</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-white/10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border border-white/5" />
            </div>
          ) : (
            <div className="aspect-[3/4] bg-white/5 flex items-center justify-center border border-white/10">
              <p className="text-white/20 text-xs tracking-widest uppercase">No Photo</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ═══ MOBILE: فوق بعض ═══ */}
      <div className="flex flex-col gap-10 md:hidden">

        {/* الاسم */}
        <div>
          <span className="text-white/30 text-xs tracking-widest uppercase">About</span>
          <h2 className="mt-3 text-4xl font-thin text-white/90 tracking-tight leading-tight">
            {profile?.name?.split(' ').slice(0, 1).join(' ') || '—'}
            <br />
            <span className="text-white/30">{profile?.name?.split(' ').slice(1).join(' ') || ''}</span>
          </h2>
        </div>

        {/* الصورة + Contact جنب بعض على الموبايل */}
        <div className="grid grid-cols-2 gap-4 items-start">

          {/* الصورة */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            {profile?.avatar_url ? (
              <>
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white/30 text-xs tracking-widest uppercase">Architect</p>
                </div>
              </>
            ) : (
              <div className="aspect-[3/4] bg-white/5 border border-white/10" />
            )}
          </motion.div>

          {/* Contact على الموبايل - جنب الصورة */}
          <div className="flex flex-col gap-3">
            <span className="text-white/30 text-xs tracking-widest uppercase">Contact</span>

            {/* Email */}
            {profile?.email && (
              <button onClick={copyEmail} className="group w-full text-left border border-white/10 active:border-white/25 bg-white/3 transition-all duration-300 p-3">
                <span className="text-white/40 block mb-2">{Icons.email}</span>
                <span className="text-white/20 text-xs tracking-widest uppercase block mb-1">Email</span>
                <span className="text-white/20 text-xs">{copied ? '✓ Copied!' : 'Tap to copy'}</span>
              </button>
            )}

            {/* WhatsApp */}
            {profile?.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} target="_blank"
                className="group w-full border border-white/10 bg-white/3 transition-all duration-300 p-3 flex flex-col gap-2"
              >
                <span className="text-white/40">{Icons.whatsapp}</span>
                <span className="text-white/20 text-xs tracking-widest uppercase">WhatsApp</span>
              </a>
            )}

            {/* Social Icons */}
            {socials.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank"
                    className="border border-white/10 bg-white/3 p-3 flex items-center justify-center"
                    title={s.label}
                  >
                    <span className="text-white/50">{s.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-white/40 text-sm font-light leading-relaxed">{profile?.bio || ''}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-white/10 pl-4">
              <span className="text-3xl font-thin text-white/80">{stat.number}</span>
              <p className="mt-1 text-white/30 text-xs tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer Mobile */}
        <div className="flex flex-col gap-1 pt-6 border-t border-white/5">
          <span className="text-white/20 text-xs tracking-widest uppercase">© 2026 {profile?.name || ''}</span>
          <span className="text-white/20 text-xs tracking-widest uppercase">Architecture & Interior Design</span>
        </div>
      </div>

    </section>
  );
}