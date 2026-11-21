import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { exporterOrdonnancePDF } from '../../utils/exportPdf';

function DossierForm() {
  const { patientId } = useParams();
  const { patients, dossiers, modifierDossier, ordonnances, supprimerOrdonnance } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const patient = patients.find(p => p.id === Number(patientId));
  const dossier = dossiers.find(d => d.patientId === Number(patientId));

  const [form, setForm] = useState(dossier ? { ...dossier } : {});

  if (!patient || !dossier) return <p>Dossier introuvable.</p>;

  const estMedecin = user.role === 'medecin';

  const ordonnancesPatient = ordonnances
    .filter(o => o.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    modifierDossier(patient.id, {
      groupeSanguin: form.groupeSanguin,
      allergies: form.allergies,
      antecedents: form.antecedents,
      notes: form.notes,
    });
    navigate('/dossiers');
  };

  const supprimer = id => {
    if (window.confirm('Supprimer cette ordonnance ?')) {
      supprimerOrdonnance(id);
    }
  };

  return (
    <div>
      <form className="carte dossier-page" onSubmit={handleSubmit}>
        <h2>Dossier médical</h2>
        <p>
          Patient : <strong>{patient.nom} {patient.prenom}</strong> (né(e) le {patient.dateNaissance})
        </p>

        <div className="dossier-haut">
          <label>Groupe sanguin</label>
          <select name="groupeSanguin" value={form.groupeSanguin} onChange={handleChange}>
            <option value="">-- Choisir --</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="dossier-grille">
          <div className="dossier-colonne">
            <label>Allergies</label>
            <textarea name="allergies" rows="5" value={form.allergies} onChange={handleChange} />

            <label>Antécédents</label>
            <textarea name="antecedents" rows="5" value={form.antecedents} onChange={handleChange} />
          </div>
          
          <div className="dossier-colonne dossier-notes">
            <label>Notes / diagnostic du médecin</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={!estMedecin}
            />
            {!estMedecin && <p className="note">Seul le médecin peut modifier les notes.</p>}
          </div>
        </div>

        <div className="dossier-pied">
          <button className="btn btn-primary" type="submit">Enregistrer</button>
          <button className="btn" type="button" onClick={() => navigate('/dossiers')}>
            Retour
          </button>
        </div>
      </form>

      {estMedecin && (
        <div className="carte ordo-bloc">
          <div className="page-header">
            <h3>Ordonnances</h3>
            <Link to={'/ordonnances/ajouter/' + patient.id}>
              <button className="btn btn-primary">+ Nouvelle ordonnance</button>
            </Link>
          </div>

          {ordonnancesPatient.length === 0 ? (
            <p>Aucune ordonnance.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Médicaments</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordonnancesPatient.map(o => (
                  <tr key={o.id}>
                    <td>{o.date}</td>
                    <td>{o.medicaments.map(m => m.nom).join(', ')}</td>
                    <td>
                      <div className="actions">
                        <button className="btn" onClick={() => exporterOrdonnancePDF(o, patient)}>
                          PDF
                        </button>
                        <button className="btn btn-danger" onClick={() => supprimer(o.id)}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default DossierForm;