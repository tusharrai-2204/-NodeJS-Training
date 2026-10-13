import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editStudentSchema, type EditStudent } from "@/lib/types";
import { useUpdateStudent } from "@/hooks/useStudents";
import { getStudentById } from "@/lib/api/students";
import { toast } from "sonner";

const allCountries = Country.getAllCountries();

const StudentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);

  const { data: studentResponse, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentById(Number(id)),
    enabled: !!id,
  });

  const student = studentResponse;

  const form = useForm<EditStudent>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      student_name: "",
      roll_no: "",
      phone: "",
      country: "",
      state: "",
      city: "",
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        student_name: student.student_name,
        roll_no: student.roll_no,
        phone: student.phone,
        country: student.country,
        state: student.state,
        city: student.city,
      });
    }
  }, [student, form]);

  const watchedCountry = useWatch({ control: form.control, name: "country" });
  const watchedState = useWatch({ control: form.control, name: "state" });

  const selectedCountryCode =
    allCountries.find((c) => c.name === watchedCountry)?.isoCode ?? "";
  const states = State.getStatesOfCountry(selectedCountryCode);
  const selectedStateCode =
    states.find((s) => s.name === watchedState)?.isoCode ?? "";
  const cities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  const previewUrl = newPreviewUrl ?? student?.profile_image_url ?? null;

  const updateMutation = useUpdateStudent();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setImageFile(file);
    setNewPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data: EditStudent) => {
    if (!id) return;
    updateMutation.mutate(
      { id: Number(id), data, imageFile },
      { onSuccess: () => navigate("/students") },
    );
  };

  const inputCls =
    "h-9 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] placeholder:text-[#aab3bc] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2196f3]";
  const selectCls =
    "w-full h-9 rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] px-2 outline-none focus:border-[#2196f3] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const labelCls = "w-[200px] shrink-0 pt-2 text-[13px] text-[#53606c]";

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
        <div className="bg-white border border-[#e2e7eb] rounded-xs p-8 text-center text-[13px] text-[#9aa3ad]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      <div className="bg-white border border-[#e2e7eb] rounded-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e5e9ed]">
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Edit Student
          </h2>
        </div>

        <div className="px-5 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="student_name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>Student Name</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="Student Name"
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roll_no"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>Roll No.</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="Roll No"
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>Phone No.</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="Phone No"
                            className={inputCls}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Student Photo */}
              <div className="mb-4 flex items-start">
                <label className={labelCls}>Student Photo</label>
                <div className="flex-1 max-w-125 space-y-2">
                  {previewUrl && (
                    <div>
                      <p className="text-[11px] text-[#9aa3ad] mb-1">
                        {newPreviewUrl ? "New photo:" : "Current photo:"}
                      </p>
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border border-[#e2e7eb]"
                      />
                    </div>
                  )}
                  {/* <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="h-9 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] cursor-pointer"
                  /> */}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="h-9 w-full rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] cursor-pointer file:mr-3 file:h-full file:border-0 file:border-r file:border-[#d5dde3] file:bg-white file:px-3 file:text-[11px] file:text-[#53606c] file:font-medium file:cursor-pointer"
                  />

                  <p className="text-[11px] text-[#9aa3ad]">
                    {previewUrl
                      ? "Select new photo to replace current"
                      : "JPEG or PNG, max 2MB"}
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>Country</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <select
                            className={selectCls}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              form.setValue("state", "");
                              form.setValue("city", "");
                            }}
                          >
                            <option value="">Select Country</option>
                            {allCountries.map((c) => (
                              <option key={c.isoCode} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>State</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <select
                            className={selectCls}
                            value={field.value}
                            disabled={!selectedCountryCode}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              form.setValue("city", "");
                            }}
                          >
                            <option value="">Select State</option>
                            {states.map((s) => (
                              <option key={s.isoCode} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start">
                      <label className={labelCls}>City</label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <select
                            className={selectCls}
                            value={field.value}
                            disabled={!selectedStateCode}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            <option value="">Select City</option>
                            {cities.map((c, i) => (
                              <option key={i} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#e5e9ed]">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
                  style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
                >
                  {updateMutation.isPending ? "Saving..." : "Update"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/students")}
                  className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
                  style={{ backgroundColor: "#f44336", borderColor: "#f44336" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default StudentEditPage;
