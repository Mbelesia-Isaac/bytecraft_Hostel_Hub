import './globals.css';

export const metadata = {
  title: 'Hostel Platform',
  description: 'Find verified hostels and rentals near your campus',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
