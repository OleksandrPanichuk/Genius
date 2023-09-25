
import { Provider } from '@/components/providers/provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// import { CrispProvider } from '@/components/providers/crisp-provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Genius',
  description: 'AI Platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      {/* <CrispProvider /> */}
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>

  )
}
