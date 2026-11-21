import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => { e.preventDefault();
    const ok = login(form.email, form.password);
    if (ok) {
      navigate('/');
    } else {
      setErreur('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="auth-fond">
      <div className="auth-carte">
        <div className="auth-logo">🩺</div>
        <h1 className="auth-titre">Cabinet Médical</h1>
        <p className="auth-sous-titre">Connectez-vous à votre espace</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            className="champ"
            name="email"
            type="email"
            placeholder="Saisir votre email "
            onChange={handleChange}
          />

          <label>Mot de passe</label>
          <input
            className="champ"
            name="password"
            type="password"
            placeholder="Votre mot de passe"
            onChange={handleChange}
          />

          {erreur && <p className="erreur">{erreur}</p>}

          <button className="btn btn-primary btn-bloc" type="submit">
            Se connecter
          </button>
        </form>

        <p className="auth-separateur">Pas encore de compte ?</p>
        <Link to="/register" className="btn btn-bloc auth-creer">
          Créer un compte
        </Link>
      </div>
    </div>
  );
}

export default Login;