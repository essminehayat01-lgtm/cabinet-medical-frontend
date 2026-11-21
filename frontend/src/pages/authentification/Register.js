import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const { users, inscrireMedecin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    confirmation: '',
  });
  const [erreurs, setErreurs] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const valider = () => {
    const e = {};

    if (form.nom.trim().length < 3) e.nom = 'Nom obligatoire (3 caractères minimum)';

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      e.email = 'Email invalide';
    } else if (users.some(u => u.email === form.email)) {
      e.email = 'Cet email est déjà utilisé';
    }

    if (form.password.length < 8) e.password = 'Mot de passe obligatoire (8 caractères minimum)';

    if (form.confirmation !== form.password) e.confirmation = 'Les mots de passe ne correspondent pas';

    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = valider();
    setErreurs(e2);
    const erreur = e2.nom ||e2.email||e2.password||e2.confirmation;
    if (erreur) return;

    inscrireMedecin({ nom: form.nom, email: form.email, password: form.password });
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Inscription médecin</h2>

        <input className="champ" name="nom" placeholder="Nom complet" value={form.nom} onChange={handleChange} />
        {erreurs.nom && <p className="erreur">{erreurs.nom}</p>}

        <input className="champ" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {erreurs.email && <p className="erreur">{erreurs.email}</p>}

        <input className="champ" name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} />
        {erreurs.password && <p className="erreur">{erreurs.password}</p>}

        <input className="champ" name="confirmation" type="password" placeholder="Confirmer le mot de passe" value={form.confirmation} onChange={handleChange} />
        {erreurs.confirmation && <p className="erreur">{erreurs.confirmation}</p>}

        <div className="boutons">
          <button className="btn btn-primary" type="submit">S'inscrire</button>
        </div>

        <p className="lien-auth">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;