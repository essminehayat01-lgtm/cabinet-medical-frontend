import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const VIDE = { nom: '', prenom: '', sexe: '', date_naissance: '', telephone: '', adresse: '' };

function PatientForm() {
  const { id } = useParams();
  const modeEdition = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(VIDE);
  const [erreurs, setErreurs] = useState({});
  const [chargement, setChargement] = useState(modeEdition);

  useEffect(() => {
    if (!modeEdition) return;

    api
      .get('/patients/' + id)
      .then(res =>
        setForm({
          nom: res.data.nom,
          prenom: res.data.prenom,
          sexe: res.data.sexe,
          date_naissance: res.data.date_naissance,
          telephone: res.data.telephone,
          adresse: res.data.adresse || '',
        })
      )
      .catch(() => navigate('/patients'))
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
        await api.put('/patients/' + id, form);
        navigate('/patients');
      } else {
        const res = await api.post('/patients', form);
        navigate('/rendez-vous/ajouter/' + res.data.id);
      }
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const erreursLaravel = {};
        Object.entries(err.response.data.errors).forEach(([champ, messages]) => {
          erreursLaravel[champ] = messages[0];
        });
        setErreurs(erreursLaravel);
      } else {
        setErreurs({ general: 'Une erreur est survenue.' });
      }
    }
  };

  if (chargement) return <p>Chargement...</p>;

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{modeEdition ? 'Modifier le patient' : 'Ajouter un patient'}</h2>

      <input className="champ" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} />
      {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}

      <input className="champ" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} />
      {erreurs.prenom && <p className="erreur">{erreurs.prenom}</p>}

      <select className="champ" name="sexe" value={form.sexe} onChange={handleChange}>
        <option value="">-- Sexe --</option>
        <option value="F">Femme</option>
        <option value="M">Homme</option>
      </select>
      {erreurs.sexe && <p className="erreur">{erreurs.sexe}</p>}

      <input className="champ" name="date_naissance" type="date" value={form.date_naissance} onChange={handleChange} />
      {erreurs.date_naissance && <p className="erreur">{erreurs.date_naissance}</p>}

      <input className="champ" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
      {erreurs.telephone && <p className="erreur">{erreurs.telephone}</p>}

      <input className="champ" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />
      {erreurs.adresse && <p className="erreur">{erreurs.adresse}</p>}

      {erreurs.general && <p className="erreur">{erreurs.general}</p>}

      <div className="boutons">
        <button className="btn btn-primary" type="submit">
          {modeEdition ? 'Mettre à jour' : 'Enregistrer'}
        </button>
        <button className="btn" type="button" onClick={() => navigate('/patients')}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default PatientForm;