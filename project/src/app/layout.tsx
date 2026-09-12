import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { AppProviders } from '@/components/providers/AppProviders';
import { APP_NAME } from '@/constants';
import { DEFAULT_LOCALE, LOCALE_COOKIE } from '@/i18n';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const kalameh = localFont({
  src: '../../public/font/Kalameh-Regular.ttf',
  variable: '--font-kalameh',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s · ${APP_NAME}`,
  },
  description: 'Spaced-repetition flashcards to master anything faster.',
};

const localeBootstrap = `(function(){try{var m=document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=([^;]*)/);var loc=m?decodeURIComponent(m[1]):'${DEFAULT_LOCALE}';if(loc!=='en'&&loc!=='fa')loc='${DEFAULT_LOCALE}';var root=document.documentElement;root.lang=loc;root.dir=loc==='fa'?'rtl':'ltr';root.dataset.locale=loc;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang={DEFAULT_LOCALE}
      className={`${inter.variable} ${kalameh.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: localeBootstrap }} />
      </head>
      <body className="min-h-full font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
