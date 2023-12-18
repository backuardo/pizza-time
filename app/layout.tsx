import { GeistMono } from 'geist/font/mono';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'PizzaTime',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="retro" className={GeistMono.className}>
      <body className="bg-background text-foreground flex flex-col items-center">
        <main className="min-h-screen flex flex-col items-center w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
