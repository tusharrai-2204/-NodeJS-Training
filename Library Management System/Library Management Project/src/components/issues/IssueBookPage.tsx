import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCreateIssue } from "@/hooks/useIssues";
import { useQuery } from "@tanstack/react-query";
import { getAllStudents } from "@/lib/api/students";
import { getAllBooks } from "@/lib/api/books";
import type { StudentDropDownItem } from "@/lib/types";

const IssueBookPage = () => {
  const navigate = useNavigate();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const createMutation = useCreateIssue();

  const { data: students } = useQuery({
    queryKey: ["students-all"],
    queryFn: getAllStudents,
  });

  const { data: books } = useQuery({
    queryKey: ["books-all"],
    queryFn: getAllBooks,
  });

  const handleIssue = () => {
    if (!selectedBookId || !selectedStudentId) return;
    createMutation.mutate(
      { book_id: selectedBookId, student_id: selectedStudentId },
      { onSuccess: () => navigate("/issues") }
    );
  };

  return (
    <div className="max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Issue Book</h1>
        <p className="text-sm text-muted-foreground mt-1">Issue a book to a student</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">

        <div className="space-y-2">
          <label className="text-sm font-medium">Book</label>
          <select
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary"
            value={selectedBookId ?? ""}
            onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select a book</option>
            {books?.map((b: { id: number; title: string }) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Student</label>
          <select
            className="w-full border border-border rounded-md px-3 py-2 text-sm bg-secondary"
            value={selectedStudentId ?? ""}
            onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select a student</option>
            {students?.map((s: StudentDropDownItem) => (
              <option key={s.id} value={s.id}>{s.student_name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleIssue}
            disabled={!selectedBookId || !selectedStudentId || createMutation.isPending}
          >
            {createMutation.isPending ? "Issuing..." : "Issue Book"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/issues")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueBookPage;
