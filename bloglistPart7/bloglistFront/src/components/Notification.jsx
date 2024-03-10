const Notification = ({ notification }) => {
  if (notification.notification === '') {
    return null;
  }
  const notifStyle = { color: notification.color }

  return (
    <div style={notifStyle} className="notif">
      {notification.notification}
    </div>
  );
}

export default Notification