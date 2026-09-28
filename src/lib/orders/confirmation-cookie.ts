export function checkoutConfirmCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/checkout",
    maxAge: 60 * 60 * 24 * 7,
  };
}
