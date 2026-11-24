import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

function PatientList() {
  const { user } = useAuth();
  const estAssistant = user.role === 'assistant';

  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
     const timer = setTimeout(() => { api
        .get('/patients', { params: { recherche } })
        .then(res => setPatients(res.data))
        .catch(() => setErreur('Impossible de charger les patients.'))
        .finally(() => setChargement(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [recherche]);

  const supprimer = async id => {
    if (!window.confirm('Supprimer ce patient ?')) return;

    try {
      await api.delete('/patients/' + id);
      setPatients(patients.filter(p => p.id !== id));
    } catch (e) {
      setErreur('Suppression impossible.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Liste des patients</h2>
        {estAssistant && (
          <Link to="/patients/ajouter">
            <button className="btn btn-primary">+ Ajouter un patient</button>
          </Link>
        )}
      </div>

      <input
        className="recherche"
        placeholder="Rechercher un patient..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
      />

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="carte">
        {chargement ? (
          <p>Chargement...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Téléphone</th>
                  <th>Date de naissance</th>
                  <th>Genre</th>
                  {estAssistant && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>{p.nom}</td>
                    <td>{p.prenom}</td>
                    <td>{p.telephone}</td>
                    <td>{p.date_naissance}</td>
                    <td>{p.sexe}</td>
                    {estAssistant && (
                      <td>
                        <div className="actions">
                          <Link to={'/rendez-vous/ajouter/' + p.id}>
                            <button className="btn-icone" title="Prendre un rendez-vous">📅</button>
                          </Link>
                          <Link to={'/patients/modifier/' + p.id}>
                            <button className="btn-icone" title="Modifier">✏️</button>
                          </Link>
                          <button className="btn-icone" title="Supprimer" onClick={() => supprimer(p.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {patients.length === 0 && <p>Aucun patient trouvé.</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default PatientList;