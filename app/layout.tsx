import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { DatabaseProvider } from "@/components/database-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecruiterAI - Modern Recruitment Platform",
  description: "Streamline your hiring process with AI-powered candidate management, assessments, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overscroll-none">
      <body
        className="font-sans antialiased overscroll-none"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DatabaseProvider>
            {children}
          </DatabaseProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
