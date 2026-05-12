import type { Metadata } from 'next';
import Hero from '@/components/sections/home/Hero';
import Marquee from '@/components/sections/home/Marquee';
import Features from '@/components/sections/home/Features';
import HowItWorks from '@/components/sections/home/HowItWorks';
import Privacy from '@/components/sections/home/Privacy';
import CTA from '@/components/sections/home/CTA';

export const metadata: Metadata = {
  title: 'OctoTrace — Privacy-first GitHub analytics',
  description:
    'Beautiful, actionable GitHub analytics fetched live in your browser and stored nowhere. Explore your repositories, languages, and commit activity.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Privacy />
      <CTA />
    </>
  );
}
