import './globals.css';
import { AdminProvider } from '../context/AdminContext';
import AuthGuard from '../components/AuthGuard';

export const metadata = {
  title: 'Daily Brief - Admin Services & Control Portal',
  description: 'Backend & Role Management Portal for Daily Brief News Website',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('db_admin_theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AdminProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AdminProvider>
      </body>
    </html>
  );
}
