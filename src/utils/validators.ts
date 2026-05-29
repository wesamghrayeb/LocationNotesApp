const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required.';
  }
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required.';
  }
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters and include letters and numbers.';
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
};

export const validateRequiredTitle = (title: string): string | null => {
  if (!title.trim()) {
    return 'Title cannot be empty.';
  }
  return null;
};
