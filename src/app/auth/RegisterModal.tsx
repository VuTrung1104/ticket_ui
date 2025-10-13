"use client";

import { useState, useCallback } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useResetForm } from "../hooks/useResetForm";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const resetForm = useCallback(() => {
  setFormData({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  setAgree(false);
  setErrors({});
}, []);

useResetForm(isOpen, resetForm);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ.";
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên.";
    if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ.";
    if (formData.password.length < 6)
      newErrors.password = "Mật khẩu ít nhất 6 ký tự.";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp.";
    if (!agree) newErrors.agree = "Bạn phải đồng ý với điều khoản.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  const inputClass =
    "w-full border-2 py-3 px-6 rounded-lg text-base bg-transparent focus:outline-none transition-colors";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl w-full max-w-4xl mx-4 overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col md:flex-row min-h-[500px] max-h-[90vh]">
              {/* Bên trái */}
              <div className="flex-1 relative min-h-[250px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/assets/images/register.png')",
                  }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 p-8 flex flex-col justify-end items-start h-full">
                  <button
                    onClick={() => {
                      onClose();
                      onSwitchToLogin();
                    }}
                    className="border-2 border-white text-white py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-gray-900 transition-colors"
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>

              {/* Bên phải */}
              <div className="flex-1 p-8 flex items-center justify-center overflow-y-auto">
                <div className="w-full max-w-sm my-auto">
                  <h2 className="text-2xl font-bold text-white mb-8">
                    Đăng ký
                  </h2>

                  <form onSubmit={handleRegister} className="space-y-3">
                    {/* Họ */}
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Họ"
                        className={`${inputClass} ${
                          errors.lastName
                            ? "border-red-500 text-red-500 placeholder-red-400"
                            : "border-gray-500 text-white/80 placeholder:text-white/60 focus:border-white"
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Tên */}
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Tên"
                        className={`${inputClass} ${
                          errors.firstName
                            ? "border-red-500 text-red-500 placeholder-red-400"
                            : "border-gray-500 text-white/80 placeholder:text-white/60 focus:border-white"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className={`${inputClass} ${
                          errors.email
                            ? "border-red-500 text-red-500 placeholder-red-400"
                            : "border-gray-500 text-white/80 placeholder:text-white/60 focus:border-white"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mật khẩu */}
                    <div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mật khẩu"
                          className={`${inputClass} ${
                            errors.password
                              ? "border-red-500 text-red-500 placeholder-red-400"
                              : "border-gray-500 text-white/80 placeholder:text-white/60 focus:border-white"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white"
                        >
                          {showPassword ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Nhập lại mật khẩu"
                          className={`${inputClass} ${
                            errors.confirmPassword
                              ? "border-red-500 text-red-500 placeholder-red-400"
                              : "border-gray-500 text-white/80 placeholder:text-white/60 focus:border-white"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white"
                        >
                          {showConfirmPassword ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="agree"
                        className="text-sm text-white/80 cursor-pointer"
                      >
                        Tôi đồng ý với{" "}
                        <span className="text-red-400 hover:underline cursor-pointer">
                          Điều khoản sử dụng & Chính sách bảo mật
                        </span>
                      </label>
                    </div>
                    {errors.agree && (
                      <p className="text-red-500 text-sm">{errors.agree}</p>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-red-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
                    >
                      {loading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
