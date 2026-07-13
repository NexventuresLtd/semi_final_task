import axiosInstance from "./axiosInstance";

export const authService = {
  verifyInviteCode: (email, code) =>
    axiosInstance.post("/auth/invite/verify", { email, code }),

  signupManual: (payload) =>
    axiosInstance.post("/auth/signup/manual", payload),

  signupGoogle: (googleIdToken, inviteToken) =>
    axiosInstance.post("/auth/signup/google", {
      id_token: googleIdToken,
      invite_token: inviteToken,
    }),

  verifyEmail: (token) =>
    axiosInstance.post("/auth/verify-email", { token }),

  resendVerificationEmail: (email) =>
    axiosInstance.post("/auth/verify-email/resend", { email }),

  login: (email, password) =>
    axiosInstance.post("/auth/login", { email, password }),

  totpEnrollStart: () => axiosInstance.post("/auth/totp/enroll/start"),

  totpEnrollConfirm: (code) =>
    axiosInstance.post("/auth/totp/enroll/confirm", { code }),

  totpVerify: (tempToken, code) =>
    axiosInstance.post("/auth/totp/verify", { temp_token: tempToken, code }),

  forgotPassword: (email) =>
    axiosInstance.post("/auth/password/forgot", { email }),

  resetPassword: (token, newPassword) =>
    axiosInstance.post("/auth/password/reset", { token, new_password: newPassword }),
};