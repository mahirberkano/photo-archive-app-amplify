import { Inter } from 'next/font/google';
import './globals.css';
import '@/utils/aws-config';
import { AmplifyProvider } from '@/components/AmplifyProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Secure Photo Archive',
  description: 'Güvenli fotoğraf arşivleme uygulaması',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}