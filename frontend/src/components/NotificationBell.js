import { useState } from 'react';

function NotificationBell({ notifications, onMarquerLues }) {
  const [ouvert, setOuvert] = useState(false);

  const nonLues = notifications.filter(n => !n.lu).length;
  const toggle = () => {
    if (ouvert) onMarquerLues();
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
          {notifications.map(n => (
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