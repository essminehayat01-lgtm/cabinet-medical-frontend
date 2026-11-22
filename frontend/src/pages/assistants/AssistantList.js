import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

function AssistantList() {
  const [assistants, setAssistants] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api
      .get('/assistants')
      .then(res => setAssistants(res.data))
      .catch(() => setErreur('Impossible de charger les assistants.'))
      .finally(() => setChargement(false));
  }, []);

  const supprimer = async id => {
    if (!window.confirm('Supprimer cet assistant ?')) return;

    try {
      await api.delete('/assistants/' + id);
      setAssistants(assistants.filter(a => a.id !== id));
    } catch (e) {
      setErreur('Suppression impossible.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Gestion des assistants</h2>
        <Link to="/assistants/ajouter">
          <button className="btn btn-primary">+ Ajouter un assistant</button>
        </Link>
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="carte">
        {chargement ? (
          <p>Chargement...</p>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th><th>Email</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assistants.map(a => (
                  <tr key={a.id}>
                    <td>{a.nom}</td>
                    <td>{a.email}</td>
                    <td>
                      <div className="actions">
                        <Link to={'/assistants/modifier/' + a.id}>
                          <button className="btn">Modifier</button>
                        </Link>
                        <button className="btn btn-danger" onClick={() => supprimer(a.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {assistants.length === 0 && <p>Aucun assistant.</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default AssistantList;