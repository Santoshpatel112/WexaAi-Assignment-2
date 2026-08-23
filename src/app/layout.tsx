import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppShell } from "@/components/layout/AppShell";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
  ? (process.env.NEXT_PUBLIC_APP_URL.startsWith("http") ? process.env.NEXT_PUBLIC_APP_URL : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteConfig.name} — AI-Powered Career Intelligence Platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "CareerGraph",
    "Graph Database",
    "Neo4j",
    "Career Intelligence",
    "Skill Gap Analysis",
    "Grok AI",
    "Next.js",
    "Career Path",
    "Skill Matching",
    "OpenCypher",
  ],
  authors: [{ name: "Santosh Patel" }],
  creator: "Santosh Patel",
  publisher: "CareerGraph",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "CareerGraph — AI-Powered Career Intelligence Platform",
    description: "Transform your skills, roles, and opportunities into an interactive graph network powered by Neo4j and Grok AI.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/screenshots/home.png",
        width: 1200,
        height: 630,
        alt: "CareerGraph — Interactive Career Graph Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerGraph — AI-Powered Career Intelligence Platform",
    description: "Transform your skills, roles, and opportunities into an interactive graph network powered by Neo4j and Grok AI.",
    images: ["/screenshots/home.png"],
    creator: "@santoshpatel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-purple-500/30 selection:text-purple-200`}>
        <ClerkProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
