import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restaurant Management Observatory | Live POS & Operations Engine',
  description: 'Enterprise Restaurant POS & Management System built with Golang, Gin, MongoDB, JWT & Next.js',
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
      <body className="min-h-screen bg-[#f1f5f9] text-[#0f172a] flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
