"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, AuthInput, AuthButton, ErrorAlert, SocialLoginButtons } from "@/components/auth";
import { validateRegisterForm } from "@/utils/validation";
import { AUTH_CONSTANTS, AUTH_MESSAGES, AUTH_PLACEHOLDERS } from "@/constants/auth";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

const INITIAL_FORM_STATE: RegisterFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phone: "",
};

export default function RegisterPage() {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(""); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setError(validation.error || AUTH_MESSAGES.ERROR.REGISTER_FAILED);
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone || undefined,
      });

      if (success) {
        router.push("/login");
      }
    } catch {
      setError(AUTH_MESSAGES.ERROR.REGISTER_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản mới để tiếp tục"
      backgroundImage="/assets/images/register.png"
    >
      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange("fullName")}
          placeholder={AUTH_PLACEHOLDERS.FULL_NAME}
          autoComplete="name"
          required
        />

        <AuthInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          placeholder={AUTH_PLACEHOLDERS.EMAIL}
          autoComplete="email"
          required
        />

        <AuthInput
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange("phone")}
          placeholder={AUTH_PLACEHOLDERS.PHONE}
          autoComplete="tel"
          maxLength={AUTH_CONSTANTS.PHONE.LENGTH}
        />

        <AuthInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange("password")}
          placeholder={AUTH_PLACEHOLDERS.PASSWORD_MIN}
          autoComplete="new-password"
          required
        />

        <AuthInput
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange("confirmPassword")}
          placeholder={AUTH_PLACEHOLDERS.CONFIRM_PASSWORD}
          autoComplete="new-password"
          required
        />

        <AuthButton type="submit" isLoading={isLoading}>
          {isLoading ? AUTH_MESSAGES.LOADING.REGISTER : "Đăng ký"}
        </AuthButton>
      </form>

      <SocialLoginButtons
        onGoogleClick={loginWithGoogle}
        onFacebookClick={loginWithFacebook}
      />

      <p className="text-center mt-6 text-sm text-gray-300">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
}
