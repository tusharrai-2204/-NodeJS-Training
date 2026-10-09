import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useIssuesQuery, useReturnBook } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/lib/api/students";
import { getAllBooks } from "@/lib/api/books";
import type { StudentDropDownItem } from "@/lib/types";

const IssueListPage = () => {
  const navigate = useNavigate();

  // Filter state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [appliedStudentId, setAppliedStudentId] = useState<number | null>(null);
  const [appliedBookId, setAppliedBookId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
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

  const { data: result, isLoading, error } = useIssuesQuery({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground mt-1">Track book issuances and returns</p>
        </div>
        <Button onClick={() => navigate("/issues/new")}>+ Issue Book</Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-end gap-3 flex-wrap p-4 bg-card border border-border rounded-xl">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Student</label>
          <select
            className="border border-border rounded-md px-3 py-2 text-sm bg-secondary min-w-45"
            value={selectedStudentId ?? ""}
            onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Students</option>
            {students?.map((s: StudentDropDownItem) => (
              <option key={s.id} value={s.id}>{s.student_name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">Book</label>
          <select
            className="border border-border rounded-md px-3 py-2 text-sm bg-secondary min-w-45"
            value={selectedBookId ?? ""}
            onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Books</option>
            {books?.map((b: { id: number; title: string }) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>

        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={handleClear}>Clear</Button>
      </div>

      {/* Table */}
      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load issues.
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                <TableHead>ID</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Issued At</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full bg-secondary" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : result?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                    No issues found
                  </TableCell>
                </TableRow>
              ) : (
                result?.data.map(issue => (
                  <TableRow key={issue.id} className="border-border hover:bg-secondary/30">
                    <TableCell>{issue.id}</TableCell>
                    <TableCell>{issue.book_title}</TableCell>
                    <TableCell>{issue.student_name}</TableCell>
                    <TableCell>{new Date(issue.issued_at).toLocaleDateString()}</TableCell>
                    <TableCell>{issue.return_date ? new Date(issue.return_date).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        issue.status === "issued"
                          ? "bg-yellow-500/15 text-yellow-600"
                          : "bg-green-500/15 text-green-600"
                      }`}>
                        {issue.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {issue.status === "issued" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button" size="sm" variant="outline">Return</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Return Book</AlertDialogTitle>
                              <AlertDialogDescription>
                                Mark "{issue.book_title}" as returned from {issue.student_name}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button onClick={() => returnMutation.mutate(issue.id)}>
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
      )}

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
          ← Previous
        </Button>
        <span className="text-xs text-muted-foreground px-2">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
        </span>
        <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
          Next →
        </Button>
      </div>
    </div>
  );
};

export default IssueListPage;
