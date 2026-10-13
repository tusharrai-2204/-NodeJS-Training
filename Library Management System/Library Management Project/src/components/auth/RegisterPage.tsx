import { type registerForm, registerSchema } from "@/lib/types";
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
import { getMe, registerUser } from "@/lib/api/auth";
import axios from "axios";
import authImage from "@/assets/img-auth-2.jpg";

const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const form = useForm<registerForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: registerForm) => {
    try {
      await registerUser(data);
      const meResponse = await getMe();
      login({
        id: meResponse.data.id,
        email: meResponse.data.email,
        first_name: meResponse.data.first_name,
        last_name: meResponse.data.last_name,
        role: meResponse.data.role,
      });
      toast.success("Registration successful");
      navigate("/");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Registration failed")
        : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#eff3f6] p-1">
      <div className="w-full flex bg-white shadow-lg h-full">

        {/* Left column — Register Form */}
        <div className="w-full md:w-[51.15%] flex flex-col justify-center px-15 shrink-0 overflow-y-auto">

          {/* Heading */}
          <h2 className="text-[40px] font-medium text-[#111] leading-tight mb-0">
            Library Management System
          </h2>
          <h3 className="text-[35px] font-medium mb-4 leading-tight" style={{ color: "#feca05" }}>
            Register
          </h3>

          {/* Subtext */}
          <p className="text-[13px] text-[#686c71] mb-6 leading-relaxed">
            Create your account to get started.
            Manage books, students and issue records from one place.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              {/* First Name + Last Name — side by side */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex items-center border border-[#e2e5e8] rounded overflow-hidden h-10.5" style={{ backgroundColor: "#eff3f6" }}>
                          <div className="px-3 text-[#888] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          </div>
                          <Input
                            placeholder="First Name"
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="flex items-center border border-[#e2e5e8] rounded overflow-hidden h-10.5" style={{ backgroundColor: "#eff3f6" }}>
                          <div className="px-3 text-[#888] shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                          </div>
                          <Input
                            placeholder="Last Name"
                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
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
                          placeholder="Email Address"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password */}
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

              {/* REGISTER button */}
              <Button
                type="submit"
                size="sm"
                className="cursor-pointer font-bold text-[#171e27] text-[14px] h-9 px-6 py-5 hover:opacity-90 transition-opacity mt-4"
                style={{ backgroundColor: "#feca05", borderColor: "#feca05" }}
              >
                CREATE ACCOUNT
              </Button>

            </form>
          </Form>

          <p className="text-[14px] text-[#686c71] mt-5">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: "#2196f3" }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Right column — same image */}
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

export default RegisterPage;
