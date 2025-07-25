import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Package, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  User,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { clsx } from 'clsx';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      gradient: 'from-purple-500 to-pink-600'
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-72 sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl shadow-lg animation-glow">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Inventory Pro
                </h1>
                <p className="text-xs text-white/60">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'nav-link group',
                    isActive && 'active'
                  )}
                >
                  <div className={clsx(
                    'p-2 rounded-lg mr-3 transition-all duration-200',
                    isActive 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                      : 'bg-white/10 group-hover:bg-white/20'
                  )}>
                    <item.icon className={clsx(
                      'h-5 w-5',
                      isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                    )} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto">
                      <Sparkles className="h-4 w-4 text-purple-400" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{user?.username}</p>
                <p className="text-xs text-white/60">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="h-4 w-4 text-white/60 group-hover:text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="header px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-white/60">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 