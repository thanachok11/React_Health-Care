import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedEmail = localStorage.getItem('userEmail');
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/admin" className={styles.logo}>
        Balance Care
      </Link>
      <ul className={styles.navLinks}>
        {userEmail ? (
          <>
            <li>
              <Link href="/admin/medical-history" className={`${styles.link} ${styles.specialLink}`}>
                <span className={styles.icon}>🩺</span>
                ประวัติการรักษา
              </Link>
            </li>
            <li>
              <Link href="/admin/appointments" className={`${styles.link} ${styles.specialLink}`}>
                <span className={styles.icon}>📅</span>
                การนัดหมาย
              </Link>
            </li>
            <li>
              <Link href="/admin/recent-activities" className={`${styles.link} ${styles.specialLink}`}>
                <span className={styles.icon}>📝</span>
                กิจกรรมล่าสุด
              </Link>
            </li>
            <li>
              <span className={styles.userEmail}>สวัสดีคุณ {userEmail}</span>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                <FontAwesomeIcon icon={faSignOutAlt} /> ออกจากระบบ
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className={styles.loginButton}>
                เข้าสู่ระบบ
              </Link>
            </li>
            <li>
              <Link href="/register" className={styles.registerButton}>
                สมัครสมาชิก
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
