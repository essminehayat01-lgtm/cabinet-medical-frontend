import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function AssistantForm() {
  const { id } = useParams();
  const modeEdition = Boolean(id);

  const { users, ajouterAssistant, modifierAssistant } = useAuth();
  const navigate = useNavigate();

  const assistant = modeEdition
    ? users.find(u => u.id === Number(id) && u.role === 'assistant')
    : null;

  const [form, setForm] = useState(
    assistant
      ? { nom: assistant.nom, email: assistant.email, password: '' }
      : { nom: '', email: '', password: '' }
  );
  const [erreurs, setErreurs] = useState({});

  if (modeEdition && !assistant) return <p>Assistant introuvable.</p>;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const valider = () => {
    const e = {};
    const idCourant = assistant ? assistant.id : null;

    if (form.nom.trim().length < 3) e.nom = 'Nom obligatoire (3 caractères minimum)';

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Email invalide';
    } else if (users.some(u => u.email === form.email && u.id !== idCourant)) {
      e.email = 'Cet email est déjà utilisé';
    }

    if (!modeEdition && form.password.length < 8) {
      e.password = 'Mot de passe obligatoire (8 caractères minimum)';
    }
    if (modeEdition && form.password && form.password.length < 8) {
      e.password = 'Mot de passe trop court (8 caractères minimum)';
    }
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = valider();
    setErreurs(e2);
    if (Object.keys(e2).length > 0) return;

    if (modeEdition) {
      const data = { nom: form.nom, email: form.email };
      if (form.password) data.password = form.password; // ghir ila ktb wa7ed jdid
      modifierAssistant(assistant.id, data);
    } else {
      ajouterAssistant(form);
    }
    navigate('/assistants');
  };

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