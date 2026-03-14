import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Lock, CheckCircle, Globe } from 'lucide-react';
import { User, Project, AccessRequest, ViewType } from '../App';
import { Sidebar } from './Sidebar';
import { NotificationPanel } from './NotificationPanel';
import { mockProjects } from '../data/mockData';

interface DashboardProps {
  user: User;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  accessRequests: AccessRequest[];
  onNavigate: (view: ViewType, projectId?: string) => void;
  onLogout: () => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export function Dashboard({
  user,
  projects,
  setProjects,
  accessRequests,
  onNavigate,
  onLogout,
  onApproveRequest,
  onRejectRequest,
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize with mock data on first load
  useEffect(() => {
    if (projects.length === 0) {
      setProjects(mockProjects);
    }
  }, []);

  // Get pending requests for the current student
  const pendingRequests = accessRequests.filter(
    req => req.status === 'pending' && 
    projects.find(p => p.id === req.projectId && p.ownerId === user.id)
  );

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDomain = selectedDomain === 'All' || project.domains.includes(selectedDomain);
    const matchesYear = selectedYear === 'All' || project.year === selectedYear;
    
    return matchesSearch && matchesDomain && matchesYear;
  });

  const allDomains = ['All', ...new Set(projects.flatMap(p => p.domains))];
  const allYears = ['All', ...new Set(projects.map(p => p.year))];

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <Globe className="w-3 h-3" />
            Public
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <Lock className="w-3 h-3" />
            Access Locked
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        user={user}
        currentView="dashboard"
        notificationCount={pendingRequests.length}
        onNavigate={(view) => {
          if (view === 'notifications') {
            setShowNotifications(!showNotifications);
          } else {
            onNavigate(view);
          }
        }}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Project Explorer</h2>
              <p className="text-slate-600 mt-1">
                Discover and collaborate on academic projects
              </p>
            </div>
            {user.role === 'student' && (
              <button
                onClick={() => onNavigate('create-project')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
            )}
          </div>
        </header>

        {/* Search and Filters */}
        <div className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, domain, or tech stack..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>

            {/* Domain Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white appearance-none"
              >
                {allDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white appearance-none"
              >
                {allYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No projects found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  onClick={() => onNavigate('project-detail', project.id)}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-slate-800 text-lg flex-1">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {project.abstract}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.domains.map(domain => (
                      <span
                        key={domain}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md font-medium"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <span>{project.year}</span>
                    <span>{project.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationPanel
          user={user}
          accessRequests={accessRequests}
          projects={projects}
          onApprove={onApproveRequest}
          onReject={onRejectRequest}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}