import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "SB 721 & SB 326 Inspection Portal",
  description: "Inspection order management for California EEE compliance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
