import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import PropTypes from "prop-types";

const RutaPrivada = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

RutaPrivada.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RutaPrivada;