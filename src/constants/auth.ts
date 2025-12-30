// Authentication constants
export const AUTH_CONSTANTS = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 50,
  },
  PHONE: {
    LENGTH: 10,
    PATTERN: /^[0-9]{10}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// Validation error messages
export const AUTH_MESSAGES = {
  ERROR: {
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp!',
    PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} ký tự!`,
    PHONE_INVALID: `Số điện thoại không hợp lệ (phải có ${AUTH_CONSTANTS.PHONE.LENGTH} chữ số)!`,
    EMAIL_INVALID: 'Email không hợp lệ!',
    LOGIN_FAILED: 'Sai email hoặc mật khẩu!',
    REGISTER_FAILED: 'Đăng ký thất bại. Vui lòng thử lại!',
    CONNECTION_ERROR: 'Lỗi kết nối server!',
  },
  SUCCESS: {
    LOGIN: 'Đăng nhập thành công!',
    REGISTER: 'Đăng ký thành công! Vui lòng đăng nhập.',
    LOGOUT: 'Đã đăng xuất',
  },
  LOADING: {
    LOGIN: 'Đang đăng nhập...',
    REGISTER: 'Đang đăng ký...',
  },
} as const;

// Form placeholders
export const AUTH_PLACEHOLDERS = {
  EMAIL: 'Email',
  PASSWORD: 'Mật khẩu',
  CONFIRM_PASSWORD: 'Nhập lại mật khẩu',
  FULL_NAME: 'Họ và tên',
  PHONE: 'Số điện thoại (tùy chọn)',
  PASSWORD_MIN: `Mật khẩu (tối thiểu ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} ký tự)`,
} as const;
