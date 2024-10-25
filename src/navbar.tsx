import Link from '../node_modules/next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedEmail = localStorage.getItem('userEmail'); // Assuming userEmail is stored
      setUserEmail(storedEmail); // Set email to be displayed
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail'); // Clear email on logout
    setUserEmail(null); // Reset user email to null after logout
    window.location.href = '/'; // Redirect to home page after logout
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/dashboard" className={styles.link}>
        <div className={styles.logo}>Balance Care</div>
      </Link>
      <ul className={styles.navLinks}>
        {userEmail ? (
          <>
            <li>
              <span className={styles.userEmail}>
                <FontAwesomeIcon icon={faUser} /> สวัสดีคุณ {userEmail}
              </span>
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
              <a className={styles.login} href="/login">
                <FontAwesomeIcon icon={faSignInAlt} /> เข้าสู่ระบบ
              </a>
            </li>
            <li>
              <a className={styles.register} href="/register">
                <FontAwesomeIcon icon={faUserPlus} /> สมัครสมาชิก
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
