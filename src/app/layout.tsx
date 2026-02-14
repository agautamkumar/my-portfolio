import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gautam Kumar Ampolu | AI-First Technical Lead",
  description: "Portfolio of Gautam Kumar Ampolu - AI-First Technical Lead with 7+ years of expertise in MERN Stack and serverless architectures.",
  keywords: ["Gautam Kumar", "AI-First", "Technical Lead", "MERN Stack", "React", "Node.js", "MongoDB", "AWS"],
  authors: [{ name: "Gautam Kumar Ampolu" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Gautam Kumar Ampolu | AI-First Technical Lead",
    description: "AI-First Technical Lead with 7+ years of MERN Stack expertise",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gautam Kumar Ampolu | AI-First Technical Lead",
    description: "AI-First Technical Lead with 7+ years of MERN Stack expertise",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
