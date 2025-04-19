import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MinIO Image Manager',
  description: 'Upload and manage images with MinIO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <main className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">MinIO Image Manager</h1>
              <p className="text-gray-600">Upload and manage your images</p>
            </header>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}