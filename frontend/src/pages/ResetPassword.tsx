import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetPassword = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    resetPassword.mutate(data, {
      onSuccess: () => {
        navigate(
          `/verify-otp?email=${encodeURIComponent(data.email)}&type=recovery`
        );
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] font-['Inter'] text-[#252525] selection:bg-[#B7A58A] selection:text-white p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-[#EAE6DE]/50 border-2 border-[#EAE6DE] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#292B2A] to-[#A66A4C]" />

        <div className="mb-8 space-y-2 text-center">
          <h1 className="font-['Outfit'] text-[28px] font-bold tracking-tight text-[#292B2A]">
            Reset Password
          </h1>
          <p className="text-[#73716C] text-[15px]">
            Enter your email to receive a recovery code.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#292B2A] ml-1">Email Address</label>
            <Input
              placeholder="name@example.com"
              {...register("email")}
              className="h-12 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:ring-offset-0 focus-visible:border-[#A66A4C] transition-all px-4 placeholder:text-[#73716C]/60"
            />
            {errors.email && (
              <p className="text-[13px] font-medium text-red-500 ml-1">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#292B2A] hover:bg-[#292B2A]/90 text-white font-medium text-[15px] transition-all shadow-md shadow-[#292B2A]/20"
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? "Sending code…" : "Send OTP"}
          </Button>

          {resetPassword.isError && (
            <p className="text-[13px] font-medium text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-100">
              {(resetPassword.error as Error)?.message ||
                "Failed to send OTP. Please try again."}
            </p>
          )}

          <div className="pt-4 border-t border-[#EAE6DE] flex justify-center">
            <Link
              to="/login"
              className="text-[#73716C] hover:text-[#292B2A] text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
