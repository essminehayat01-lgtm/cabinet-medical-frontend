import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

function DossierList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      api
        .get('/patients', { params: { recherche } })
        .then(res => setPatients(res.data))
        .catch(() => setErreur('Impossible de charger les dossiers.'))
        .finally(() => setChargement(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [recherche]);
  const estRenseigne = patient => {
    const d = patient.dossier;
    return Boolean(d && (d.groupe_sanguin || d.allergies || d.antecedents || d.notes));
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

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="carte">
        {chargement ? (
          <p>Chargement...</p>
        ) : (
          <>
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
                {patients.map(p => (
                  <tr
                    key={p.id}
                    className="ligne-cliquable"
                    onClick={() => navigate('/dossiers/' + p.id)}
                  >
                    <td>{p.nom}</td>
                    <td>{p.prenom}</td>
                    <td>{p.telephone}</td>
                    <td>
                      {estRenseigne(p) ? (
                        <span className="badge badge-ok">Renseigné</span>
                      ) : (
                        <span className="badge badge-attente">À compléter</span>
                      )}
                    </td>
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

export default DossierList;