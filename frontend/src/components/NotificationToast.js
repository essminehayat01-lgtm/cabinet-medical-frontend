import { useEffect } from 'react';

function NotificationToast({ notification, onFermer }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(onFermer, 4000);
    return () => clearTimeout(timer);
  }, [notification, onFermer]);

  if (!notification) return null;

  return (
    <div className="toast">
      🔔 {notification.message}
      <button className="btn-icone" onClick={onFermer}>✕</button>
    </div>
  );
}

export default NotificationToast;