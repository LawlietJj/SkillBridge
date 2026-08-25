import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/skill-path', label: 'Skill Path' },
    { path: '/mentors', label: 'Mentors' },
    { path: '/projects', label: 'Projects' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <span className="text-xl font-bold text-slate-900">SkillBridge bb</span>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium ${
              location.pathname === link.path
                ? 'text-slate-900 border-b-2 border-slate-900 pb-1'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;