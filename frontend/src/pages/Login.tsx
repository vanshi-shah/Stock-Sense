import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    login.mutate(data, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 p-6 bg-card rounded-lg shadow-md border"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">Sign in</h1>

        <div>
          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>

        {login.isError && (
          <p className="text-sm text-red-500 text-center">
            {(login.error as Error)?.message || "Invalid credentials"}
          </p>
        )}

        <div className="flex flex-col space-y-2 text-center text-sm text-muted-foreground mt-4">
          <Link to="/reset-password" className="hover:underline">
            Forgot password?
          </Link>
          <div>
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
