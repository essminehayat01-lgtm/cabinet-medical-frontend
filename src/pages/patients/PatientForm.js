import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

function PatientForm() {
  const { id } = useParams();
  const modeEdition = Boolean(id);

  const { patients, ajouterPatient, modifierPatient } = useData();
  const navigate = useNavigate();

  const patient = modeEdition ? patients.find(p => p.id === Number(id)) : null;

  const [form, setForm] = useState(
    patient
      ? { ...patient }
      : { nom: '', prenom: '', sexe: '', dateNaissance: '', telephone: '', adresse: '' }
  );
  const [erreurs, setErreurs] = useState({});

  if (modeEdition && !patient) return <p>Patient introuvable.</p>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const valider = () => {
    const e = {};
    if (form.nom.trim().length < 2) e.nom = 'Nom obligatoire (2 caractères minimum)';
    if (form.prenom.trim().length < 2) e.prenom = 'Prénom obligatoire (2 caractères minimum)';
    if (!form.sexe) e.sexe = 'Sexe obligatoire';
    if (!form.dateNaissance) e.dateNaissance = 'Date de naissance obligatoire';
    if (!/^0\d{9}$/.test(form.telephone)) e.telephone = 'Téléphone invalide (10 chiffres, commence par 0)';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = valider();
    setErreurs(e2);
    if (Object.keys(e2).length > 0) return;

    if (modeEdition) {
      modifierPatient(patient.id, form);
      navigate('/patients');
    } else {
      const nouvelId = ajouterPatient(form);
      navigate('/rendez-vous/ajouter/' + nouvelId);
    }
  };

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

      <input className="champ" name="dateNaissance" type="date" value={form.dateNaissance} onChange={handleChange} />
      {erreurs.dateNaissance && <p className="erreur">{erreurs.dateNaissance}</p>}

      <input className="champ" name="telephone" placeholder="Téléphone" value={form.telephone} onChange={handleChange} />
      {erreurs.telephone && <p className="erreur">{erreurs.telephone}</p>}

      <input className="champ" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} />

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