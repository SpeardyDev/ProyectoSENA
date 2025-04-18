import React from "react";
import { Badge } from "primereact/badge";
import 'primeicons/primeicons.css';   
import "./styles/NotificationIcon.css";

const NotificationIcon = ({ count }) => {
  return (
    <div className="notification-container">
      <i className="pi pi-bell" style={{ fontSize: "2rem" }}></i>
      {count > 0 && (
        <Badge
          value={count}
          severity="info"
          className="notification-badge"
        />
      )}
    </div>
  );
};

export default NotificationIcon;
