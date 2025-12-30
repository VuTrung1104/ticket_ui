"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout, AuthInput, AuthButton, SocialLoginButtons } from "@/components/auth";
import { AUTH_MESSAGES, AUTH_PLACEHOLDERS } from "@/constants/auth";

interface LoginFormData {
  email: string;
  password: string;
}

const INITIAL_FORM_STATE: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData);
      if (success) {
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn quay trở lại!"
      backgroundImage="/assets/images/login.jpg"
    >
      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
        <AuthInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          placeholder={AUTH_PLACEHOLDERS.EMAIL}
          autoComplete="email"
          required
        />

        <div>
          <AuthInput
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange("password")}
            placeholder={AUTH_PLACEHOLDERS.PASSWORD}
            autoComplete="current-password"
            required
          />
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          {isLoading ? AUTH_MESSAGES.LOADING.LOGIN : "Đăng nhập"}
        </AuthButton>
      </form>

      <SocialLoginButtons
        onGoogleClick={loginWithGoogle}
        onFacebookClick={loginWithFacebook}
      />

      <p className="text-center mt-6 text-sm text-gray-300">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-red-400 hover:text-red-300 font-semibold hover:underline transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthLayout>
  );
}
