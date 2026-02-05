'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Users, label: 'Candidates', path: '/candidates' },
  { icon: ClipboardList, label: 'Assessments', path: '/assessments' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string): boolean => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-[#f0f0f0]">
      {/* Header with Logo */}
      <div className="px-2 py-4">
        <Link href="/" className="block">
          <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#1f1687] rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">T</span>
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900 leading-tight">
                    Talent Flow
                  </h1>
                  <p className="text-xs text-gray-500 leading-tight">
                    hello@talentflow.com
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-0">
                <ChevronUp className="h-3 w-3 text-gray-400" />
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Line underneath */}
        <div className="border-t border-gray-200 mt-4"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center justify-start px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                  ${
                    active
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }
                `}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    active ? 'text-gray-700' : 'text-gray-500'
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer with Sign Out and Copyright */}
      <div className="px-4 pb-4">
        {/* Copyright Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2025 Talent Flow
          </p>
        </div>
      </div>
    </div>
  );
}
