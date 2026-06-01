'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type MediaItem = {
  file: File;
  preview: string;
  type: 'image' | 'video';
};

export default function NewProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    year: new Date().getFullYear(),
    featured: false,
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

useEffect(() => {
  supabase.from('categories').select('*').order('created_at').then(({ data }) => {
    setCategories(data || []);
  });
}, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: MediaItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
    }));
    setMediaItems(prev => [...prev, ...newItems]);
  };

  const removeMedia = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('projects').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // رفع الـ Cover
      let coverUrl = '';
      if (coverImage) coverUrl = await uploadFile(coverImage);

      // رفع الـ Media
      const uploadedMedia = await Promise.all(
        mediaItems.map(async (item) => ({
          url: await uploadFile(item.file),
          type: item.type,
        }))
      );

      const { error } = await supabase.from('projects').insert({
        ...form,
        year: Number(form.year),
        cover_image: coverUrl,
        media: uploadedMedia,
      });

      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error saving project');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white/80">
      <div className="flex justify-between items-center px-12 py-6 border-b border-white/10">
        <h1 className="text-sm tracking-widest uppercase">New Project</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      
<form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-12 py-10 flex flex-col gap-8">

        {/* Cover Image */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Cover Image</label>
          {coverPreview && (
            <div className="relative">
              <img src={coverPreview} alt="cover" className="w-full h-48 object-cover opacity-80" />
              <button
                type="button"
                onClick={() => { setCoverImage(null); setCoverPreview(''); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white/60 hover:text-white flex items-center justify-center text-xs"
              >✕</button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImage}
            className="text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white/60 file:text-xs file:tracking-widest file:uppercase hover:file:bg-white/5"
          />
        </div>

        
       
     

        {/* Media — صور + فيديوهات */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">
            Media — Images & Videos
          </label>

          {/* Preview Grid */}
          {mediaItems.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {mediaItems.map((item, i) => (
                <div key={i} className="relative aspect-video bg-white/5">
                  {item.type === 'video' ? (
                    <video
                      src={item.preview}
                      className="w-full h-full object-cover opacity-70"
                      muted
                    />
                  ) : (
                    <img
                      src={item.preview}
                      alt=""
                      className="w-full h-full object-cover opacity-70"
                    />
                  )}
                  {/* Type Badge */}
                  <span className="absolute bottom-2 left-2 text-[10px] tracking-widest uppercase text-white/50">
                    {item.type}
                  </span>
                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white/60 hover:text-white flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaFiles}
            className="text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white/60 file:text-xs file:tracking-widest file:uppercase hover:file:bg-white/5"
          />
          <p className="text-white/20 text-xs">تقدر تختار أكتر من ملف في نفس الوقت</p>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors resize-none"
          />
        </div>

        {/* Category & Location */}
      {/* Category & Location */}
<div className="grid grid-cols-2 gap-8">
  <div className="flex flex-col gap-3">
    <label className="text-xs tracking-widest uppercase text-white/40">Category</label>
    <select
      name="category"
      value={form.category}
      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
      className="bg-[#080808] border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors cursor-pointer"
    >
      <option value="">— Select —</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.name}>{cat.name}</option>
      ))}
    </select>
  </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs tracking-widest uppercase text-white/40">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
            />
          </div>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Year</label>
          <input
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="featured" className="text-xs tracking-widest uppercase text-white/40">
            Featured Project
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border border-white/20 text-white/80 py-4 tracking-widest uppercase text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Save Project'}
        </button>
      </form>
    </div>
  );
}