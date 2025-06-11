import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Fridge Chef',
  description: 'Generate recipes from ingredients you have.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Removed Geist font variables as they are not defined */}
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          <Toaster /> {/* Add Toaster component here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
