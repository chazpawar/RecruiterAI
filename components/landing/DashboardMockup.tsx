'use client';

import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText,
  Sun,
  UserPlus,
  Plus,
  TrendingUp,
  BarChart3
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Briefcase, label: 'Jobs', active: false },
  { icon: Users, label: 'Candidates', active: false },
  { icon: FileText, label: 'Assessments', active: false },
];

const stats = [
  { label: 'Total Jobs', value: '50', change: '+12%', changeLabel: 'from last month', icon: Briefcase },
  { label: 'Active Jobs', value: '39', change: '+8%', changeLabel: 'from last month', icon: TrendingUp },
  { label: 'Total Candidates', value: '2,000', change: '+24%', changeLabel: 'from last month', icon: Users },
  { label: 'Assessments', value: '666', change: '+16%', changeLabel: 'from last month', icon: FileText },
  { label: 'Reports', value: '2,050', change: '+5%', changeLabel: 'from last month', icon: BarChart3 },
];

export function DashboardMockup() {
  return (
    <div className="flex bg-background text-foreground text-xs">
      {/* Sidebar */}
      <div className="w-48 border-r border-border bg-card p-4 hidden sm:block">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-[#1a1a2e] rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">T</span>
          </div>
          <div>
            <div className="font-semibold text-xs">Talent Flow</div>
            <div className="text-[10px] text-muted-foreground">hello@talentflow.com</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-[11px] ${
                item.active 
                  ? 'bg-muted text-foreground font-medium' 
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className="size-3.5" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 min-h-[400px]">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[10px] text-muted-foreground">
            Dashboard / <span className="text-foreground">Overview</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-muted rounded">
              <Sun className="size-3.5 text-muted-foreground" />
            </button>
            <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:bg-muted px-2 py-1 rounded">
              <UserPlus className="size-3" />
              Add Candidate
            </button>
            <button className="flex items-center gap-1 text-[10px] bg-primary text-primary-foreground px-2 py-1 rounded">
              <Plus className="size-3" />
              Create Job
            </button>
          </div>
        </div>

        {/* Dashboard Title */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-[10px] text-muted-foreground">Overview of your hiring pipeline and recent activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                <stat.icon className="size-3.5 text-muted-foreground" />
              </div>
              <div className="text-xl font-semibold">{stat.value}</div>
              <div className="text-[9px] text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> {stat.changeLabel}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Workforce Overview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium">Workforce Overview</h3>
                <p className="text-[10px] text-muted-foreground">Track employee growth and attrition trends over time.</p>
              </div>
              <div className="flex gap-1 text-[10px]">
                <button className="px-2 py-1 bg-muted rounded text-foreground">Monthly</button>
                <button className="px-2 py-1 text-muted-foreground hover:bg-muted rounded">Yearly</button>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="h-24 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 65, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/80 rounded-t"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Pipeline Overview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-sm font-medium">Pipeline Overview</h3>
              <p className="text-[10px] text-muted-foreground">Distribution of employees by status and department.</p>
            </div>
            {/* Pie Chart Placeholder */}
            <div className="flex items-center justify-center h-24">
              <div className="relative size-20">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="62.8 188.4" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="50.2 188.4" strokeDashoffset="-62.8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#a5d8ff" strokeWidth="20" strokeDasharray="37.7 188.4" strokeDashoffset="-113" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#d0bcff" strokeWidth="20" strokeDasharray="38 188.4" strokeDashoffset="-150.7" />
                </svg>
              </div>
              <div className="ml-4 space-y-1 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>Applied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#8b5cf6]" />
                  <span>Screening</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#a5d8ff]" />
                  <span>Interview</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#d0bcff]" />
                  <span>Offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
