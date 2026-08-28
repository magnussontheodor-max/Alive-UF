import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Hem', end: true },
  { to: '/ova', label: 'Öva' },
  { to: '/repetition', label: 'Repetition' },
  { to: '/prov', label: 'Provsimulering' },
  { to: '/statistik', label: 'Statistik' },
];

export function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-bold text-brand-700">
            📚 Pluggmotorn
          </NavLink>
          <nav className="flex gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 font-medium transition ${
                    isActive
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Pluggmotorn för Högskoleprovets kvantitativa del · övningsfrågorna är exempel, inte
        skarpa provfrågor
      </footer>
    </div>
  );
}
