import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  title: 'Nostress CV AI — Simple, Fast Resume Builder',
  description:
    'Nostress CV AI: Generate clean, ATS-friendly resumes in seconds. Minimal design, maximum clarity. Built for devs, creators, and job hunters who want results, not graphics.',
  keywords: [
    'resume builder',
    'AI resume',
    'CV generator',
    'ATS-friendly resume',
    'nostress ai',
  ],
  authors: [{ name: 'Abdulqudus (Primyst)', url: 'https://aq-portfolio-rose.vercel.app' }],
  metadataBase: new URL('https://nostresscv.vercel.app'),
  openGraph: {
    title: 'Nostress CV AI — Simple, Fast Resume Builder',
    description:
      'Generate clean, ATS-friendly resumes in seconds. Minimal design, maximum clarity.',
    url: 'https://nostresscv.vercel.app',
    siteName: 'Nostress CV AI',
    type: 'website',
    images: [
      {
        url: 'https://nostresscv.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nostress cv AI — clean resume builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nostress CV AI — Simple, Fast Resume Builder',
    description: 'Build clean resumes in seconds. No overdesign, just results.',
    images: ['https://nostresscv.vercel.app/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="GEhIL5p4eL2t-sYJHEb4OFm_nJKqeq-5WOBt-_vHRpc" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        {children}
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
