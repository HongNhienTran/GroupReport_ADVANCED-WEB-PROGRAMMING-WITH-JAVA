import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer'; // Import Footer vào đây

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
    <html lang="vi">
      <body className="antialiased flex flex-col min-h-screen justify-between mb-5">
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
        <Footer /> 
      </body>
    </html>
  );
}