import { Fragment, useState } from 'react';
import { useData } from '../../context/DataContext';
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

function Planning() {
  const { rendezVous, patients } = useData();

  const [reference, setReference] = useState(new Date());
  const [mode, setMode] = useState('semaine');
  const [statut, setStatut] = useState('tous');
  const [recherche, setRecherche] = useState('');

  const aujourdhui = formater(new Date());
  const pas = mode === 'semaine' ? 7 : 1;

  const nomPatient = id => {
    const p = patients.find(p => p.id === id);
    return p ? p.nom + ' ' + p.prenom : '—';
  };

  const jours =
    mode === 'semaine'
      ? [0, 1, 2, 3, 4, 5, 6].map(i => ajouterJours(lundiDe(reference), i))
      : [reference];

  const titreBrut =
    mode === 'semaine'
      ? `Semaine du ${jours[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${jours[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
      : reference.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const titre = titreBrut.charAt(0).toUpperCase() + titreBrut.slice(1);

  const visibles = rendezVous
    .filter(r => statut === 'tous' || r.statut === statut)
    .filter(r => nomPatient(r.patientId).toLowerCase().includes(recherche.toLowerCase()));

  const rdvDe = (date, heure) =>
    visibles.filter(
      r => r.date === formater(date) && r.heure.slice(0, 2) === heure.slice(0, 2)
    );

  return (
    <div>
      <div className="page-header">
        <h2>Planning</h2>

        <div className="planning-filtres">
          <select value={statut} onChange={e => setStatut(e.target.value)}>
            <option value="tous">Tous les statuts</option>
            <option value="planifié">Planifiés</option>
            <option value="libre">Libres</option>
          </select>
          <input
            placeholder="Rechercher un patient..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
        </div>
      </div>

      <div className="carte">
        <div className="cal-barre">
          <div className="cal-nav">
            <button className="btn" onClick={() => setReference(ajouterJours(reference, -pas))}>←</button>
            <button className="btn" onClick={() => setReference(ajouterJours(reference, pas))}>→</button>
            <button className="btn" onClick={() => setReference(new Date())}>Aujourd'hui</button>
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
                  <div
                    key={formater(j) + h}
                    className={formater(j) === aujourdhui ? 'cal-cell cal-aujourdhui' : 'cal-cell'}
                  >
                    {rdvDe(j, h).map(r =>
                      r.statut === 'planifié' ? (
                        <div className="cal-rdv" key={r.id}>
                          <strong>{nomPatient(r.patientId)}</strong>
                          <span>{r.motif || 'Consultation'}</span>
                          <small>{r.heure}</small>
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