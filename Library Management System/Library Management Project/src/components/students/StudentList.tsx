import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { createColumnHelper, tableFeatures, useTable, rowPaginationFeature, rowSortingFeature, columnFilteringFeature, globalFilteringFeature, flexRender } from "@tanstack/react-table";
import { useStudentsQuery, useDeleteStudent } from "@/hooks/useStudents";
import useDebounce from "@/hooks/useDebounce";
import type { Student } from "@/lib/types";
import StudentViewDialog from "./StudentViewDialog";
import StudentEditDialog from "./StudentEditDialog";

const features = tableFeatures({ rowPaginationFeature, rowSortingFeature, columnFilteringFeature, globalFilteringFeature });
const columnHelper = createColumnHelper<typeof features, Student>();

const StudentList = () => {
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
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("student_name", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Student Name {column.getIsSorted() === "asc" ? "↑" : column.getIsSorted() === "desc" ? "↓" : "↕"}
        </Button>
      ),
    }),
    columnHelper.accessor("roll_no", { header: "Roll No" }),
    columnHelper.accessor("phone", { header: "Phone" }),
    columnHelper.display({
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setViewStudent(student)}>
              View
            </Button>
            <Button type="button" size="sm" onClick={() => setEditStudent(student)}>
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete student "{student.student_name}"? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={() => deleteMutation.mutate(student.id)}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }),
  ]);

  const updateParams = useCallback((updates: Record<string, string>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => next.set(k, v));
      return next;
    });
  }, [setSearchParams]);

  const isFirstRender = useRef(true);
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => { setSearchParamsRef.current = setSearchParams; });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSearchParamsRef.current((prev) => {
      const current = prev.get("search") ?? "";
      if (current === debouncedSearch) return prev;
      const next = new URLSearchParams(prev);
      next.set("search", debouncedSearch);
      next.set("page", "1");
      return next;
    });
  }, [debouncedSearch]);

  const { data: result, isLoading, error } = useStudentsQuery({ page, pageSize, search, sortBy, order });

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
      const next = typeof updater === "function" ? updater({ pageIndex: page - 1, pageSize }) : updater;
      updateParams({ page: String(next.pageIndex + 1), pageSize: String(next.pageSize) });
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sortBy ? [{ id: sortBy, desc: order === "desc" }] : []) : updater;
      if (next.length > 0) {
        updateParams({ sortBy: next[0].id, order: next[0].desc ? "desc" : "asc", page: "1" });
      } else {
        updateParams({ sortBy: "", order: "asc", page: "1" });
      }
    },
  });

  if (error) return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
      Failed to load students.
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage student records</p>
        </div>
        <Button type="button" onClick={() => navigate("/students/add")}>+ Add Student</Button>
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
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="border-border bg-secondary/50 hover:bg-secondary/50">
                {hg.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={j}><Skeleton className="h-4 w-full bg-secondary" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className="border-border hover:bg-secondary/30">
                  {row.getAllCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            onChange={(e) => updateParams({ pageSize: e.target.value, page: "1" })}
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => updateParams({ page: String(page - 1) })} disabled={!table.getCanPreviousPage()}>
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            Page <span className="font-medium">{page}</span> of <span className="font-medium">{table.getPageCount()}</span>
          </span>
          <Button variant="outline" size="sm" onClick={() => updateParams({ page: String(page + 1) })} disabled={!table.getCanNextPage()}>
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