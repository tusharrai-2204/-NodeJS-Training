import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIssuesQuery, useReturnBook } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/lib/api/students";
import { getAllBooks } from "@/lib/api/books";
import type { StudentDropDownItem } from "@/lib/types";
import { useAuthStore } from "@/store/authStore";
import { Input } from "../ui/input";

const IssueListPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  // Filter state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [appliedStudentId, setAppliedStudentId] = useState<number | null>(null);
  const [appliedBookId, setAppliedBookId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 10;

  const returnMutation = useReturnBook();

  // Dropdown data
  const { data: students } = useQuery({
    queryKey: ["students-all"],
    queryFn: getAllStudents,
  });

  const { data: books } = useQuery({
    queryKey: ["books-all"],
    queryFn: getAllBooks,
  });

  const {
    data: result,
    isLoading,
    error,
  } = useIssuesQuery({
    page,
    pageSize,
    studentId: appliedStudentId,
    bookId: appliedBookId,
  });

  const handleSearch = () => {
    setAppliedStudentId(selectedStudentId);
    setAppliedBookId(selectedBookId);
    setPage(1);
  };

  const handleClear = () => {
    setSelectedStudentId(null);
    setSelectedBookId(null);
    setAppliedStudentId(null);
    setAppliedBookId(null);
    setPage(1);
  };

  const totalPages = Math.ceil((result?.total ?? 0) / pageSize);

  // Client-side searching
  const filteredData = result?.data.filter((issue) => {
    if (!searchInput) return true;
    const q = searchInput.toLowerCase();
    return (
      issue.book_title.toLowerCase().includes(q) ||
      issue.student_name.toLowerCase().includes(q) ||
      String(issue.id).includes(q)
    );
  });

  const selectCls =
    "h-9 rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] px-2 outline-none focus:border-[#2196f3] cursor-pointer min-w-[200px]";

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5 space-y-3">
      {/* Filter Card */}
      {isAdmin && (
        <div className="bg-white border border-[#e2e7eb] rounded-xs px-5 py-4">
          <div className="flex items-end gap-4 flex-wrap">
            {/* Student Name dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#53606c]">Student Name</label>
              <select
                className={selectCls}
                value={selectedStudentId ?? ""}
                onChange={(e) =>
                  setSelectedStudentId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">All Students</option>
                {students?.map((s: StudentDropDownItem) => (
                  <option key={s.id} value={s.id}>
                    {s.student_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Name dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#53606c]">Book Name</label>
              <select
                className={selectCls}
                value={selectedBookId ?? ""}
                onChange={(e) =>
                  setSelectedBookId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                <option value="">All Books</option>
                {books?.map((b: { id: number; title: string }) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <Button
              type="button"
              onClick={handleSearch}
              className="h-9 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-[#171e27]"
              style={{ backgroundColor: "#feca05", borderColor: "#feca05" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search
            </Button>

            {/* Clear Filter Button */}
            <Button
              type="button"
              onClick={handleClear}
              className="h-9 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
              style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-[#e2e7eb] rounded-xs overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#e5e9ed] px-4 py-3">
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Issue List
          </h2>
          <div className="flex items-center gap-2">
            {/* Export button */}
            {/* <Button
              type="button"
              size="sm"
              className="h-8 px-4 text-[12px] cursor-pointer text-white font-medium"
              style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Export
            </Button> */}
            {/* Issue Book — admin only */}
            {isAdmin && (
              <Button
                type="button"
                size="sm"
                onClick={() => navigate("/issues/new")}
                className="h-8 px-4 text-[12px] cursor-pointer text-white font-medium"
                style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="mr-1"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Issue Book
              </Button>
            )}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-[#68737e]">
            <span>Show</span>
            <div className="flex h-8 w-12 items-center justify-center rounded-xs border border-[#d9e0e5] bg-white text-[11px] text-[#53606c]">
              {pageSize}
            </div>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#68737e]">Search:</span>
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8 w-40 rounded-xs border-[#d5dde3] bg-[#f0f4f7] px-2 text-[11px] text-[#344454] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div className="px-4 pb-4">
            <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Failed to load issued books.
            </div>
          </div>
        ) : (
          <div className="px-4 pb-0">
            <div className="overflow-x-auto">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow className="border border-[#dce3e8] bg-[#edf2f5] hover:bg-[#edf2f5]">
                    {[
                      "ID",
                      "BOOK NAME",
                      ...(isAdmin ? ["STUDENT NAME"] : []),
                      "ISSUE DATE",
                      "RETURN DATE",
                      ...(isAdmin ? ["RETURN OPTION"] : []),
                    ].map((col) => (
                      <TableHead
                        key={col}
                        className="h-8.5 border-r border-[#dce3e8] px-2 text-[11px] font-semibold uppercase text-[#243447] last:border-r-0"
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: pageSize }).map((_, i) => (
                      <TableRow
                        key={i}
                        className="h-8.5 border-b border-[#e1e7eb]"
                      >
                        {Array.from({ length: isAdmin ? 6 : 4 }).map((_, j) => (
                          <TableCell
                            key={j}
                            className="border-r border-[#edf0f2] px-2 py-1.5 last:border-r-0"
                          >
                            <Skeleton className="h-3 w-full bg-[#edf1f4]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (filteredData?.length ?? 0) === 0 ? (
                    <TableRow className="border-b border-[#e1e7eb]">
                      <TableCell
                        colSpan={isAdmin ? 6 : 4}
                        className="py-10 text-center text-[12px] text-[#8a949e]"
                      >
                        No issues found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData?.map((issue, index) => (
                      <TableRow
                        key={issue.id}
                        className={`h-8.5 border-b border-[#dfe6ea] transition-colors ${
                          index % 2 === 0 ? "bg-[#f7fafc]" : "bg-white"
                        } hover:bg-[#eef5f9]`}
                      >
                        <TableCell className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454]">
                          {issue.id}
                        </TableCell>
                        <TableCell className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454]">
                          {issue.book_title}
                        </TableCell>
                        {isAdmin && (<TableCell className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454]">
                          {issue.student_name}
                        </TableCell>)}
                        <TableCell className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454]">
                          {new Date(issue.issued_at).toLocaleString()}
                        </TableCell>
                        {isAdmin &&(<TableCell className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454]">
                          {issue.return_date
                            ? new Date(issue.return_date).toLocaleString()
                            : "—"}
                        </TableCell>)}
                        <TableCell className="px-2 py-1.5 text-[12px] text-[#344454]">
                          {/* Return option — admin only, only for issued books */}
                          {isAdmin && issue.status === "issued" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  type="button"
                                  className="cursor-pointer text-[12px] font-medium hover:underline"
                                  style={{ color: "#2196f3" }}
                                >
                                  Return
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-[#f1f4f7] text-[#243447]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Return Book
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Mark "{issue.book_title}" as returned from{" "}
                                    {issue.student_name}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border border-zinc-400 bg-transparent text-[#243447] hover:bg-zinc-200 hover:text-zinc-600 cursor-pointer">
                                    Cancel
                                  </AlertDialogCancel>
                                  <Button
                                    onClick={() =>
                                      returnMutation.mutate(issue.id)
                                    }
                                    className="cursor-pointer text-white"
                                    style={{ backgroundColor: "#2196f3" }}
                                  >
                                    Confirm Return
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#e5e9ed] px-4 py-3">
          <div className="text-[12px] text-[#7b858f]">
            Showing{" "}
            <span className="font-medium text-[#465563]">
              {filteredData?.length ?? 0}
            </span>{" "}
            entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="default"
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex h-7 min-w-7 items-center justify-center rounded-xs bg-[#337ab7] px-2 text-[9px] font-medium text-white">
              {page}
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueListPage;
