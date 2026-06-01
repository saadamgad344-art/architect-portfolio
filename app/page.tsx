import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import AboutSection from '@/components/sections/AboutSection';


export default function Home() {
  return (
    <main className="bg-[#080808] min-h-screen">
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <AboutSection />
      
    </main>
  );
}