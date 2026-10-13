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

  const selectCls = "w-full h-9 rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] px-2 outline-none focus:border-[#2196f3] cursor-pointer";
  const labelCls = "w-[200px] shrink-0 pt-2 text-[13px] text-[#53606c]";

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      <div className="bg-white border border-[#e2e7eb] rounded-xs overflow-hidden">

        {/* Card header */}
        <div className="px-5 py-3 border-b border-[#e5e9ed]">
          <h2 className="text-[14px] font-semibold text-[#243447]">Issue Book</h2>
        </div>

        {/* Form body */}
        <div className="px-5 py-5">

          {/* Book Name */}
          <div className="mb-4 flex items-start">
            <label className={labelCls}>Book Name</label>
            <div className="flex-1 max-w-125">
              <select
                className={selectCls}
                value={selectedBookId ?? ""}
                onChange={(e) => setSelectedBookId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Select Book Name</option>
                {books?.map((b: { id: number; title: string }) => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Name */}
          <div className="mb-4 flex items-start">
            <label className={labelCls}>Student Name</label>
            <div className="flex-1 max-w-125">
              <select
                className={selectCls}
                value={selectedStudentId ?? ""}
                onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Select Student Name</option>
                {students?.map((s: StudentDropDownItem) => (
                  <option key={s.id} value={s.id}>{s.student_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons — right aligned */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#e5e9ed]">
            <Button
              type="button"
              onClick={handleIssue}
              disabled={!selectedBookId || !selectedStudentId || createMutation.isPending}
              className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
              style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
            >
              {createMutation.isPending ? "Issuing..." : "Issue"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/issues")}
              className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
              style={{ backgroundColor: "#f44336", borderColor: "#f44336" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBookPage;