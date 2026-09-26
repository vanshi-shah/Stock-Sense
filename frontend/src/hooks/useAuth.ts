import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },
    onSuccess: (data: any) => {
      localStorage.setItem("token", data.token);
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },
    onSuccess: (data: any) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post("/auth/reset-password", payload);
      return data;
    },
  });
}
