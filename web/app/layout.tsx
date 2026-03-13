import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sileo";
import "sileo/styles.css";
import "../styles/globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MIRA – Management of IT Resources and Assets",
  description:
    "Enterprise IT hardware asset management dashboard for internal IT departments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased bg-background`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-center" 
              theme="system"
              options={{
                fill: "#000000ff",
                roundness: 12,
                styles: {
                  title: "font-sans font-semibold text-sm text-slate-200 dark:text-slate-200",
                  description: "font-sans text-xs text-slate-400 dark:text-slate-400",
                }
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
