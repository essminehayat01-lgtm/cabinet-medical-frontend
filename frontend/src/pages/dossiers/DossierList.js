import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

function DossierList() {
  const { patients, dossiers } = useData();
  const navigate = useNavigate();
  const [recherche, setRecherche] = useState('');

  const resultats = patients.filter(p =>
    (p.nom + ' ' + p.prenom).toLowerCase().includes(recherche.toLowerCase())
  );

  const estRenseigne = patientId => {
    const d = dossiers.find(d => d.patientId === patientId);
    return Boolean(d && (d.groupeSanguin || d.allergies || d.antecedents || d.notes));
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dossiers médicaux</h2>
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
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Dossier</th>
            </tr>
          </thead>
          <tbody>
            {resultats.map(p => (
              <tr
                key={p.id}
                className="ligne-cliquable"
                onClick={() => navigate('/dossiers/' + p.id)}
              >
                <td>{p.nom}</td>
                <td>{p.prenom}</td>
                <td>{p.telephone}</td>
                <td>
                  {estRenseigne(p.id) ? (
                    <span className="badge badge-ok">Renseigné</span>
                  ) : (
                    <span className="badge badge-attente">À compléter</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resultats.length === 0 && <p>Aucun patient trouvé.</p>}
      </div>
    </div>
  );
}

export default DossierList;