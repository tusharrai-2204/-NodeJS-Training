import { useUIStore } from "@/store/uiStore";
import Navbar from "./Navbar";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-lg">📚</span>
          <span className="font-semibold text-sm tracking-tight">Library Management</span>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary uppercase">
                {user.first_name?.charAt(0)}
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">{user.first_name} {user.last_name}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        <aside
          className={`border-r border-border bg-card/30 transition-all duration-300 flex flex-col shrink-0 ${
            sidebarCollapsed ? "w-14" : "w-52"
          }`}
        >
          <button
            type="button"
            onClick={toggleSidebar}
            className="h-12 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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

          <div className="flex-1 overflow-hidden">
            <Navbar collapsed={sidebarCollapsed} />
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
