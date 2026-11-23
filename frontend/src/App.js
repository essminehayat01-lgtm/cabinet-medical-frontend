import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/authentification/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientForm from './pages/patients/PatientForm';
import Planning from './pages/planning/Planning';
import RendezVousForm from './pages/planning/RendezVousForm';
import DossierList from './pages/dossiers/DossierList';
import DossierForm from './pages/dossiers/DossierForm';
import AssistantList from './pages/assistants/AssistantList';
import AssistantForm from './pages/assistants/AssistantForm';
import OrdonnanceForm from './pages/ordonnances/OrdonnanceForm';

function Accueil() {
  const { user } = useAuth();
  return <Navigate to={user.role === 'medecin' ? '/dashboard' : '/patients'} />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Accueil />} />

                <Route path="/patients" element={<PatientList />} />
                <Route path="/planning" element={<Planning />} />
                <Route path="/dossiers" element={<DossierList />} />
                <Route path="/dossiers/:patientId" element={<DossierForm />} />

                <Route element={<ProtectedRoute roles={['assistant']} />}>
                  <Route path="/patients/ajouter" element={<PatientForm />} />
                  <Route path="/patients/modifier/:id" element={<PatientForm />} />
                  <Route path="/rendez-vous/ajouter/:patientId" element={<RendezVousForm />} />
                </Route>
                
                <Route element={<ProtectedRoute roles={['medecin']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/assistants" element={<AssistantList />} />
                  <Route path="/assistants/ajouter" element={<AssistantForm />} />
                  <Route path="/assistants/modifier/:id" element={<AssistantForm />} />
                  <Route path="/ordonnances/ajouter/:patientId" element={<OrdonnanceForm />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;