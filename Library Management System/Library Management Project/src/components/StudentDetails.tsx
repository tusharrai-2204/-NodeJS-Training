import { getStudentById } from "@/lib/api/students";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "./ui/skeleton";

const StudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: student, isLoading, error } = useQuery({
    queryKey: ["Students", id],
    queryFn: () => getStudentById(Number(id)),
  });

  return (
    <Dialog open={true} onOpenChange={() => navigate("/students")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {error && <p className="text-sm text-destructive">Failed to load student details.</p>}

        {student && (
          <div className="space-y-3 pt-2">
            <p className="text-sm">
              <span className="font-medium">Student ID: </span>{student.id}
            </p>
            <p className="text-sm">
              <span className="font-medium">Name: </span>{student.title}
            </p>
            <p className="text-sm">
              <span className="font-medium">Age: </span>{student.age}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetails;
