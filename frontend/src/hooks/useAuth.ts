import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// ─── Login ────────────────────────────────────────────────────────────────────
interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Signup ───────────────────────────────────────────────────────────────────
interface SignupPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Reset Password (sends OTP email) ─────────────────────────────────────────
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(
        payload.email,
        {
          // Redirect after clicking the link (used for magic-link fallback)
          redirectTo: `${window.location.origin}/update-password`,
        }
      );
      if (error) throw error;
    },
  });
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
interface VerifyOtpPayload {
  email: string;
  token: string; // 6-digit OTP
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload) => {
      const { data, error } = await supabase.auth.verifyOtp({
        email: payload.email,
        token: payload.token,
        type: "recovery", // 'recovery' for password-reset OTPs
      });
      if (error) throw error;
      return data;
    },
  });
}

// ─── Update Password (after OTP verified, user is in a recovery session) ──────
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (payload: { password: string }) => {
      const { data, error } = await supabase.auth.updateUser({
        password: payload.password,
      });
      if (error) throw error;
      return data;
    },
  });
}
