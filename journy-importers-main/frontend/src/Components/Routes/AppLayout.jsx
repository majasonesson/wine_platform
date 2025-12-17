// components/Routes/AppLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import styles from '../../styles/appLayout.module.scss';  // Importera layout-styling

export const AppLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

//   useEffect(() => {
//     const token = Cookies.get("token");
//     setIsAuthenticated(!!token);
//     if (!token) {
//       navigate("/login");
//     }
//   }, [navigate]);

//   if (!isAuthenticated) {
//     return null;
//   }

  return (
    <div className={styles.mainLayout}> {/* Flex-container för layout */}
      <Outlet /> {/* Rendera aktuell sida */}
    </div>
  );
};
