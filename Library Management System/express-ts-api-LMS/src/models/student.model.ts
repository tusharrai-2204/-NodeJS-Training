export interface Student {
  id: number;
  student_name: string;
  roll_no: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  created_at: Date;
  modified_at: Date;
}


export type CreateStudentInput = Omit<
  Student,
  "id" | "created_at" | "modified_at"
>;
export type UpdateStudentInput = Partial<CreateStudentInput>;

export type StudentQueryParams = {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string | null;
  order: "asc" | "desc";
};
