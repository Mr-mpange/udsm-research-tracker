import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop nav embedded in header */}
      <nav className="bg-navy-dark border-b border-primary/30">
        <div className="container mx-auto px-4 flex items-center justify-between h-10">
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans-ui transition-colors ${
                  pathname === item.path
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary/50"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="sm:hidden text-primary-foreground/70 hover:text-primary-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[2000] sm:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-primary shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-primary/30">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent overflow-hidden flex items-center justify-center">
                  <img src="/favicon.jpeg" alt="UDSM Logo" className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-bold text-primary-foreground">UDSM</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-primary-foreground/70">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-3 space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-sans-ui transition-colors ${
                    pathname === item.path
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-primary-foreground/80 hover:bg-primary/50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-primary/30">
              <p className="text-xs text-primary-foreground/50 font-sans-ui">
                University of Dar es Salaam
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
