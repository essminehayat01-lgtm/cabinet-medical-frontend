import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { patients, rendezVous } = useData();
  const { user } = useAuth();
  const aujourdhui = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const dateAffichee = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const planifies = rendezVous.filter(r => r.statut === 'planifié');

  const rdvAujourdhui = planifies
    .filter(r => r.date === aujourdhui)
    .sort((a, b) => a.heure.localeCompare(b.heure));

  const creneauxLibres = rendezVous.filter(
    r => r.statut === 'libre' && r.date >= aujourdhui
  ).length;

  const recents = [...patients].sort((a, b) => b.id - a.id).slice(0, 4);

  const nomPatient = id => {
    const p = patients.find(p => p.id === id);
    return p ? p.nom + ' ' + p.prenom : '—';
  };

  const initiales = p => (p.prenom[0] + p.nom[0]).toUpperCase();

  return (
    <div>
      <h2>Bonjour, {user.nom}</h2>

      <div className="stats">
        <StatCard valeur={patients.length} libelle="Patients" />
        <StatCard valeur={rdvAujourdhui.length} libelle="RDV aujourd'hui" />
        <StatCard valeur={creneauxLibres} libelle="Créneaux libres" />
      </div>

      <div className="dashboard-grille">
        <div className="carte">
          <div className="carte-entete">
            <h3>Planning du jour</h3>
            <span className="date-jour">{dateAffichee}</span>
          </div>

          {rdvAujourdhui.length === 0 && <p className="vide">Aucun rendez-vous aujourd'hui.</p>}

          {rdvAujourdhui.map(r => (
            <div className="ligne" key={r.id}>
              <span className="heure">{r.heure}</span>
              <div>
                <Link to={'/dossiers/' + r.patientId} className="ligne-titre">
                  {nomPatient(r.patientId)}
                </Link>
                <div className="ligne-detail">{r.motif || 'Consultation'}</div>
              </div>
            </div>
          ))}

          <Link to="/planning" className="carte-lien">Voir tout le planning →</Link>
        </div>

        <div className="carte">
          <div className="carte-entete">
            <h3>Patients récents</h3>
          </div>

          {recents.map(p => (
            <div className="ligne" key={p.id}>
              <div className="avatar">{initiales(p)}</div>
              <div>
                <div className="ligne-titre">{p.nom} {p.prenom}</div>
                <div className="ligne-detail">Ajouté le {p.creeLe} · {p.telephone}</div>
              </div>
            </div>
          ))}

          <Link to="/patients" className="carte-lien">Voir tous les patients →</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;