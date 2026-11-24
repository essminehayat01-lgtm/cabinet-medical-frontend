import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const HORIZON_JOURS = 180;

const formater = d => d.toLocaleDateString('en-CA'); // YYYY-MM-DD

function RendezVousForm() {
  const { patientId, rdvId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const modeModification = Boolean(rdvId);
  const rdvActuel = location.state ? location.state.rdv : null;

  const [patient, setPatient] = useState(null);
  const [date, setDate] = useState('');
  const [creneaux, setCreneaux] = useState([]);
  const [choisi, setChoisi] = useState(null);
  const [motif, setMotif] = useState(rdvActuel ? rdvActuel.motif || '' : '');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (modeModification && !rdvActuel) navigate('/planning');
  }, [modeModification, rdvActuel, navigate]);

  useEffect(() => {
    if (modeModification) {
      if (rdvActuel) setPatient(rdvActuel.patient);
      return;
    }

    api
      .get('/patients/' + patientId)
      .then(res => setPatient(res.data))
      .catch(() => navigate('/patients'));
  }, [modeModification, rdvActuel, patientId, navigate]);

    useEffect(() => {
    if (!date) {
      setCreneaux([]);
      return;
    }

    setChargement(true);
    setChoisi(null);

    api
      .get('/rendez-vous', { params: { du: date, au: date, statut: 'libre' } })
      .then(res => setCreneaux(res.data))
      .catch(() => setErreur('Impossible de charger les créneaux.'))
      .finally(() => setChargement(false));
  }, [date]);

  if (!patient) return <p>Chargement...</p>;

  const aujourdhui = new Date();
  const limite = new Date();
  limite.setDate(limite.getDate() + HORIZON_JOURS);

  const jourSemaine = date ? new Date(date + 'T12:00:00').getDay() : null;
  const weekend = jourSemaine === 0 || jourSemaine === 6;

  const handleSubmit = async e => {
    e.preventDefault();
    setErreur('');
    if (!choisi && !modeModification) {
      setErreur('Veuillez choisir un créneau');
      return;
    }

    try {
      if (modeModification) {
        await api.put('/rendez-vous/' + rdvId, { creneau_id: choisi, motif });
      } else {
        await api.post('/rendez-vous/' + choisi + '/reserver', {
          patient_id: patient.id,
          motif,
        });
      }
      navigate('/planning');
    } catch (err) {
      const erreursLaravel = err.response && err.response.data && err.response.data.errors;
      setErreur(erreursLaravel ? Object.values(erreursLaravel)[0][0] : 'Une erreur est survenue.');
    }
  };

  return (
    <form className="carte rdv-form" onSubmit={handleSubmit}>
      <h2>{modeModification ? 'Modifier le rendez-vous' : 'Choisir un rendez-vous'}</h2>
      <p>
        Patient : <strong>{patient.nom} {patient.prenom}</strong>
      </p>

      {modeModification && (
        <p>
          Rendez-vous actuel : <strong>{rdvActuel.date} à {rdvActuel.heure}</strong>
        </p>
      )}

      <label>{modeModification ? 'Nouvelle date (optionnel)' : 'Date'}</label>
      <input
        className="recherche"
        type="date"
        value={date}
        min={formater(aujourdhui)}
        max={formater(limite)}
        onChange={e => setDate(e.target.value)}
      />

      {chargement && <p>Chargement...</p>}

      {date && !chargement && weekend && <p>Le cabinet est fermé le week-end.</p>}

      {date && !chargement && !weekend && creneaux.length === 0 && (
        <p>Aucun créneau libre ce jour-là.</p>
      )}

      <div className="creneaux">
        {creneaux.map(c => (
          <button
            type="button"
            key={c.id}
            className={choisi === c.id ? 'creneau actif' : 'creneau'}
            onClick={() => setChoisi(c.id)}
          >
            {c.heure}
          </button>
        ))}
      </div>

      <div className="form">
        <input
          className="champ"
          placeholder="Motif (optionnel)"
          value={motif}
          onChange={e => setMotif(e.target.value)}
        />
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="boutons">
        <button className="btn btn-primary" type="submit">Enregistrer</button>
        <button
          className="btn"
          type="button"
          onClick={() => navigate(modeModification ? '/planning' : '/patients')}
        >
          {modeModification ? 'Annuler' : 'Plus tard'}
        </button>
      </div>
    </form>
  );
}

export default RendezVousForm;