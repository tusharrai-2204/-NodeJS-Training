import type { Student } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";

interface Props {
  student: Student;
  open: boolean;
  onClose: () => void;
}

const rows = [
  { label: "ID", key: "id" },
  { label: "Student Name", key: "student_name" },
  { label: "Roll No.", key: "roll_no" },
  { label: "Phone No.", key: "phone" },
  { label: "Country", key: "country" },
  { label: "State", key: "state" },
  { label: "City", key: "city" },
] as const;

const StudentViewDialog = ({ student, open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 overflow-hidden rounded-xs"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e7eb",
          maxWidth: "480px",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid #e5e9ed" }}
        >
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Student Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[#9aa3ad] hover:text-[#243447] transition-colors text-lg leading-none"
          >
            x
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {/* Profile image */}
          {student.profile_image_url && (
            <div className="flex justify-center mb-4">
              <img
                src={student.profile_image_url}
                alt={student.student_name}
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid #e2e7eb" }}
              />
            </div>
          )}

          {/* Details table */}
          <table className="w-full border-collapse">
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.key}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f7fafc" : "#fff",
                    borderBottom: "1px solid #e5e9ed",
                  }}
                >
                  <td
                    className="px-3 py-2 text-[12px] font-medium"
                    style={{ color: "#53606c", width: "140px" }}
                  >
                    {row.label}
                  </td>
                  <td
                    className="px-3 py-2 text-[12px]"
                    style={{ color: "#344454" }}
                  >
                    {student[row.key] ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end px-5 py-3"
          style={{ borderTop: "1px solid #e5e9ed" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-5 py-1.5 rounded-xs text-[12px] font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#6c757d" }}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentViewDialog;
