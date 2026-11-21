import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const USERS_INIT = [
  { id: 1, nom: 'Dr. Alaoui', email: 'medecin@cabinet.ma', password: '1234', role: 'medecin' },
  { id: 2, nom: 'Salma', email: 'assistant@cabinet.ma', password: '1234', role: 'assistant' },
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(USERS_INIT);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return false;
    setUser(found);
    localStorage.setItem('user', JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const inscrireMedecin = data => {
    setUsers(prev => [...prev, { id: Date.now(), role: 'medecin', ...data }]);
  };

  const assistants = users.filter(u => u.role === 'assistant');

  const ajouterAssistant = data => {
    setUsers(prev => [...prev, { id: Date.now(), role: 'assistant', ...data }]);
  };

  const modifierAssistant = (id, data) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  };

  const supprimerAssistant = id => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        user, users, assistants,
        login, logout, inscrireMedecin,
        ajouterAssistant, modifierAssistant, supprimerAssistant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}