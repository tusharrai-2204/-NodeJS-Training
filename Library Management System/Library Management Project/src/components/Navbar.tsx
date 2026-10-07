import { NavLink } from "react-router-dom";

interface NavbarProps {
  collapsed?: boolean;
}

const navItems = [
  { to: "/", label: "Home", icon: "⊞" },
  { to: "/books", label: "Books", icon: "📖" },
  { to: "/students", label: "Students", icon: "🎓" },
  { to: "/users", label: "Users", icon: "👤" },
];

const Navbar = ({ collapsed = false }: NavbarProps) => {
  return (
    <nav className="flex flex-col gap-1 p-2 pt-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`
          }
          title={collapsed ? item.label : undefined}
        >
          <span className="text-base shrink-0">{item.icon}</span>
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
