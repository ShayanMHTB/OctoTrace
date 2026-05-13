import type { Metadata } from 'next';
import AboutContent from '@/components/sections/about/AboutContent';

export const metadata: Metadata = {
  title: 'About — OctoTrace',
  description:
    'OctoTrace is privacy-first GitHub analytics with no backend and no database. Learn why we built it and the principles behind it.',
};

export default function AboutPage() {
  return <AboutContent />;
}
