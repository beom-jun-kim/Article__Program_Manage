import '@/init';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dir } from 'i18next';
import GlobalStyles from '@/styled/GlobalStyles';
import Theme from '@/styled/Theme';
import Header from '@/components/Header';
import { fallbackLng } from '@/i18n/settings';
import ReactQueryProvider from '@/providers/react-query';
import ToastifyProvider from '@/providers/toastify';

export const metadata: Metadata = {
  title: 'NA Writer'
};

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = cookies();
  const lng = cookieStore.get('lng')?.value || fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)}>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/manage/css/rdg.css" />
      </head>
      <ReactQueryProvider>
        <Theme>
          <GlobalStyles />
          <body>
            <ToastifyProvider>
              <div id="root">
                <Header />
                <div id="main">{children}</div>
              </div>
            </ToastifyProvider>
          </body>
        </Theme>
      </ReactQueryProvider>
    </html>
  );
};

export default RootLayout;
