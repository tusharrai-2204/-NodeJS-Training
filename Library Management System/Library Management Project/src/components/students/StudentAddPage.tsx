import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStudentSchema, type AddStudent } from "@/lib/types";
import { useAddStudent } from "@/hooks/useStudents";

const StudentAddPage = () => {
  const navigate = useNavigate();
  const addMutation = useAddStudent();

  const allCountries = Country.getAllCountries();
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");

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

  const onSubmit = (data: AddStudent) => {
    addMutation.mutate(data, {
      onSuccess: () => navigate("/students"),
    });
  };

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add Student</h1>
        <p className="text-sm text-muted-foreground mt-1">Register a new student</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField control={form.control} name="student_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Student Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="roll_no" render={({ field }) => (
              <FormItem>
                <FormLabel>Roll Number</FormLabel>
                <FormControl><Input placeholder="CS-2024-001" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input placeholder="+91 9876543210" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Country */}
            <FormField control={form.control} name="country" render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <select
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary"
                    value={field.value}
                    onChange={(e) => {
                      const selected = allCountries.find(c => c.name === e.target.value);
                      field.onChange(e.target.value);
                      setSelectedCountryCode(selected?.isoCode ?? "");
                      setSelectedStateCode("");
                      form.setValue("state", "");
                      form.setValue("city", "");
                    }}
                  >
                    <option value="">Select country</option>
                    {allCountries.map(c => (
                      <option key={c.isoCode} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* State */}
            <FormField control={form.control} name="state" render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <select
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary disabled:opacity-50"
                    value={field.value}
                    disabled={!selectedCountryCode}
                    onChange={(e) => {
                      const selected = states.find(s => s.name === e.target.value);
                      field.onChange(e.target.value);
                      setSelectedStateCode(selected?.isoCode ?? "");
                      form.setValue("city", "");
                    }}
                  >
                    <option value="">Select state</option>
                    {states.map(s => (
                      <option key={s.isoCode} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* City */}
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <select
                    className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary disabled:opacity-50"
                    value={field.value}
                    disabled={!selectedStateCode}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <option value="">Select city</option>
                    {cities.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Saving..." : "Save Student"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/students")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StudentAddPage;