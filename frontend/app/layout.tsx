import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: 'Navigator AI',
  description: 'Turn Every Referral into a Scheduled, In-Network Appointment.',
  metadataBase: new URL(baseUrl || 'https://navigator-ai-app.vercel.app'),
  openGraph: {
    title: 'Navigator AI',
    description: 'Turn Every Referral into a Scheduled, In-Network Appointment.',
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('Navigator AI')}&description=${encodeURIComponent(
          'Turn Every Referral into a Scheduled, In-Network Appointment.'
        )}`,
        width: 1200,
        height: 630,
        alt: 'Navigator AI - Turn Every Referral into a Scheduled, In-Network Appointment.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Navigator AI',
    description: 'Turn Every Referral into a Scheduled, In-Network Appointment.',
    images: [
      `/api/og?title=${encodeURIComponent('Navigator AI')}&description=${encodeURIComponent(
        'Turn Every Referral into a Scheduled, In-Network Appointment.'
      )}`
    ]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased tracking-[-0.01em] font-features-on w-full max-w-screen bg-secondary scroll-smooth scroll-pt-24 selection:bg-black selection:text-white`}
      >
        <NuqsAdapter>
          <AuthKitProvider>
            {children}
            <Toaster position="top-right" />
          </AuthKitProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
