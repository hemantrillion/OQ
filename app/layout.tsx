import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OQ',
  description: 'OQ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#090d16] text-[#f1f5f9] flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
