import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtp } from "@/hooks/useAuth";

const schema = z.object({
  token: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must be numeric"),
});
type FormData = z.infer<typeof schema>;

/**
 * OTP Verification page.
 *
 * Query params:
 *   email  – the email address the OTP was sent to
 *   type   – "recovery" (password reset) | "signup" (email confirmation)
 */
export default function VerifyOtp() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const type = (params.get("type") as "recovery" | "signup") ?? "recovery";

  const verifyOtp = useVerifyOtp();
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
            // User now has a recovery session — let them set a new password
            navigate("/update-password");
          } else {
            // Email confirmed — send to dashboard
            navigate("/dashboard");
          }
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 p-6 bg-card rounded-lg shadow-md border"
      >
        <div className="text-center space-y-1 mb-4">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-2xl font-semibold">Enter OTP</h1>
          <p className="text-sm text-muted-foreground">
            {type === "recovery"
              ? "Enter the 6-digit code we sent to"
              : "Confirm your email with the 6-digit code sent to"}
          </p>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>

        <div>
          <Input
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="text-center text-2xl tracking-widest font-mono"
            {...register("token")}
          />
          {errors.token && (
            <p className="text-sm text-red-500 mt-1 text-center">
              {errors.token.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
          {verifyOtp.isPending ? "Verifying…" : "Verify OTP"}
        </Button>

        {verifyOtp.isError && (
          <p className="text-sm text-red-500 text-center">
            {(verifyOtp.error as Error)?.message ||
              "Invalid or expired OTP. Please try again."}
          </p>
        )}

        <div className="text-center text-sm text-muted-foreground mt-2">
          {type === "recovery" ? (
            <>
              Didn't receive it?{" "}
              <Link
                to="/reset-password"
                className="text-primary hover:underline"
              >
                Resend OTP
              </Link>
            </>
          ) : (
            <>
              Back to{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
