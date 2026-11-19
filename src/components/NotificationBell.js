import { useState } from 'react';
import { useData } from '../context/DataContext';

function NotificationBell() {
  const { notifications, marquerNotificationsLues } = useData();
  const [ouvert, setOuvert] = useState(false);

  const nonLues = notifications.filter(n => !n.lu).length;

  const toggle = () => {
    if (ouvert) marquerNotificationsLues();
    setOuvert(!ouvert);
  };

  return (
    <div className="cloche">
      <button className="cloche-btn" onClick={toggle}>
        🔔
        {nonLues > 0 && <span className="cloche-badge">{nonLues}</span>}
      </button>

      {ouvert && (
        <div className="cloche-liste">
          {notifications.length === 0 && <p>Aucune notification.</p>}
          {[...notifications].reverse().map(n => (
            <p key={n.id} className={n.lu ? 'notif' : 'notif non-lue'}>
              {n.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;