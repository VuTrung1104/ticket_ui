import { AUTH_CONSTANTS, AUTH_MESSAGES } from '@/constants/auth';

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || !AUTH_CONSTANTS.EMAIL.PATTERN.test(email)) {
    return {
      isValid: false,
      error: AUTH_MESSAGES.ERROR.EMAIL_INVALID,
    };
  }
  return { isValid: true };
};

/**
 * Validate password length
 */
export const validatePassword = (password: string): ValidationResult => {
  if (password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) {
    return {
      isValid: false,
      error: AUTH_MESSAGES.ERROR.PASSWORD_TOO_SHORT,
    };
  }
  return { isValid: true };
};

/**
 * Validate password confirmation
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: AUTH_MESSAGES.ERROR.PASSWORD_MISMATCH,
    };
  }
  return { isValid: true };
};

/**
 * Validate phone number format
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  if (!AUTH_CONSTANTS.PHONE.PATTERN.test(phone)) {
    return {
      isValid: false,
      error: AUTH_MESSAGES.ERROR.PHONE_INVALID,
    };
  }
  return { isValid: true };
};

/**
 * Validate registration form
 */
export const validateRegisterForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
}): ValidationResult => {
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) return passwordValidation;

  const passwordMatchValidation = validatePasswordMatch(
    data.password,
    data.confirmPassword
  );
  if (!passwordMatchValidation.isValid) return passwordMatchValidation;

  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) return phoneValidation;
  }

  return { isValid: true };
};
