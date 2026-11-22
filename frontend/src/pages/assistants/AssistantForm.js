import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

function AssistantForm() {
  const { id } = useParams();
  const modeEdition = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [erreurs, setErreurs] = useState({});
  const [chargement, setChargement] = useState(modeEdition);

  // F modifier: kanjibo l'assistant mn Laravel
  useEffect(() => {
    if (!modeEdition) return;

    api
      .get('/assistants/' + id)
      .then(res =>
        setForm({ nom: res.data.nom, email: res.data.email, password: '' })
      )
      .catch(() => navigate('/assistants'))
      .finally(() => setChargement(false));
  }, [id, modeEdition, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErreurs({});

    try {
      if (modeEdition) {
        await api.put('/assistants/' + id, form);
      } else {
        await api.post('/assistants', form);
      }
      navigate('/assistants');
    } catch (err) {
      // 422 = Laravel validation: { errors: { email: ['...'] } }
      if (err.response && err.response.status === 422) {
        const e422 = {};
        Object.entries(err.response.data.errors).forEach(([champ, messages]) => {
          e422[champ] = messages[0];
        });
        setErreurs(e422);
      } else {
        setErreurs({ general: 'Une erreur est survenue.' });
      }
    }
  };

  if (chargement) return <p>Chargement...</p>;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{modeEdition ? "Modifier l'assistant" : 'Ajouter un assistant'}</h2>

      <input className="champ" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
      {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}

      <input className="champ" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {erreurs.email && <p className="erreur">{erreurs.email}</p>}

      <input
        className="champ"
        name="password"
        type="password"
        placeholder={modeEdition ? 'Nouveau mot de passe (vide = inchangé)' : 'Mot de passe'}
        value={form.password}
        onChange={handleChange}
      />
      {erreurs.password && <p className="erreur">{erreurs.password}</p>}

      {erreurs.general && <p className="erreur">{erreurs.general}</p>}

      <div className="boutons">
        <button className="btn btn-primary" type="submit">
          {modeEdition ? 'Mettre à jour' : 'Enregistrer'}
        </button>
        <button className="btn" type="button" onClick={() => navigate('/assistants')}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default AssistantForm;