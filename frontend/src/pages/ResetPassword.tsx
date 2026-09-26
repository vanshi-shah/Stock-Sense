import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useAuth";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
});
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
  const resetPassword = useResetPassword();
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    resetPassword.mutate(data, { onSuccess: () => setIsSuccess(true) });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4 p-6 bg-card rounded-lg shadow-md border">
        <h1 className="text-2xl font-semibold text-center mb-6">Reset Password</h1>
        
        {isSuccess ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600 text-center">
              Password reset link sent! Check your email.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Back to Sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <div>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
            {resetPassword.isError && <p className="text-sm text-red-500">Failed to send reset link.</p>}
            <div className="text-center text-sm text-muted-foreground mt-4">
              Remember your password? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
