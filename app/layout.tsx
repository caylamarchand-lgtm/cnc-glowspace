import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CNC GlowSpace – Glow up your profile",
  description:
    "Old-school MySpace vibes, new-school glow. Create your customizable Glow profile with music, themes & your Top 4 Glow Crew.",
  openGraph: {
    title: "CNC GlowSpace – Your Glow Profile",
    description:
      "Build your own GlowSpace: music player, custom layout and Top 4 Glow Crew, all in one link.",
    url: "https://www.cncglowspace.com",
    siteName: "CNC GlowSpace",
    images: [
      {
        url: "/og-glowspace.png", // we can make this image later
        width: 1200,
        height: 630,
        alt: "CNC GlowSpace preview card",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNC GlowSpace – Your Glow Profile",
    description:
      "Glow up your profile with music, themes & Top 4 Glow Crew.",
    images: ["/og-glowspace.png"],
  },
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}