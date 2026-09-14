import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Caveat } from 'next/font/google'
import './globals.css'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-script',
})

export const metadata: Metadata = {
  title: 'Kya Scene? — Know what’s happening, without the scroll',
  description:
    'Cut through campus noise. Kya Scene? summarizes deadlines, announcements, and schedule changes so first-year students never miss what matters.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={caveat.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=document.documentElement;var t=localStorage.getItem('cc-theme');var theme=(t==='light'||t==='dark'||t==='cream')?t:'dark';e.classList.remove('light','dark','cream');e.classList.add(theme)}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
