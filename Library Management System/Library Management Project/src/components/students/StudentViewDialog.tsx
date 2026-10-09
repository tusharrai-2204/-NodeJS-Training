import type { Student } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Props {
  student: Student;
  open: boolean;
  onClose: () => void;
}

const StudentViewDialog = ({ student, open, onClose }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">ID</span>
            <span>{student.id}</span>
            <span className="text-muted-foreground">Name</span>
            <span>{student.student_name}</span>
            <span className="text-muted-foreground">Roll No</span>
            <span>{student.roll_no}</span>
            <span className="text-muted-foreground">Phone</span>
            <span>{student.phone}</span>
            <span className="text-muted-foreground">Country</span>
            <span>{student.country}</span>
            <span className="text-muted-foreground">State</span>
            <span>{student.state}</span>
            <span className="text-muted-foreground">City</span>
            <span>{student.city}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentViewDialog;
