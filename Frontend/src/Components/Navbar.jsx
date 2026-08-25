import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GitBranch,
  Users,
  FolderKanban,
  LogOut,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    {
      path: "/skill-path",
      label: "Skill Path",
      icon: <GitBranch size={17} />,
    },
    {
      path: "/mentors",
      label: "Mentors",
      icon: <Users size={17} />,
    },
    {
      path: "/projects",
      label: "Projects",
      icon: <FolderKanban size={17} />,
    },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold">
            SB
          </div>

          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-900">
              SkillBridge
            </h1>
            <p className="text-xs text-slate-500">
              Learning Graph
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;