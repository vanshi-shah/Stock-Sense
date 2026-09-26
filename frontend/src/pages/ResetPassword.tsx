import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetPassword = useRequestPasswordReset();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    resetPassword.mutate(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
      },
    });
  };

  // After successful submission, show confirmation and allow navigation to OTP page
  if (submittedEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-4 p-6 bg-card rounded-lg shadow-md border text-center">
          <div className="text-4xl mb-2">📧</div>
          <h1 className="text-2xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit OTP to{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>
            . Enter it on the next page to reset your password.
          </p>
          <Button
            className="w-full"
            onClick={() =>
              navigate(
                `/verify-otp?email=${encodeURIComponent(submittedEmail)}&type=recovery`
              )
            }
          >
            Enter OTP
          </Button>
          <div className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 p-6 bg-card rounded-lg shadow-md border"
      >
        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Enter your email and we'll send you a one-time code to reset your
          password.
        </p>

        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending ? "Sending…" : "Send OTP"}
        </Button>

        {resetPassword.isError && (
          <p className="text-sm text-red-500 text-center">
            {(resetPassword.error as Error)?.message ||
              "Failed to send OTP. Please try again."}
          </p>
        )}

        <div className="text-center text-sm text-muted-foreground mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
