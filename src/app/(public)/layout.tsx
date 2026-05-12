import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/shared/SmoothScroll';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <div className="flex min-h-dvh flex-col">
        <Header />
        {/* Pages manage their own containers so sections can go full-bleed. */}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
