import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css'
import ConvexClientProvider from "@/app/ConvexClientProvider";
import {Header} from "@/app/header";
import { Toaster } from "@/components/ui/toaster"
import {RedirectToSignIn, SignedOut} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "heart.io",
  description: "Make heart disease predictions today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className={'w-screen h-auto bg-gradient-to-b from-blue-50 to-red-100'}>
          <ConvexClientProvider>
            <Header/>
            <div className={'min-h-[calc(100vh-3rem)]'}>
              {children}
              <Toaster/>
            </div>
            <SignedOut>
              <RedirectToSignIn redirectUrl={'/'} />
            </SignedOut>
          </ConvexClientProvider>
        </div>
      </body>
    </html>
  );
}
