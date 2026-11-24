import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { exporterOrdonnancePDF } from '../../utils/exportPdf';

const GROUPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function DossierForm() {
  const { patientId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const estMedecin = user.role === 'medecin';

  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ groupe_sanguin: '', allergies: '', antecedents: '', notes: '' });
  const [ordonnances, setOrdonnances] = useState([]);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api
      .get('/patients/' + patientId)
      .then(res => {
        const d = res.data.dossier || {};
        setPatient(res.data);
        setForm({
          groupe_sanguin: d.groupe_sanguin || '',
          allergies: d.allergies || '',
          antecedents: d.antecedents || '',
          notes: d.notes || '',
        });
      })
      .catch(() => navigate('/dossiers'));
  }, [patientId, navigate]);

  useEffect(() => {
    if (!estMedecin) return;

    api
      .get('/patients/' + patientId + '/ordonnances')
      .then(res => setOrdonnances(res.data))
      .catch(() => setErreur('Impossible de charger les ordonnances.'));
  }, [patientId, estMedecin]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErreur('');

    try {
      await api.put('/patients/' + patientId + '/dossier', form);
      navigate('/dossiers');
    } catch (err) {
      const erreurs = err.response && err.response.data && err.response.data.errors;
      setErreur(erreurs ? Object.values(erreurs)[0][0] : "Enregistrement impossible.");
    }
  };

  const supprimer = async id => {
    if (!window.confirm('Supprimer cette ordonnance ?')) return;

    try {
      await api.delete('/ordonnances/' + id);
      setOrdonnances(ordonnances.filter(o => o.id !== id));
    } catch (e) {
      setErreur('Suppression impossible.');
    }
  };

  if (!patient) return <p>Chargement...</p>;

  return (
    <div>
      <form className="carte dossier-page" onSubmit={handleSubmit}>
        <h2>Dossier médical</h2>
        <p>
          Patient : <strong>{patient.nom} {patient.prenom}</strong> (né(e) le {patient.date_naissance})
        </p>

        <div className="dossier-haut">
          <label>Groupe sanguin</label>
          <select name="groupe_sanguin" value={form.groupe_sanguin} onChange={handleChange}>
            <option value="">-- Choisir --</option>
            {GROUPES.map(g => (
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

        {erreur && <p className="erreur">{erreur}</p>}

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

          {ordonnances.length === 0 ? (
            <p>Aucune ordonnance.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Médicaments</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordonnances.map(o => (
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