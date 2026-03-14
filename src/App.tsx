import { useEffect, useState } from 'react';
import { useAuth } from './lib/supabase-auth';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectCreation } from './components/ProjectCreation';
import { Profile } from './components/Profile';
import { Landing } from './components/Landing';
import { AdminDashboard } from './components/AdminDashboard';
import { Settings } from './components/Settings';
import { defaultLandingContent, LandingContent } from './data/landingContent';
import { projectApi, accessRequestApi } from './lib/supabase-api';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type ProjectStatus = 'public' | 'locked' | 'approved';

export interface TeamMember {
  name: string;
  email: string;
  contribution: string;
}

export interface Project {
  id: string;
  title: string;
  abstract: string;
  domains: string[];
  year: string;
  license: string;
  techStack: string[];
  status: ProjectStatus;
  owner: string;
  ownerId: string;
  teamMembers: TeamMember[];
  createdAt: string;
  lastUpdated: string;
  approvedFacultyIds?: string[];
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface AccessRequest {
  id: string;
  projectId: string;
  facultyId: string;
  facultyName: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}

export type ViewType = 'dashboard' | 'project-detail' | 'create-project' | 'profile' | 'settings';

function AppContent() {
  const { user: authUser, loading, logout, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [landingContent, setLandingContent] = useState<LandingContent>(defaultLandingContent);
  const [, setAllUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const currentUser: User | null = authUser
    ? {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
      }
    : null;

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setDataLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setDataLoading(true);
      const [projectsRes, requestsRes] = await Promise.all([
        projectApi.listAllProjects(),
        accessRequestApi.listAccessRequests().catch(() => ({ data: [] })),
      ]);

      const transformedProjects = projectsRes.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        abstract: p.abstract,
        domains: p.domains || [],
        year: p.year,
        license: p.license,
        techStack: p.tech_stack || [],
        status: p.status,
        owner: p.owner_name,
        ownerId: p.owner_id,
        teamMembers: p.team_members || [],
        createdAt: p.created_at,
        lastUpdated: p.updated_at,
        approvedFacultyIds: p.approved_faculty_ids || [],
        approvalStatus: p.approval_status,
      }));

      const transformedRequests = requestsRes.data.map((r: any) => ({
        id: r.id,
        projectId: r.project_id,
        facultyId: r.faculty_id,
        facultyName: r.faculty_name,
        status: r.status,
        timestamp: r.created_at,
      }));

      setProjects(transformedProjects);
      setAccessRequests(transformedRequests);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: ViewType, projectId?: string) => {
    setCurrentView(view);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, { ...project, approvalStatus: 'pending' }]);
    setCurrentView('dashboard');
    fetchData();
  };

  const handleRequestAccess = async (projectId: string) => {
    if (!currentUser) return;
    try {
      await projectApi.requestAccess(projectId);
      await fetchData();
    } catch (error) {
      console.error('Failed to request access:', error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const request = accessRequests.find(r => r.id === requestId);
      if (request) {
        await projectApi.approveAccess(request.projectId, requestId);
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const request = accessRequests.find(r => r.id === requestId);
      if (request) {
        await projectApi.rejectAccess(request.projectId, requestId);
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (!showLogin) {
      return <Landing onGetStarted={() => setShowLogin(true)} content={landingContent} />;
    }
    return <Login onLogin={() => setShowLogin(false)} onBack={() => setShowLogin(false)} />;
  }

  if (!currentUser) {
    return <Landing onGetStarted={() => setShowLogin(true)} content={landingContent} />;
  }

  // Admin view
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard
        user={currentUser}
        landingContent={landingContent}
        onUpdateContent={setLandingContent}
        onLogout={handleLogout}
      />
    );
  }

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'dashboard' && (
        <Dashboard
          user={currentUser}
          projects={projects}
          setProjects={setProjects}
          accessRequests={accessRequests}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}
      
      {currentView === 'create-project' && (
        <ProjectCreation
          user={currentUser}
          projects={projects}
          accessRequests={accessRequests}
          onNavigate={handleNavigate}
          onCreateProject={handleCreateProject}
          onLogout={handleLogout}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}

      {currentView === 'project-detail' && selectedProject && (
        <ProjectDetail
          user={currentUser}
          project={selectedProject}
          projects={projects}
          accessRequests={accessRequests}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onRequestAccess={handleRequestAccess}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}

      {currentView === 'profile' && (
        <Profile
          user={currentUser}
          projects={projects}
          accessRequests={accessRequests}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}

      {currentView === 'settings' && (
        <Settings
          user={currentUser}
          projects={projects}
          accessRequests={accessRequests}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
        />
      )}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;