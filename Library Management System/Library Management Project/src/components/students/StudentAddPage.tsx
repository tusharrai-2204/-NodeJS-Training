import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStudentSchema, type AddStudent } from "@/lib/types";
import { useAddStudent } from "@/hooks/useStudents";
import { toast } from "sonner";

const StudentAddPage = () => {
  const navigate = useNavigate();
  const addMutation = useAddStudent();

  const allCountries = Country.getAllCountries();
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const states = State.getStatesOfCountry(selectedCountryCode);
  const cities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  const form = useForm<AddStudent>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      student_name: "",
      roll_no: "",
      phone: "",
      country: "",
      state: "",
      city: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: AddStudent) => {
    addMutation.mutate(
      { data, imageFile },
      { onSuccess: () => navigate("/students") },
    );
  };

  // Shared input class — matches the mockup's grey bg inputs
  const inputCls =
    "h-9 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] placeholder:text-[#aab3bc] placeholder:text-[14px] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2196f3]";
  const selectCls =
    "w-full h-9 rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[14px] text-[#344454] px-2 outline-none focus:border-[#2196f3] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const labelCls = "w-[200px] shrink-0 pt-2 text-[14px] text-[#53606c]";

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      <div className="bg-white border border-[#e2e7eb] rounded-xs overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-3 border-b border-[#e5e9ed]">
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Add Student
          </h2>
        </div>

        {/* Form */}
        <div className="px-5 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Student Name */}
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

              {/* Roll No */}
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

              {/* Phone No */}
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

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border border-[#e2e7eb]"
                    />
                  )}
                  <p className="text-[11px] text-[#9aa3ad]">
                    JPEG or PNG, max 2MB
                  </p>
                </div>
              </div>

              {/* Country */}
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
                              const selected = allCountries.find(
                                (c) => c.name === e.target.value,
                              );
                              field.onChange(e.target.value);
                              setSelectedCountryCode(selected?.isoCode ?? "");
                              setSelectedStateCode("");
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

              {/* State */}
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
                              const selected = states.find(
                                (s) => s.name === e.target.value,
                              );
                              field.onChange(e.target.value);
                              setSelectedStateCode(selected?.isoCode ?? "");
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

              {/* City */}
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

              {/* Buttons — right aligned */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#e5e9ed]">
                <Button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
                  style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
                >
                  {addMutation.isPending ? "Saving..." : "Save"}
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

export default StudentAddPage;
