import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdatePassword } from "@/hooks/useAuth";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof schema>;

/**
 * Update Password page.
 * Reached after the user has verified their OTP for password recovery.
 * Supabase keeps a short-lived recovery session which allows updateUser() to work.
 */
export default function UpdatePassword() {
  const navigate = useNavigate();
  const updatePassword = useUpdatePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    updatePassword.mutate(
      { password: data.password },
      {
        onSuccess: () => {
          navigate("/login");
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
          <div className="text-4xl mb-2">🔑</div>
          <h1 className="text-2xl font-semibold">Set New Password</h1>
          <p className="text-sm text-muted-foreground">
            Choose a strong new password for your account.
          </p>
        </div>

        <div>
          <Input
            type="password"
            placeholder="New password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={updatePassword.isPending}
        >
          {updatePassword.isPending ? "Updating…" : "Update Password"}
        </Button>

        {updatePassword.isError && (
          <p className="text-sm text-red-500 text-center">
            {(updatePassword.error as Error)?.message ||
              "Failed to update password. Please try again."}
          </p>
        )}

        {updatePassword.isSuccess && (
          <p className="text-sm text-green-600 text-center">
            Password updated! Redirecting to login…
          </p>
        )}
      </form>
    </div>
  );
}
