import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useNotification';
import NotificationBell from '../NotificationBell';
import NotificationToast from '../NotificationToast';
import './Layout.css';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const estMedecin = user.role === 'medecin';

  const { notifications, nouvelle, marquerLues, fermerNouvelle } =
    useNotifications(estMedecin);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const classeLien = ({ isActive }) => (isActive ? 'lien actif' : 'lien');

  const initiales = user.nom
    .split(' ')
    .map(mot => mot[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app">
      {estMedecin && (
        <NotificationToast notification={nouvelle} onFermer={fermerNouvelle} />
      )}

      <aside className="sidebar">
        <div className="sidebar-logo">🩺 Cabinet Médical</div>

        <nav className="sidebar-nav">
          {estMedecin && <NavLink to="/dashboard" className={classeLien}>📊 Tableau de bord</NavLink>}
          <NavLink to="/patients" className={classeLien}>👥 Patients</NavLink>
          <NavLink to="/planning" className={classeLien}>📅 Planning</NavLink>
          <NavLink to="/dossiers" className={classeLien}>📁 Dossiers</NavLink>
          {estMedecin && <NavLink to="/assistants" className={classeLien}>🧑‍⚕️ Assistants</NavLink>}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>Déconnexion</button>
      </aside>

      <div className="contenu">
        <header className="topbar">
          <div className="topbar-droite">
            {estMedecin && (
              <NotificationBell notifications={notifications} onMarquerLues={marquerLues} />
            )}

            <div className="profil">
              <div className="avatar">{initiales}</div>
              <div>
                <div className="profil-nom">{user.nom}</div>
                <div className="profil-role">{estMedecin ? 'Médecin' : 'Assistant'}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;