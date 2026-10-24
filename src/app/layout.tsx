import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/layout/NavBar";
import { TabBar } from "@/components/layout/TabBar";
import { Footer } from "@/components/layout/Footer";
import { getNavLinks } from "@/components/layout/nav-links";
import { getCurrentUser } from "@/lib/auth/session";
import { getLeaguesForUser } from "@/lib/data/leagues";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAGEMETA",
  description: "Fantasy MMA: draft fighters, call the finish, climb the leaderboard.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const leagues = user ? await getLeaguesForUser(user.id) : [];
  const leagueId = leagues[0]?.id;

  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-positive focus:px-3 focus:py-2 focus:text-positive-ink"
        >
          Skip to content
        </a>
        <NavBar leagueId={leagueId} displayName={user?.displayName} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer links={getNavLinks(leagueId)} />
        <TabBar leagueId={leagueId} />
      </body>
    </html>
  );
}
