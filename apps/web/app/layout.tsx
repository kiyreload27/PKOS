import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { StatusDock } from "@/components/layout/status-dock";
import { ActivityStream } from "@/components/layout/activity-stream";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PKOS - Personal Knowledge OS",
  description: "Capture first. Organise later. Find instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground h-screen overflow-hidden flex")}>
        <Sidebar />
        <main className="flex-1 relative h-full flex flex-col min-w-0 bg-neutral-950">
          {children}
          <ActivityStream />
          <StatusDock />
        </main>
        <CommandPalette />
      </body>
    </html>
  );
}
