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
import { useAuthStore } from "@/store/authStore";

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

  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const deleteMutation = useDeleteStudent();

  const columns = columnHelper.columns([
    columnHelper.display({
      id: "image",
      header: "IMAGE",
      cell: ({ row }) => {
        const url = row.original.profile_image_url;
        if (!url)
          return (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
              style={{ backgroundColor: "#2196f3" }}
            >
              {row.original.student_name.charAt(0).toUpperCase()}
            </div>
          );
        return (
          <img
            src={url}
            alt={row.original.student_name}
            className="w-8 h-8 rounded-full object-cover border border-[#e2e7eb]"
          />
        );
      },
    }),
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("student_name", {
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting()}
          variant="ghost"
          className="h-auto w-full justify-start p-0 text-[10px] font-semibold text-[#243447] hover:bg-transparent hover:text-[#243447] cursor-pointer"
        >
          NAME{" "}
          <span className="ml-auto text-[10px] text-[#aeb7c2]">
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
                ? "↓"
                : "↕"}
          </span>
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
          <div className="flex gap-1.5 items-center">
            <Button
              type="button"
              size="sm"
              onClick={() => setViewStudent(student)}
              className="h-8 rounded-md px-4 text-[12px] cursor-pointer"
              style={{ backgroundColor: "#6c757d", borderColor: "#6c757d" }}
            >
              View
            </Button>

            {isAdmin && (
              <Button
                type="button"
                size="sm"
                onClick={() => navigate(`/students/edit/${student.id}`)}
                className="h-8 rounded-md px-4 text-[12px] text-primary-foreground cursor-pointer"
              >
                Edit
              </Button>
            )}

            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="default"
                    className="h-8 rounded-md px-4 text-[12px] text-primary-foreground cursor-pointer"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-[#f1f4f7] text-[#243447]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Delete student "{student.student_name}"? This cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="border border-zinc-800 bg-transparent text-[#243447] hover:bg-zinc-300 hover:text-zinc-800 cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-md px-4 text-primary-foreground cursor-pointer"
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
            className="cursor-pointer text-[#53606c] hover:text-[#243447] transition-colors"
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
      <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
        <div className="rounded-[3px] border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          Failed to load students. Please check your connection and try again.
        </div>
      </div>
    );

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      {/* Table Card */}
      <div className="overflow-hidden border border-[#e2e7eb] bg-white rounded-xs">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#e5e9ed] px-4 py-3">
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Student List
          </h2>

          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="relative">
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setExportMenuOpen((prev) => !prev);
                }}
                disabled={exportMutation.isPending}
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
                {exportMutation.isPending ? "Exporting..." : "Export"}
              </Button>

              {exportMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-44 bg-white border border-[#e2e7eb] rounded shadow-lg z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(["csv", "excel", "pdf"] as const).map((format) => (
                    <button
                      key={format}
                      type="button"
                      className="w-full text-left px-4 py-2.5 text-[12px] text-[#53606c] hover:bg-[#f1f4f7] transition-colors first:rounded-t last:rounded-b cursor-pointer"
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
              <Button
                type="button"
                size="sm"
                onClick={() => navigate("/students/add")}
                className="h-8 px-4 text-[12px] cursor-pointer text-white font-medium"
                style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
              >
                + Add Student
              </Button>
            )}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-[#68737e]">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) =>
                updateParams({ pageSize: e.target.value, page: "1" })
              }
              className="h-8 w-12 rounded-xs border border-[#d9e0e5] bg-white px-1 text-center text-[11px] text-[#53606c] outline-none focus:border-[#aebbc7]"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
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
        <div className="px-4 pb-0">
          <div className="overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border border-[#dce3e8] bg-[#edf2f5] hover:bg-[#edf2f5]"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-8.5 border-r border-[#dce3e8] px-2 text-[11px] font-semibold uppercase text-[#243447] last:border-r-0"
                      >
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
                    <TableRow
                      key={i}
                      className="h-8.5 border-b border-[#e1e7eb]"
                    >
                      {columns.map((_, j) => (
                        <TableCell
                          key={j}
                          className="border-r border-[#edf0f2] px-2 py-1.5 last:border-r-0"
                        >
                          <Skeleton className="h-3 w-full bg-[#edf1f4]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length === 0 ? (
                  <TableRow className="border-b border-[#e1e7eb]">
                    <TableCell
                      colSpan={columns.length}
                      className="py-10 text-center text-[12px] text-[#8a949e]"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={`h-8.5 border-b border-[#dfe6ea] transition-colors ${
                        index % 2 === 0 ? "bg-[#f7fafc]" : "bg-white"
                      } hover:bg-[#eef5f9]`}
                    >
                      {row.getAllCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454] last:border-r-0"
                        >
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
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#e5e9ed] px-4 py-3">
          <div className="text-[12px] text-[#7b858f]">
            Showing{" "}
            <span className="font-medium text-[#465563]">
              {table.getRowModel().rows.length}
            </span>{" "}
            entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="default"
              onClick={() => updateParams({ page: String(page - 1) })}
              disabled={!table.getCanPreviousPage()}
              className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] hover:text-[#66737e] cursor-pointer"
            >
              Previous
            </Button>
            <div className="flex h-7 min-w-7 items-center justify-center rounded-xs bg-[#337ab7] px-2 text-[9px] font-medium text-white">
              {page}
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => updateParams({ page: String(page + 1) })}
              disabled={!table.getCanNextPage()}
              className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] hover:text-[#66737e] cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs — unchanged */}
      {viewStudent && (
        <StudentViewDialog
          student={viewStudent}
          open={!!viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentList;
