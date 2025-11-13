'use client'

import './globals.css'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        {children}
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
