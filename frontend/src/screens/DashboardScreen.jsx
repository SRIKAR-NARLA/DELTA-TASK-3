import Navbar from '../components/Navbar';
import FriendsPanel from '../components/FriendsPanel';
import styles from './Dashboard.module.css'
import Player from '../components/Player';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardScreen = () => {
  const location = useLocation();

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.middleSection}>
        <FriendsPanel />
        <div className={styles.midcell}>
          <Outlet/>
        </div>
        <FriendsPanel />
      </div>
      <div className={styles.footer}>
        <Player/>
      </div>
    </div>
  );
};

export default DashboardScreen;
