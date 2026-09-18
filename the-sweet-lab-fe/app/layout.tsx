import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SweetieMascot from '@/components/common/SweetieMascot';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'The Sweet Lab - Healthy Sweets & Chocolates',
  description: 'Clean eating snacks application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={fontSans.variable}>
      <body className="font-sans antialiased flex flex-col min-h-screen justify-between mb-5">
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer /> 
        <SweetieMascot />
      </body>
    </html>
  );
}