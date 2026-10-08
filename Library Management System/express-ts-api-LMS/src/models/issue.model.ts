export interface Issue {
  id: number;
  book_id: number;
  student_id: number;
  issued_at: Date;
  return_date: Date | null;
  status: "issued" | "returned";
  created_at: Date;
  modified_at: Date;
};

export interface IssueResponse {
  id: number;
  book_id: number;
  book_title: string;
  student_id: number;
  student_name: string;
  issued_at: Date;
  return_date: Date | null;
  status: "issued" | "returned";
};

export type IssueQueryParams = {
  page: number;
  pageSize: number;
  studentId: number | null;
  bookId: number | null;
};