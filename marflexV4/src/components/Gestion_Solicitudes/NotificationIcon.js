import React from "react";
import { Badge } from "primereact/badge";
import 'primeicons/primeicons.css';   
import "./styles/NotificationIcon.css";
import PropTypes from "prop-types";

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

NotificationIcon.propTypes = {
  count: PropTypes.node.isRequired,
};

export default NotificationIcon;
