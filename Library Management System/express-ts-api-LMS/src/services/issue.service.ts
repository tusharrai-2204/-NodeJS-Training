import {
  type CreateIssueSchema,
  type IssueQuerySchema,
} from "../schema/issue.schema.js";
import * as issueRepo from "../repositories/issue.repo.js";
import * as bookRepo from "../repositories/book.repo.js";
import * as studentRepo from "../repositories/student.repo.js";
import {
  AppError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/AppError.js";

export const listIssues = async (query: IssueQuerySchema) => {
  const { issues, total } = await issueRepo.getIssues(query);
  return {
    issues,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.ceil(total / query.pageSize),
    },
  };
};

// Issue book to the student with given id
export const issueBook = async (input: CreateIssueSchema) => {
  // verify book exists
  const book = await bookRepo.findBookById(input.book_id);
  if (!book) throw new NotFoundError("Book Not Found");

  // verify student exists
  const student = await studentRepo.findStudentById(input.student_id);
  if (!student) throw new NotFoundError("Student Not Found");

  // check if this book is already issued to this student
  const activeIssue = await issueRepo.findActiveIssueByBookAndStudent(
    input.book_id,
    input.student_id,
  );
  if (activeIssue)
    throw new ConflictError(
      `${book.title} is already issued to ${student.student_name} and has not been returned yet`,
    );

  const issueId = await issueRepo.createIssue(input.book_id, input.student_id);

  return issueRepo.findIssueById(issueId);
};

// Return the issued book
export const returnBook = async (id: number) => {
  //verify if issue record exists
  const issue = await issueRepo.findIssueById(id);
  if (!issue) throw new NotFoundError("Book Issue record not found");

  if (issue.status === "returned")
    throw new BadRequestError("Book is already returned");

  const returned = await issueRepo.returnIssue(id);
  if (!returned) throw new AppError("Failed to return the book", 500);

  return await issueRepo.findIssueById(id);
};
