import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Building2, Users, Menu, X } from 'lucide-react';
import { Toaster } from 'sonner';
import { cn } from '../utils/cn';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Departments', href: '/departments', icon: Building2 },
    { name: 'Employees', href: '/employees', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <span className="font-bold text-lg text-slate-900">WorkForceHub</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-500 p-2"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center shadow-sm shadow-primary-500/20">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">WorkForceHub</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
