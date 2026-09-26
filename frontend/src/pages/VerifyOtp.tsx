import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtp, useRequestPasswordReset } from "@/hooks/useAuth";
import { ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

const schema = z.object({
  token: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});
type FormData = z.infer<typeof schema>;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const type = (params.get("type") as "recovery" | "signup") ?? "recovery";

  const verifyOtp = useVerifyOtp();
  const resetPassword = useRequestPasswordReset();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    verifyOtp.mutate(
      { email, token: data.token },
      {
        onSuccess: () => {
          if (type === "recovery") {
            navigate("/update-password");
          } else {
            navigate("/dashboard");
          }
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (email) {
      resetPassword.mutate({ email });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] font-['Inter'] text-[#252525] selection:bg-[#B7A58A] selection:text-white p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-[#EAE6DE]/50 border-2 border-[#EAE6DE] p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#292B2A] to-[#A66A4C]" />
        
        <div className="mb-8 flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 bg-[#F5F2EC] rounded-2xl flex items-center justify-center border-2 border-[#EAE6DE]">
            <ShieldCheck className="h-8 w-8 text-[#A66A4C]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-['Outfit'] text-[28px] font-bold tracking-tight text-[#292B2A]">
              Enter OTP
            </h1>
            <p className="text-[#73716C] text-[15px] leading-relaxed">
              {type === "recovery"
                ? "Enter the 6-digit code we sent to"
                : "Confirm your email with the 6-digit code sent to"}{" "}
              <br />
              <span className="font-semibold text-[#292B2A]">{email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              className="h-14 rounded-xl border-[#EAE6DE] bg-[#F5F2EC]/50 focus-visible:ring-[#A66A4C] focus-visible:ring-offset-0 focus-visible:border-[#A66A4C] transition-all text-center text-2xl tracking-[0.5em] font-mono placeholder:text-[#73716C]/40 placeholder:tracking-normal font-semibold text-[#292B2A]"
              {...register("token")}
            />
            {errors.token && (
              <p className="text-[13px] font-medium text-red-500 mt-1 text-center">{errors.token.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#292B2A] hover:bg-[#292B2A]/90 text-white font-medium text-[15px] transition-all shadow-md shadow-[#292B2A]/20"
            disabled={verifyOtp.isPending}
          >
            {verifyOtp.isPending ? "Verifying…" : "Verify code"}
          </Button>

          {verifyOtp.isError && (
            <p className="text-[13px] font-medium text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-100">
              {(verifyOtp.error as Error)?.message ||
                "Invalid or expired OTP. Please try again."}
            </p>
          )}

          <div className="pt-6 border-t border-[#EAE6DE] flex flex-col items-center gap-3">
            {type === "recovery" ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resetPassword.isPending}
                className="text-[#73716C] hover:text-[#A66A4C] text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={14} className={resetPassword.isPending ? "animate-spin" : ""} />
                {resetPassword.isPending ? "Sending..." : "Resend OTP"}
              </button>
            ) : null}
            
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
