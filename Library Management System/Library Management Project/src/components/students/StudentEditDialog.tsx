import type { EditStudent, Student } from "@/lib/types";
import { editStudentSchema } from "@/lib/types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country, State, City } from "country-state-city";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUpdateStudent } from "@/hooks/useStudents";

interface Props {
  student: Student;
  open: boolean;
  onClose: () => void;
}

const allCountries = Country.getAllCountries();

const StudentEditDialog = ({ student, open, onClose }: Props) => {
  const form = useForm<EditStudent>({
    resolver: zodResolver(editStudentSchema),
    defaultValues: {
      student_name: student.student_name,
      roll_no: student.roll_no,
      phone: student.phone,
      country: student.country,
      state: student.state,
      city: student.city,
    },
  });

  const watchedCountry = useWatch({ control: form.control, name: "country" });
  const watchedState = useWatch({ control: form.control, name: "state" });

  const selectedCountryCode =
    allCountries.find((c) => c.name === watchedCountry)?.isoCode ?? "";
  const states = State.getStatesOfCountry(selectedCountryCode);
  const selectedStateCode =
    states.find((s) => s.name === watchedState)?.isoCode ?? "";
  const cities = City.getCitiesOfState(selectedCountryCode, selectedStateCode);

  const updateMutation = useUpdateStudent();

  const onSubmit = (data: EditStudent) => {
    updateMutation.mutate(
      { id: student.id, data },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  return (
    <Dialog key={student.id} open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roll_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll No</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country dropdown */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("state", "");
                        form.setValue("city", "");
                      }}
                    >
                      <option value="">Select country</option>
                      {allCountries.map((c) => (
                        <option key={c.isoCode} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State dropdown */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary disabled:opacity-50"
                      value={field.value}
                      disabled={!selectedCountryCode}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.setValue("city", "");
                      }}
                    >
                      <option value="">Select state</option>
                      {states.map((s) => (
                        <option key={s.isoCode} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City dropdown */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
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
                        <option key={i} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentEditDialog;
