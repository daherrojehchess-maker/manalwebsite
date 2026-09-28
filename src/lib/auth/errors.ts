/** Map Supabase Auth errors to safe Hebrew messages (no secrets). */
export function authErrorMessage(error: { message?: string; code?: string } | null | undefined): string {
  const code = (error?.code ?? "").toLowerCase();
  const message = (error?.message ?? "").toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "אימייל או סיסמה שגויים.";
  }
  if (code === "user_already_exists" || message.includes("already registered") || message.includes("user already registered")) {
    return "לא ניתן להשלים את הפעולה כרגע. נסו שוב.";
  }
  if (code === "weak_password" || message.includes("password")) {
    if (message.includes("least") || message.includes("weak") || message.includes("short")) {
      return "הסיסמה חלשה מדי. יש לבחור סיסמה באורך 12 תווים לפחות.";
    }
  }
  if (code === "email_address_invalid" || message.includes("invalid email") || message.includes("email address")) {
    return "כתובת אימייל לא תקינה.";
  }
  if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
    return "נשלחו יותר מדי בקשות. נסו שוב בעוד מספר דקות.";
  }
  if (message.includes("email not confirmed")) {
    return "יש לאשר את כתובת האימייל לפני ההתחברות.";
  }
  if (message.includes("session") || code.includes("session")) {
    return "פג תוקף ההתחברות. יש להתחבר מחדש.";
  }

  return "לא ניתן להשלים את הפעולה כרגע. נסו שוב.";
}

export function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/** Israeli mobile: 05xxxxxxxx (9–10 digits starting with 0). */
export function isValidPhone(phone: string) {
  return /^0\d{8,9}$/.test(phone.replace(/\D/g, ""));
}

export const PASSWORD_MIN_LENGTH = 12;

export const PASSWORD_TOO_SHORT = "הסיסמה חייבת להכיל לפחות 12 תווים.";

export const PASSWORD_RESET_ACK = "אם קיים חשבון לכתובת הזו, נשלח אליה קישור לאיפוס הסיסמה.";

/** New passwords only. Existing passwords are not checked on login. */
export function isValidPassword(password: string) {
  return password.length >= PASSWORD_MIN_LENGTH;
}
