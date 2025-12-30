"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthProvider";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check admin page
  const isAdminPage = pathname?.startsWith("/admin/");

  return (
    <AuthProvider>
      <>
        {!isAdminPage && <Header />}
        {children}
        {!isAdminPage && <Footer />}
        <ScrollToTop />
        <Toaster
          richColors
          position="bottom-right"
          expand={false}
          closeButton
          duration={3000}
          toastOptions={{
            className: "toast-custom",
            style: {
              background: "rgba(26, 26, 26, 0.95)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            },
          }}
        />
      </>
    </AuthProvider>
  );
}
