import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordForm } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { changePassword } from "@/lib/api/auth";
import axios from "axios";
import authImage from "@/assets/img-auth-2.jpg";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword({ new_password: data.new_password });
      if (user) {
        login({ ...user, requiresPasswordChange: false });
      }
      toast.success("Password changed successfully");
      navigate("/books");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to change password")
        : "Failed to change password";
      toast.error(message);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#eff3f6] p-1">
      <div className="w-full flex bg-white shadow-lg h-full">

        <div className="w-full md:w-[51.15%] flex flex-col justify-center px-15 shrink-0 overflow-y-auto">
          <h2 className="text-[40px] font-medium text-[#111] leading-tight mb-0">
            Library Management System
          </h2>
          <h3 className="text-[35px] font-medium mb-4 leading-tight" style={{ color: "#feca05" }}>
            Set Your Password
          </h3>
          <p className="text-[13px] text-[#686c71] mb-6 leading-relaxed">
            Welcome! For security, please set a new password before continuing.
            Your initial password was your registered phone number.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

              <FormField
                control={form.control}
                name="new_password"
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
                          placeholder="New password (min. 6 characters)"
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
                name="confirm_password"
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
                          placeholder="Confirm new password"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none h-full text-[#111] placeholder:text-[#aaa] text-[13px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer font-bold text-[#171e27] text-[14px] h-9 px-6 py-5 hover:opacity-90 transition-opacity mt-4"
                style={{ backgroundColor: "#feca05", borderColor: "#feca05" }}
              >
                {form.formState.isSubmitting ? "Saving..." : "SET PASSWORD"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="hidden md:block flex-1 overflow-hidden">
          <img src={authImage} alt="Library" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;