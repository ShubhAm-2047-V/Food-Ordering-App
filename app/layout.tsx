import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { FoodModal } from "@/components/food/FoodModal";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const metadata: Metadata = {
  title: "CRAVO | Your Mood. Your Budget. Your Meal.",
  description: "Next-gen food ordering with intelligent Food Mood discovery, Meals under ₹100 combo optimizer, and AI Food Planner.",
  keywords: ["food ordering", "food mood", "meals under 100", "ai food planner", "cravo", "bengaluru food delivery"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-light text-slate-900 antialiased selection:bg-brand-orange selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <CartDrawer />
          <FoodModal />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
