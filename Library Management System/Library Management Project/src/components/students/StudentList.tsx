import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  createColumnHelper,
  tableFeatures,
  useTable,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  flexRender,
} from "@tanstack/react-table";
import {
  useStudentsQuery,
  useDeleteStudent,
  useExportStudents,
} from "@/hooks/useStudents";
import useDebounce from "@/hooks/useDebounce";
import type { Student } from "@/lib/types";
import StudentViewDialog from "./StudentViewDialog";
import StudentEditDialog from "./StudentEditDialog";
import { useAuthStore } from "@/store/authStore";
import { Download } from "lucide-react";

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
});
const columnHelper = createColumnHelper<typeof features, Student>();

const StudentList = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMutation = useExportStudents();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy");
  const order = (searchParams.get("order") ?? "asc") as "asc" | "desc";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Dialog state
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const deleteMutation = useDeleteStudent();

  const columns = columnHelper.columns([
    columnHelper.display({
      id: "image",
      header: "IMAGE",
      cell: ({ row }) => {
        const url = row.original.profile_image_url;
        if (!url)
          return (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
              {row.original.student_name.charAt(0).toUpperCase()}
            </div>
          );
        return (
          <img
            src={url}
            alt={row.original.student_name}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        );
      },
    }),
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("student_name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => column.toggleSorting()}
        >
          NAME
          {/* {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
              ? "↓"
              : "↕"} */}
        </Button>
      ),
    }),
    columnHelper.accessor("roll_no", { header: "ROLL NO." }),
    columnHelper.accessor("phone", { header: "PHONE NO." }),
    columnHelper.display({
      id: "Actions",
      header: "ACTIONS",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setViewStudent(student)}
            >
              View
            </Button>
            {isAdmin && (
              <Button
                type="button"
                size="sm"
                onClick={() => setEditStudent(student)}
              >
                Edit
              </Button>
            )}
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Delete student "{student.student_name}"? This cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(student.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "download",
      header: "DOWNLOAD OPTION",
      cell: ({ row }) => {
        const url = row.original.profile_image_url;
        const name = row.original.student_name;

        if (!url) return null;

        const handleDownload = async () => {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            const ext = blob.type.split("/")[1] ?? "jpg";
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = `${name}.${ext}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobUrl);
          } catch {
            // silent fail
          }
        };

        return (
          <button
            type="button"
            onClick={handleDownload}
            title="Download profile image"
            className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            {/* Download SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        );
      },
    }),
  ]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => next.set(k, v));
        return next;
      });
    },
    [setSearchParams],
  );

  const isFirstRender = useRef(true);
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchParamsRef.current((prev) => {
      const current = prev.get("search") ?? "";
      if (current === debouncedSearch) return prev;
      const next = new URLSearchParams(prev);
      next.set("search", debouncedSearch);
      next.set("page", "1");
      return next;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = () => setExportMenuOpen(false);
    if (exportMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [exportMenuOpen]);

  const {
    data: result,
    isLoading,
    error,
  } = useStudentsQuery({ page, pageSize, search, sortBy, order });

  const table = useTable({
    features,
    columns,
    data: result?.data ?? [],
    rowCount: result?.total ?? 0,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting: sortBy ? [{ id: sortBy, desc: order === "desc" }] : [],
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;
      updateParams({
        page: String(next.pageIndex + 1),
        pageSize: String(next.pageSize),
      });
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(sortBy ? [{ id: sortBy, desc: order === "desc" }] : [])
          : updater;
      if (next.length > 0) {
        updateParams({
          sortBy: next[0].id,
          order: next[0].desc ? "desc" : "asc",
          page: "1",
        });
      } else {
        updateParams({ sortBy: "", order: "asc", page: "1" });
      }
    },
  });

  if (error)
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load students.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student records
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setExportMenuOpen((prev) => !prev)
              }}
              disabled={exportMutation.isPending}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              {exportMutation.isPending ? "Exporting..." : "Export"}
            </Button>

            {exportMenuOpen && (
              <div 
              className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-10"
              onClick={(e) => e.stopPropagation()}
              >
                {(["csv", "excel", "pdf"] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportMutation.mutate(format);
                    }}
                  >
                    {format === "csv" && "📄 Export as CSV"}
                    {format === "excel" && "📊 Export as Excel"}
                    {format === "pdf" && "📋 Export as PDF"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <Button type="button" onClick={() => navigate("/students/add")}>
              + Add Student
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Input
          type="text"
          placeholder="Search students..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs bg-secondary border-border"
        />
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-border bg-secondary/50 hover:bg-secondary/50"
              >
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-secondary" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-12"
                >
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border hover:bg-secondary/30"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls — just like BookList page */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) =>
              updateParams({ pageSize: e.target.value, page: "1" })
            }
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={!table.getCanPreviousPage()}
          >
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{table.getPageCount()}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={!table.getCanNextPage()}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      {viewStudent && (
        <StudentViewDialog
          student={viewStudent}
          open={!!viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}
      {editStudent && (
        <StudentEditDialog
          student={editStudent}
          open={!!editStudent}
          onClose={() => setEditStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentList;
