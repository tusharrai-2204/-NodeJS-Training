import { type loginForm, loginSchema } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { getMe, loginUser } from "@/lib/api/auth";
import axios from "axios";
import authImage from "@/assets/img-auth-2.jpg";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: loginForm) => {
    try {
      await loginUser(data);
      const meResponse = await getMe();
      login({
        id: meResponse.data.id,
        email: meResponse.data.email,
        first_name: meResponse.data.first_name,
        last_name: meResponse.data.last_name,
        role: meResponse.data.role,
      });
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Login failed")
        : "Login failed";
      toast.error(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"}/api/auth/google`;
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#eff3f6] p-1">
      <div className="w-full flex bg-white shadow-lg h-full">

        <div className="w-full md:w-[51.15%] flex flex-col justify-center px-15 shrink-0 overflow-y-auto">

          {/* Heading */}
          <h2 className="text-[40px] font-medium text-[#111] leading-tight mb-0">
            Library Management System
          </h2>
          <h3 className="text-[35px] font-medium mb-4 leading-tight" style={{ color: "#feca05" }}>
            Login
          </h3>

          {/* Subtext — meaningful */}
          <p className="text-[13px] text-[#686c71] mb-6 leading-relaxed">
            Sign in to manage books, students and issue records.
            Your library management portal awaits.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center border border-[#e2e5e8] rounded overflow-hidden h-10.5" style={{ backgroundColor: "#eff3f6" }}>
                        <div className="px-3 text-[#888] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </div>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center border border-[#e2e5e8] rounded overflow-hidden h-10.5" style={{ backgroundColor: "#eff3f6" }}>
                        <div className="px-3 text-[#888] shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <Input
                          type="password"
                          placeholder="Password"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* OR divider */}
              <div className="relative pt-2 pb-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#e2e5e8]" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-3 text-[15px] text-[#686c71] font-normal">OR</span>
                </div>
              </div>

              {/* Social buttons */}
              <div className="flex gap-2 flex-wrap">

                <Button
                  type="button"
                  size="sm"
                  onClick={handleGoogleLogin}
                  className="cursor-pointer text-white text-[14px] font-medium h-9 px-6 py-5 hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "#C73E2E", borderColor: "#C73E2E" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  Google
                </Button>
              </div>

              {/* Save credentials */}
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="save-creds"
                  defaultChecked
                  className="w-4 h-4 cursor-pointer accent-[#feca05]"
                />
                <label htmlFor="save-creds" className="text-[13px] text-[#686c71] cursor-pointer">
                  Save credentials
                </label>
              </div>

              {/* LOGIN button */}
              <Button
                type="submit"
                size="sm"
                className="cursor-pointer font-bold text-[#171e27] text-[14px] h-9 px-6 py-5 hover:opacity-90 transition-opacity mt-4"
                style={{ backgroundColor: "#feca05", borderColor: "#feca05" }}
              >
                LOGIN
              </Button>

            </form>
          </Form>

          <p className="text-[14px] text-[#686c71] mt-5">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: "#2196f3" }}>
              Register
            </Link>
          </p>
        </div>

        {/* Right column — Image fills remaining screen */}
        <div className="hidden md:block flex-1 overflow-hidden">
          <img
            src={authImage}
            alt="Library"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;