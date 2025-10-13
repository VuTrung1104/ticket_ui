"use client";

import { useState } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import LoginModal from "./auth/LoginModal";
import RegisterModal from "./auth/RegisterModal";
import { Toaster } from "sonner";
import { AuthProvider } from "./providers/AuthProvider";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <AuthProvider>
      <>
        <Header
          onLoginOpen={() => {
            if (!isRegisterModalOpen) setIsLoginModalOpen(true);
          }}
        />
        {children}
        <Footer />
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
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </>
    </AuthProvider>
  );
}
