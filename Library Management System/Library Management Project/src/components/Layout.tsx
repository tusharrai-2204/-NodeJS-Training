import { useAuthStore } from "@/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const routeMeta: Record<
  string,
  { label: string; parent?: { label: string; path: string } }
> = {
  "/books": { label: "Book List" },
  "/books/add": {
    label: "Add Book",
    parent: { label: "Book List", path: "/books" },
  },

  "/students": { label: "Student List" },
  "/students/add": {
    label: "Add Student",
    parent: { label: "Student List", path: "/students" },
  },

  "/issues": { label: "Issue List" },
  "/issues/new": {
    label: "Issue Book",
    parent: { label: "Issue List", path: "/issues" },
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isEditBook = location.pathname.startsWith("/books/edit/");
  const isEditStudent = location.pathname.startsWith("/students/edit/");

  const currentMeta = isEditBook
    ? { label: "Edit Book", parent: { label: "Book List", path: "/books" } }
    : isEditStudent
      ? {
          label: "Edit Student",
          parent: { label: "Student List", path: "/students" },
        }
      : (routeMeta[location.pathname] ?? { label: "Page" });

  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{ backgroundColor: "#eff3f6" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 h-full"
        style={{
          backgroundColor: "#171e27",
          width: sidebarCollapsed ? "80px" : "220px",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-4 h-14 shrink-0"
          style={{ backgroundColor: "#171e27" }}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold text-[#171e27]"
                style={{ backgroundColor: "#feca05" }}
              >
                L
              </div>
              <span className="text-white text-[13px] font-medium truncate">
                Library Management
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div
              className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold text-[#171e27] mx-auto"
              style={{ backgroundColor: "#feca05" }}
            >
              L
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((p) => !p)}
            className="text-[#b5bdca] hover:text-white transition-colors cursor-pointer ml-1 shrink-0"
          >
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col flex-1 mt-2">
          {([
            {
              to: "/books",
              label: "Book List",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              ),
            },
            {
              to: "/issues",
              label: "Issue List",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              ),
            },
            ...(user?.role === "admin"
              ? [
                  {
                    to: "/students",
                    label: "Student List",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                    ),
                  },
                ]
              : []),
          ] as { to: string; label: string; icon: React.ReactNode }[]).map((item) => {
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="flex items-center gap-3 cursor-pointer transition-colors relative text-left"
                style={{
                  padding: sidebarCollapsed ? "10px 0" : "10px 20px",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  color: isActive ? "#fff" : "#b5bdca",
                  backgroundColor: isActive ? "#1d2431" : "transparent",
                  borderLeft: isActive
                    ? "3px solid #feca05"
                    : "3px solid transparent",
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="text-[13px] truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Download User Manual caption */}
          {/* {!sidebarCollapsed && (
            <div className="mt-4 px-5">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8090a5" }}>
                Download User Manual
              </p>
            </div>
          )} */}
        </nav>

        {/* Download card at bottom */}
        {/* {!sidebarCollapsed && (
          <div className="mx-3 mb-4 rounded p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b5bdca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <p className="text-[12px] text-white font-medium mb-2">Download User Manual</p>
            <button
              type="button"
              className="cursor-pointer text-white text-[11px] font-medium px-4 py-1.5 rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#2196f3" }}
            >
              Download
            </button>
          </div>
        )} */}
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header
          className="shrink-0 flex items-center justify-between px-6 h-14 bg-white"
          style={{ borderBottom: "1px solid #e2e5e8" }}
        >
          {/* Left — Page title + breadcrumb */}
          <div>
            <h5 className="text-[15px] font-semibold text-[#111] leading-tight">
              {currentMeta.label}
            </h5>
            <div className="flex items-center gap-1 mt-0.5">
              {/* Home icon */}
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#feca05"
                  stroke="#feca05"
                  strokeWidth="1"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </button>
              {/* Parent breadcrumb */}
              {currentMeta.parent && (
                <>
                  <span className="text-[#686c71] text-[11px]">/</span>
                  <button
                    type="button"
                    onClick={() => navigate(currentMeta.parent!.path)}
                    className="text-[11px] italic cursor-pointer hover:underline"
                    style={{ color: "#feca05" }}
                  >
                    {currentMeta.parent.label}
                  </button>
                </>
              )}
              {/* Current page */}
              <span className="text-[#686c71] text-[11px]">/</span>
              <span className="text-[11px] italic text-[#686c71]">
                {currentMeta.label}
              </span>
            </div>
          </div>

          {/* Right — Welcome + settings dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#686c71]">
              Welcome {user?.first_name} {user?.last_name}
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen((p) => !p)}
                className="flex items-center gap-1 cursor-pointer text-[#686c71] hover:text-[#111] transition-colors"
              >
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
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 1.97 2.92M4.93 4.93a10 10 0 0 0-1.97 2.92M4.93 19.07a10 10 0 0 1-2.92-1.97M19.07 19.07a10 10 0 0 0 2.92-1.97M12 2v2M12 20v2M2 12H4M20 12h2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 top-8 w-48 bg-white rounded shadow-lg z-50 overflow-hidden"
                  style={{ border: "1px solid #e2e5e8" }}
                >
                  {/* Profile header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3"
                    style={{ backgroundColor: "#fafafa66" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-black text-sm font-bold">
                      {user?.first_name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-zinc-800 text-[13px] font-medium">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="ml-auto cursor-pointer text-zinc-800 hover:text-zinc-600 transition-colors"
                      title="Logout"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
