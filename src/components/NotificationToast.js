import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

function NotificationToast() {
  const { notifications } = useData();
  const [message, setMessage] = useState(null);

  
  const nonLues = notifications.filter(n => !n.lu);
  const derniere = nonLues[nonLues.length - 1];
  const idDerniere = derniere ? derniere.id : null;
  const texte = derniere ? derniere.message : null;

  useEffect(() => {
    if (!texte) return;
    setMessage(texte);

    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [idDerniere, texte]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: '#1e3a5f',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        maxWidth: 300,
        zIndex: 1000,
      }}
    >
       {message}
      <button onClick={() => setMessage(null)} style={{ marginLeft: 10 }}>✕</button>
    </div>
  );
}

export default NotificationToast;