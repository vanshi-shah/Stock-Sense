import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function Signup() {
  const navigate = useNavigate();
  const signup = useSignup();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    signup.mutate(data, { onSuccess: () => navigate("/dashboard") });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC] font-['Inter'] selection:bg-[#B7A58A] selection:text-white p-4 md:p-8">
      
      <div className="flex w-full max-w-[1200px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgb(41,43,42,0.1)] border-[4px] border-[#292B2A] min-h-[700px] flex-col-reverse md:flex-row">
        
        {/* Left Image Section */}
        <div className="hidden md:block md:w-[45%] relative bg-[#292B2A]">
          <img 
            src="/login-hero.jpg" 
            alt="StockSense Inventory" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-x-[-1]"
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-tl from-[#292B2A]/40 to-transparent pointer-events-none" />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-16 flex flex-col bg-white relative">
          
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#292B2A] shadow-md shadow-[#292B2A]/20">
              <span className="font-['Outfit'] text-xl font-bold text-[#F5F2EC]">S</span>
            </div>
            <span className="font-['Outfit'] text-2xl font-bold text-[#292B2A] tracking-tight">StockSense</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full md:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-[#292B2A] font-['Outfit'] mb-2">Create Account</h1>
            <p className="text-[#73716C] mb-8 text-[15px]">Join us to streamline your inventory management.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-[22px]">
              
              <div className="space-y-1">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-medium text-[#73716C] z-10">Email Address</label>
                  <Input 
                    placeholder="name@company.com" 
                    className="h-14 px-4 bg-transparent border-[#B7A58A] text-[#252525] placeholder:text-[#73716C]/40 rounded-xl focus-visible:ring-1 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] transition-all"
                    {...register("email")} 
                  />
                </div>
                {errors.email && <p className="text-[12px] text-[#A66A4C] ml-1 mt-1 font-medium">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-medium text-[#73716C] z-10">Password</label>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="h-14 px-4 bg-transparent border-[#B7A58A] text-[#252525] placeholder:text-[#73716C]/40 rounded-xl focus-visible:ring-1 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] transition-all pr-12"
                    {...register("password")} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B7A58A] hover:text-[#A66A4C] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                  </button>
                </div>
                {errors.password && <p className="text-[12px] text-[#A66A4C] ml-1 mt-1 font-medium">{errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] font-medium text-[#73716C] z-10">Confirm Password</label>
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="h-14 px-4 bg-transparent border-[#B7A58A] text-[#252525] placeholder:text-[#73716C]/40 rounded-xl focus-visible:ring-1 focus-visible:ring-[#A66A4C] focus-visible:border-[#A66A4C] transition-all pr-12"
                    {...register("confirmPassword")} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B7A58A] hover:text-[#A66A4C] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[12px] text-[#A66A4C] ml-1 mt-1 font-medium">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group w-max">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 rounded border-2 border-[#B7A58A] checked:bg-[#A66A4C] checked:border-[#A66A4C] hover:border-[#A66A4C] transition-colors cursor-pointer"
                      {...register("terms")}
                    />
                    <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-medium text-[#73716C]">
                    I agree to the <a href="#" className="text-[#A66A4C] hover:text-[#292B2A] transition-colors">Terms & Conditions</a>
                  </span>
                </label>
                {errors.terms && <p className="text-[12px] text-[#A66A4C] ml-1 mt-1 font-medium">{errors.terms.message}</p>}
              </div>

              {signup.isError && (
                <div className="p-3 rounded-lg bg-red-50 text-center mt-2">
                  <p className="text-[13px] text-red-600 font-medium">Signup failed. Please try again.</p>
                </div>
              )}

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl bg-[#292B2A] text-white hover:bg-[#A66A4C] hover:shadow-lg hover:shadow-[#A66A4C]/20 transition-all font-['Outfit'] text-[16px] font-medium"
                  disabled={signup.isPending || isSubmitting}
                >
                  {signup.isPending || isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 max-w-[420px] mx-auto w-full md:mx-0 text-center md:text-left">
            <p className="text-[#73716C] text-[14px]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#292B2A] font-semibold hover:text-[#A66A4C] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
