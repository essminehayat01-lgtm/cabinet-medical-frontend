import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

function PatientList() {
  const { patients, supprimerPatient } = useData();
  const { user } = useAuth();
  const estAssistant = user.role === 'assistant';
  const [recherche, setRecherche] = useState('');

  const resultats = patients.filter(p =>
    (p.nom + ' ' + p.prenom).toLowerCase().includes(recherche.toLowerCase())
  );

  const supprimer = id => {
    if (window.confirm('Supprimer ce patient ?')) {
      supprimerPatient(id);
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

      <div className="carte">
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
            {resultats.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.nom}</td>
                <td>{p.prenom}</td>
                <td>{p.telephone}</td>
                <td>{p.dateNaissance}</td>
                <td>{p.sexe || '—'}</td>
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

        {resultats.length === 0 && <p>Aucun patient trouvé.</p>}
      </div>
    </div>
  );
}

export default PatientList;