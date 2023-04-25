import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import mixpanel from "mixpanel-browser";

export const metadata = {
  title: "FlashcardX - Making studying more efficient and engaging.",
  description:
    "The future of studying is here with FlashcardX use AI to help you create study material so you can ace your next test!",
  twitter: {
    card: "summary_large_image",
    title: "FlashcardX - Making studying more efficient and engaging.",
    description:
      "Say goodbye to Quizzlet ! The future of studying is here with FlashcardX use AI to help you create study material so you can ace your next test!",
    creator: "@talbertherndon",
  },
  metadataBase: new URL("https://ai.flashcardX.com"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          {/* @ts-expect-error Server Component */}
          <Nav />
        </Suspense>
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">

          {children}


        </main>
        <Footer />
      </body>
    </html>
  );
}
