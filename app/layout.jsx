import './globals.css';

export const metadata = {
  title: 'MiMo v2.6 is learning! (baby dashboard)',
  description:
    'The MiMo v2.6 RL training dashboard, told in baby words - English and Indonesian.',
};

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_LINK} />
      </head>
      <body>{children}</body>
    </html>
  );
}
