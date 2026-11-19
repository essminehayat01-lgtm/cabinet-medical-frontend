import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AssistantList() {
  const { assistants, supprimerAssistant } = useAuth();

  const supprimer = id => {
    if (window.confirm('Supprimer cet assistant ?')) {
      supprimerAssistant(id);
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
    </div>
  );
}

export default AssistantList;