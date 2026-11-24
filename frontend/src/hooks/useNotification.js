import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/api';

export function useNotifications(actif) {
  const [notifications, setNotifications] = useState([]);
  const [nouvelle, setNouvelle] = useState(null);
  const dejaVues = useRef(new Set());

  const charger = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      const liste = res.data; 
      const jdida = liste.find(n => !n.lu && !dejaVues.current.has(n.id));
      if (jdida) setNouvelle(jdida);

      liste.forEach(n => dejaVues.current.add(n.id));
      setNotifications(liste);
    } catch (e) {} }, []);

  useEffect(() => {
    if (!actif) return;
    charger();
    const timer = setInterval(charger, 10000);
    return () => clearInterval(timer);
  }, [actif, charger]);

  const marquerLues = useCallback(async () => {
    try {
      await api.post('/notifications/lues');
      await charger();
    } catch (e) { }}, [charger]);

  const fermerNouvelle = useCallback(() => setNouvelle(null), []);

  return { notifications, nouvelle, marquerLues, fermerNouvelle };
}