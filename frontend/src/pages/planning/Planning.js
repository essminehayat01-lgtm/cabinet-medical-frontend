import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './Planning.css';

const HEURES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const formater = d => d.toLocaleDateString('en-CA'); 

const ajouterJours = (d, n) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

const lundiDe = d => {
  const r = new Date(d);
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
};

const estPasse = rdv => new Date(`${rdv.date}T${rdv.heure}:00`) < new Date();

const nomPatient = rdv => (rdv.patient ? rdv.patient.nom + ' ' + rdv.patient.prenom : '—');

function Planning() {
  const { user } = useAuth();
  const estAssistant = user.role === 'assistant';

  const [reference, setReference] = useState(new Date());
  const [mode, setMode] = useState('semaine');
  const [statut, setStatut] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [rdvs, setRdvs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const aujourdhui = formater(new Date());
  const pas = mode === 'semaine' ? 7 : 1;

  const jours =
    mode === 'semaine'
      ? [0, 1, 2, 3, 4, 5, 6].map(i => ajouterJours(lundiDe(reference), i))
      : [reference];

  const du = formater(jours[0]);
  const au = formater(jours[jours.length - 1]);

  const titreBrut =
    mode === 'semaine'
      ? `Semaine du ${jours[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${jours[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : reference.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const titre = titreBrut.charAt(0).toUpperCase() + titreBrut.slice(1);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur('');

    try {
      const res = await api.get('/rendez-vous', { params: { du, au } });
      setRdvs(res.data);
    } catch (e) {
      setErreur('Impossible de charger le planning.');
    } finally {
      setChargement(false);
    }
  }, [du, au]);

  useEffect(() => {
    charger();
  }, [charger]);

  const annuler = async rdv => {
    if (!window.confirm(`Annuler le rendez-vous de ${nomPatient(rdv)} ?`)) return;

    try {
      await api.delete('/rendez-vous/' + rdv.id);
      charger();
    } catch (e) {
      const messages = e.response && e.response.data && e.response.data.errors;
      setErreur(messages ? Object.values(messages)[0][0] : "Annulation impossible.");
    }
  };

  const visibles = rdvs
    .filter(r => statut === 'tous' || r.statut === statut)
    .filter(r => nomPatient(r).toLowerCase().includes(recherche.toLowerCase()));

  const rdvDe = (date, heure) =>
    visibles.filter(
      r => r.date === formater(date) && r.heure.slice(0, 2) === heure.slice(0, 2)
    );

  const classeCellule = j => {
    const weekend = j.getDay() === 0 || j.getDay() === 6;
    if (formater(j) === aujourdhui) return 'cal-cell cal-aujourdhui';
    return weekend ? 'cal-cell cal-ferme' : 'cal-cell';
  };

  return (
    <div>
      <div className="page-header">
        <h2>Planning</h2>

        <div className="planning-filtres">
          <select value={statut} onChange={e => setStatut(e.target.value)}>
            <option value="tous">Tous les statuts</option>
            <option value="planifie">Planifiés</option>
            <option value="libre">Libres</option>
          </select>
          <input
            placeholder="Rechercher un patient..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
        </div>
      </div>

      {erreur && <p className="erreur">{erreur}</p>}

      <div className="carte">
        <div className="cal-barre">
          <div className="cal-nav">
            <button className="btn" onClick={() => setReference(ajouterJours(reference, -pas))}>←</button>
            <button className="btn" onClick={() => setReference(ajouterJours(reference, pas))}>→</button>
            <button className="btn" onClick={() => setReference(new Date())}>Aujourd'hui</button>
            <input
              className="cal-aller"
              type="date"
              value={formater(reference)}
              onChange={e => e.target.value && setReference(new Date(e.target.value + 'T12:00:00'))}
            />
            <h3>{titre}</h3>
          </div>

          <div className="cal-modes">
            <button className={mode === 'semaine' ? 'btn btn-primary' : 'btn'} onClick={() => setMode('semaine')}>
              Semaine
            </button>
            <button className={mode === 'jour' ? 'btn btn-primary' : 'btn'} onClick={() => setMode('jour')}>
              Jour
            </button>
          </div>
        </div>

        {chargement && <p>Chargement...</p>}

        <div className="cal-conteneur">
          <div className={'cal cal-' + jours.length}>
            <div className="cal-coin"></div>

            {jours.map(j => (
              <div
                key={formater(j)}
                className={formater(j) === aujourdhui ? 'cal-jour cal-aujourdhui' : 'cal-jour'}
              >
                <span className="cal-nom">{j.toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
                <span className="cal-num">{j.getDate()}</span>
              </div>
            ))}

            {HEURES.map(h => (
              <Fragment key={h}>
                <div className="cal-heure">{h}</div>

                {jours.map(j => (
                  <div key={formater(j) + h} className={classeCellule(j)}>
                    {rdvDe(j, h).map(r =>
                      r.statut === 'planifie' ? (
                        <div className="cal-rdv" key={r.id}>
                          <strong>{nomPatient(r)}</strong>
                          <span>{r.motif || 'Consultation'}</span>
                          <small>{r.heure}</small>

                          {estAssistant && !estPasse(r) && (
                            <div className="cal-actions">
                              <Link to={'/rendez-vous/modifier/' + r.id} state={{ rdv: r }}>
                                <button className="btn-mini">Modifier</button>
                              </Link>
                              <button className="btn-mini" onClick={() => annuler(r)}>
                                Annuler
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="cal-rdv cal-libre" key={r.id}>
                          <strong>Libre</strong>
                          <small>{r.heure}</small>
                        </div>
                      )
                    )}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planning;