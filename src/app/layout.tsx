import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/shared/ThemeProvider';
import Providers from '@/lib/providers';

// Main UI font
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Add more weights if you need them
  variable: '--font-roboto',
  display: 'swap',
});

// Mono font for code/dev look
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'OctoTrace — Privacy-first GitHub analytics',
    template: '%s',
  },
  description:
    'Beautiful, privacy-first GitHub analytics — fetched live in your browser and stored nowhere.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
