import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const PATIENTS_INIT = [];

const DOSSIERS_INIT = [];

function genererCreneaux() {
  const heures = ['09:00', '10:00', '11:00','12:00', '14:00' , '15:00'];
  const liste = [];
  let id = 1;
  for (let j = 0; j <= 4; j++) {
    const d = new Date();
    d.setDate(d.getDate() + j);
    const date = d.toLocaleDateString('en-CA');
    heures.forEach(heure => {
      liste.push({ id: id++, date, heure, patientId: null, motif: '', statut: 'libre' });
    });
  }
  return liste;
}

export function DataProvider({ children }) {
  const [patients, setPatients] = useState(PATIENTS_INIT);
  const [dossiers, setDossiers] = useState(DOSSIERS_INIT);
  const [rendezVous, setRendezVous] = useState(genererCreneaux());
  const [notifications, setNotifications] = useState([]);
  const [ordonnances, setOrdonnances] = useState([]);

  const ajouterPatient = data => {
    const id = Date.now();
    setPatients(prev => [...prev,{ id, creeLe: new Date().toLocaleDateString('en-CA'), ...data },]);
    setDossiers(prev => [
      ...prev,
      { id, patientId: id, groupeSanguin: '', allergies: '', antecedents: '', notes: '' },
    ]);
    return id;
  };

  const modifierPatient = (id, data) => {
    setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  const modifierDossier = (patientId, data) => {
    setDossiers(prev =>
      prev.map(d => (d.patientId === patientId ? { ...d, ...data } : d))
    );
  };

  const reserverRendezVous = (creneauId, patientId, motif) => {
    const creneau = rendezVous.find(r => r.id === creneauId);
    const patient = patients.find(p => p.id === patientId);

    setRendezVous(prev =>
      prev.map(r =>
        r.id === creneauId ? { ...r, patientId, motif, statut: 'planifié' } : r
      )
    );

    setNotifications(prev => [
      ...prev,
      {
        id: Date.now(),
        message: `Nouveau rendez-vous : ${patient.nom} ${patient.prenom}, le ${creneau.date} à ${creneau.heure}`,
        lu: false,
      },
    ]);
  };

  const marquerNotificationsLues = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
  };

  const ajouterOrdonnance = data => {
    setOrdonnances(prev => [...prev, { id: Date.now(), ...data }]);
  };

  const supprimerOrdonnance = id => {
    setOrdonnances(prev => prev.filter(o => o.id !== id));
  };

  const supprimerPatient = id => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setDossiers(prev => prev.filter(d => d.patientId !== id));
    setOrdonnances(prev => prev.filter(o => o.patientId !== id));
    setRendezVous(prev =>
      prev.map(r =>
        r.patientId === id ? { ...r, patientId: null, motif: '', statut: 'libre' } : r
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        patients, dossiers, rendezVous, notifications, ordonnances,
        ajouterPatient, modifierPatient, modifierDossier,
        reserverRendezVous, marquerNotificationsLues,
        ajouterOrdonnance, supprimerOrdonnance, supprimerPatient,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}