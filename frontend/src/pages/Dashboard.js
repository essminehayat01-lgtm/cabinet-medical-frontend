import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import StatCard from '../components/common/StatCard';
import './Dashboard.css';

const initiales = p => (p.prenom[0] + p.nom[0]).toUpperCase();

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api
      .get('/dashboard')
      .then(res => setStats(res.data))
      .catch(() => setErreur('Impossible de charger le tableau de bord.'));
  }, []);

  const dateAffichee = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (erreur) return <p className="erreur">{erreur}</p>;
  if (!stats) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Tableau de bord</h2>

      <div className="stats">
        <StatCard valeur={stats.total_patients} libelle="Patients" />
        <StatCard valeur={stats.rdv_aujourdhui} libelle="RDV aujourd'hui" />
        <StatCard valeur={stats.creneaux_libres} libelle="Créneaux libres (cette semaine)" />
      </div>

      <div className="dashboard-grille">
        <div className="carte">
          <div className="carte-entete">
            <h3>Planning du jour</h3>
            <span className="date-jour">{dateAffichee}</span>
          </div>

          {stats.planning_du_jour.length === 0 && (
            <p className="vide">Aucun rendez-vous aujourd'hui.</p>
          )}

          {stats.planning_du_jour.map(r => (
            <div className="ligne" key={r.id}>
              <span className="heure">{r.heure}</span>
              <div>
                <Link to={'/dossiers/' + r.patient_id} className="ligne-titre">
                  {r.patient ? r.patient.nom + ' ' + r.patient.prenom : '—'}
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

          {stats.patients_recents.length === 0 && <p className="vide">Aucun patient.</p>}

          {stats.patients_recents.map(p => (
            <div className="ligne" key={p.id}>
              <div className="avatar">{initiales(p)}</div>
              <div>
                <div className="ligne-titre">{p.nom} {p.prenom}</div>
                <div className="ligne-detail">
                  Ajouté le {p.created_at.slice(0, 10)} · {p.telephone}
                </div>
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