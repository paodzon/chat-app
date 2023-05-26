import './globals.css'
import { Inter } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chat App',
  description: 'This is a realtime messaging application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthContext>
        <body className={inter.className}>{children}</body>
        <ToastContainer/>
      </AuthContext>
    </html>
  )
}
