import { useState } from 'react';
import { Header } from '../Header/Header';
import { SideMenu } from '../SideMenu/SideMenu';
import { DashboardSection } from '../DashboardSection/DashboardSection';
import { ProjectsPage } from '../ProjectsPage/ProjectsPage';
import { ProjectDataPage } from '../ProjectDataPage/ProjectDataPage';
import { useAppSection } from '../../hooks/useAppSection';
import { useAuth } from '../../hooks/useAuth';
import './AppShell.css';

export function AppShell() {
  const { user, logout } = useAuth();
  const { section, setSection } = useAppSection();
  const [collapsed, setCollapsed] = useState(false);
  // Bumping this key remounts the active section, forcing a clean data refetch.
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((key) => key + 1);

  return (
    <div className="app-shell">
      <Header user={user} onRefresh={refresh} onLogout={logout} />
      <div className="app-shell__body">
        <SideMenu
          section={section}
          onSelect={setSection}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <main className="app-shell__content" key={refreshKey}>
          {section === 'dashboard' ? <DashboardSection /> : null}
          {section === 'projects' ? <ProjectsPage /> : null}
          {section === 'project-data' ? <ProjectDataPage /> : null}
        </main>
      </div>
    </div>
  );
}
