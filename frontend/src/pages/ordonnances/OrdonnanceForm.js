import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const LIGNE_VIDE = { nom: '', dosage: '', duree: '' };

function OrdonnanceForm() {
  const { patientId } = useParams();
  const { patients, ajouterOrdonnance } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const patient = patients.find(p => p.id === Number(patientId));

  const [medicaments, setMedicaments] = useState([{ ...LIGNE_VIDE }]);
  const [remarques, setRemarques] = useState('');
  const [erreur, setErreur] = useState('');

  if (!patient) return <p>Patient introuvable.</p>;

  const changerLigne = (index, champ, valeur) => {
    setMedicaments(
      medicaments.map((m, i) => (i === index ? { ...m, [champ]: valeur } : m))
    );
  };

  const ajouterLigne = () => setMedicaments([...medicaments, { ...LIGNE_VIDE }]);

  const supprimerLigne = index => {
    setMedicaments(medicaments.filter((m, i) => i !== index));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const lignes = medicaments.filter(m => m.nom.trim() !== '');
    if (lignes.length === 0) {
      setErreur('Ajoutez au moins un médicament');
      return;
    }

    ajouterOrdonnance({
      patientId: patient.id,
      date: new Date().toLocaleDateString('en-CA'),
      medecinNom: user.nom,
      medicaments: lignes,
      remarques,
    });
    navigate('/dossiers/' + patient.id);
  };

  return (
    <form className="form form-large" onSubmit={handleSubmit}>
      <h2>Nouvelle ordonnance</h2>
      <p>
        Patient : <strong>{patient.nom} {patient.prenom}</strong>
      </p>

      <label>Médicaments</label>
      {medicaments.map((m, index) => (
        <div className="ligne-med" key={index}>
          <input
            className="champ"
            placeholder="Médicament"
            value={m.nom}
            onChange={e => changerLigne(index, 'nom', e.target.value)}
          />
          <input
            className="champ"
            placeholder="Dosage (ex: 1 cp x 3/jour)"
            value={m.dosage}
            onChange={e => changerLigne(index, 'dosage', e.target.value)}
          />
          <input
            className="champ"
            placeholder="Durée (ex: 7 jours)"
            value={m.duree}
            onChange={e => changerLigne(index, 'duree', e.target.value)}
          />
          <button
            type="button"
            className="btn btn-danger"
            disabled={medicaments.length === 1}
            onClick={() => supprimerLigne(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="btn" onClick={ajouterLigne}>
        + Ajouter un médicament
      </button>

      {erreur && <p className="erreur">{erreur}</p>}

      <label style={{ marginTop: 16 }}>Remarques (optionnel)</label>
      <textarea
        className="champ"
        rows="3"
        value={remarques}
        onChange={e => setRemarques(e.target.value)}
      />

      <div className="boutons">
        <button className="btn btn-primary" type="submit">Enregistrer</button>
        <button className="btn" type="button" onClick={() => navigate('/dossiers/' + patient.id)}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default OrdonnanceForm;