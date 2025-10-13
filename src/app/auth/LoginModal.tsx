"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { useResetForm } from "../hooks/useResetForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; 


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, loginWithFacebook, loading, error } = useAuth();
  const router = useRouter();

  // reset form khi modal đóng
  useResetForm(isOpen, () => {
    setEmail("");
    setPassword("");
  });

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const success = await login({ email, password });

  if (success) {
    toast.success("Đăng nhập thành công");
    try {
      await router.push("/");
      setTimeout(onClose, 100);
    } catch (error) {
      console.error("Lỗi chuyển trang:", error);
    }
  } else {
    toast.error("Sai email hoặc mật khẩu");
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl w-full max-w-4xl mx-4 overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>

            <div className="flex min-h-[500px]">
              {/* Bên trái */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="w-full max-w-sm mx-auto bg-transparent rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-8">
                    Đăng nhập
                  </h2>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full flex items-center justify-center gap-3 border-2 border-gray-500 py-3 px-6 rounded-lg text-base text-white/80 bg-transparent placeholder:text-white/60 focus:border-white focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        className="w-full flex items-center justify-center gap-3 border-2 border-gray-500 py-3 px-6 rounded-lg text-base text-white/80 bg-transparent placeholder:text-white/60 focus:border-white focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white"
                      >
                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-white/60 hover:text-red-500 transition-colors"
                      >
                        Quên mật khẩu?
                      </button>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                  </form>

                  <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">hoặc</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {/* Login w Fb/GG */}
                  <div className="space-y-2">
                    <button
                      onClick={loginWithGoogle}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded-md text-sm font-medium text-black/70 hover:bg-gray-200 transition-colors"
                    >
                      <Image
                        src="/assets/icons/google-icon.svg"
                        alt="Google"
                        width={20}
                        height={20}
                      />
                      Đăng nhập bằng Google
                    </button>

                    <button
                      onClick={loginWithFacebook}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white py-2 px-4 rounded-md text-sm font-medium text-black/70 hover:bg-gray-200 transition-colors"
                    >
                      <Image
                        src="/assets/icons/facebook-icon.svg"
                        alt="Facebook"
                        width={20}
                        height={20}
                      />
                      Đăng nhập bằng Facebook
                    </button>
                  </div>
                </div>
              </div>

              {/* Right side - Register Section */}
              <div className="flex-1 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/assets/images/login.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 p-8 flex flex-col justify-end items-end h-full text-white">
                  <button
                    onClick={onSwitchToRegister}
                    className="border-2 border-white py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-gray-900 transition-colors w-fit"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
