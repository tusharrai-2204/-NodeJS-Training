import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const stats = [
  { label: "Books", description: "Browse and manage the full catalog", icon: "📖", to: "/books" },
  { label: "Students", description: "View enrolled student records", icon: "🎓", to: "/students" },
  { label: "Books Issued", description: "Explore books issued to students", icon: "📋", to: "/issues" },
];

const Home = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-10">
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border p-8 md:p-12">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative space-y-3 max-w-xl">
          <p className="text-sm text-primary font-medium tracking-wide uppercase">Library Management System</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {user ? `Welcome back, ${user.first_name}` : "Welcome"}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Manage your library catalog, track students, and explore user data — all in one place.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </button>
            <button
              type="button"
              onClick={() => navigate("/students")}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
            >
              View Students
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <button
              key={stat.to}
              type="button"
              onClick={() => navigate(stat.to)}
              className="group text-left rounded-xl bg-card border border-border p-5 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl group-hover:bg-primary/20 transition-colors">
                {stat.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
