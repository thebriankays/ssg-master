import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Wrapper } from '@/components/Wrapper'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { WhatameshBackground } from '@/components/whatamesh'
import { getSiteSettings } from '@/utilities/getSiteSettings'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteSettings = await getSiteSettings()

  // Extract background settings
  const bgSettings = siteSettings?.backgroundGradient
  const bgType = bgSettings?.type || 'whatamesh'

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          
          {bgType === 'whatamesh' && (
            <WhatameshBackground 
              colors={{
                color1: bgSettings?.color1 || '#ff0080',
                color2: bgSettings?.color2 || '#7928ca',
                color3: bgSettings?.color3 || '#ff4e00',
                color4: bgSettings?.color4 || '#ff0080',
              }}
              darkenTop={bgSettings?.darkenTop}
              speed={bgSettings?.speed}
              scale={bgSettings?.scale}
              amplitude={bgSettings?.amplitude}
              rotation={bgSettings?.rotation}
              flowmap={bgSettings?.flowmap}
            />
          )}
          
          <Wrapper>
            <Header />
            {children}
            <Footer />
          </Wrapper>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
