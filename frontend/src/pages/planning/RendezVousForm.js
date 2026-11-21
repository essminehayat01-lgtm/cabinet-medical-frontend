import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

function RendezVousForm() {
  const { patientId } = useParams();
  const { patients, rendezVous, reserverRendezVous } = useData();
  const navigate = useNavigate();

  const [choisi, setChoisi] = useState(null);
  const [motif, setMotif] = useState('');
  const [erreur, setErreur] = useState('');

  const patient = patients.find(p => p.id === Number(patientId));
  if (!patient) return <p>Patient introuvable.</p>;

  const libres = rendezVous
    .filter(r => r.statut === 'libre')
    .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  const handleSubmit = e => {
    e.preventDefault();
    if (choisi === null) {
      setErreur('Veuillez choisir un créneau');
      return;
    }
    reserverRendezVous(choisi, patient.id, motif);
    navigate('/planning');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Choisir un rendez-vous</h2>
      <p>Patient : <strong>{patient.nom} {patient.prenom}</strong></p>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th></th><th>Date</th><th>Heure</th></tr>
        </thead>
        <tbody>
          {libres.map(c => (
            <tr key={c.id}>
              <td>
                <input
                  type="radio"
                  name="creneau"
                  checked={choisi === c.id}
                  onChange={() => setChoisi(c.id)}
                />
              </td>
              <td>{c.date}</td>
              <td>{c.heure}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {libres.length === 0 && <p>Aucun créneau libre.</p>}
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}

      <p>
        <input
          placeholder="Motif (optionnel)"
          value={motif}
          onChange={e => setMotif(e.target.value)}
          style={{ padding: 6, width: 300 }}
        />
      </p>

      <button type="submit">Enregistrer</button>
      <button type="button" onClick={() => navigate('/patients')} style={{ marginLeft: 10 }}>
        Plus tard
      </button>
    </form>
  );
}

export default RendezVousForm;