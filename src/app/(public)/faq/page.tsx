import type { Metadata } from 'next';
import FaqContent from '@/components/sections/faq/FaqContent';

export const metadata: Metadata = {
  title: 'FAQ — OctoTrace',
  description:
    'Answers to common questions about OctoTrace: where your data lives, what permissions it needs, and how privacy is enforced by design.',
};

export default function FAQPage() {
  return <FaqContent />;
}
