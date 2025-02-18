import HeaderLink from "@/components/ui/HeaderLink";
import type { Metadata } from "next";
import { Nunito, Roboto_Mono } from "next/font/google";
import "tailwindcss/tailwind.css";
import { CubeTransparentIcon } from "@heroicons/react/24/outline";
import { LEDServerContextProvider } from "@/utils/LEDServerContext";

const nunitoSans = Nunito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drama LED Server",
  description: "A server for controlling LED strips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LEDServerContextProvider>
      <html lang="en">
        <body
          className={`${nunitoSans.variable} ${robotoMono.variable} antialiased`}
        >
          <div className="h-screen flex flex-col">
            <nav className="bg-gray-800 shrink-0 grow-0">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-12 items-center justify-between">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <CubeTransparentIcon className="size-8 text-blue-100" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <HeaderLink href="/">Home</HeaderLink>
                        <HeaderLink href="/config">Config Server</HeaderLink>
                        <HeaderLink href="/arches">Arches</HeaderLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <main className="bg-gray-100 grow">{children}</main>
          </div>
        </body>
      </html>
    </LEDServerContextProvider>
  );
}
