import { apiInstance } from "../api";
import type { Issue, IssueQueryParams } from "../types";

export const getIssues = async ({ page, pageSize, studentId, bookId }: IssueQueryParams) => {
    const params = new URLSearchParams();

    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (studentId) params.set('studentId', String(studentId));
    if (bookId) params.set('bookId', String(bookId));

    const response = await apiInstance.get(`/api/issues?${params.toString()}`);
    return {
        data: response.data.data as Issue[],
        total: response.data.meta.total as number
    };
};

// issue book to student
export const createIssue = async (data: { book_id: number; student_id: number }): Promise<Issue> => {
    const response = await apiInstance.post(`/api/issues`, data);
    return response.data.data as Issue;
}

// return issued book 
export const returnBook = async (issueId: number): Promise<Issue> => {
    const response = await apiInstance.patch(`/api/issues/${issueId}/return`);
    return response.data.data as Issue;
}