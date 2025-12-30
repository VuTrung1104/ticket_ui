import Image from 'next/image';
import { AuthButton } from './AuthButton';

interface SocialLoginButtonsProps {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
}

export function SocialLoginButtons({ onGoogleClick, onFacebookClick }: SocialLoginButtonsProps) {
  return (
    <>
      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-gray-400">hoặc</span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="space-y-3">
        <AuthButton
          type="button"
          variant="social"
          onClick={onGoogleClick}
          icon={
            <Image
              src="/assets/icons/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          }
        >
          Đăng nhập với Google
        </AuthButton>
        
        <AuthButton
          type="button"
          variant="social"
          onClick={onFacebookClick}
          icon={
            <Image
              src="/assets/icons/facebook-icon.svg"
              alt="Facebook"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          }
        >
          Đăng nhập với Facebook
        </AuthButton>
      </div>
    </>
  );
}
