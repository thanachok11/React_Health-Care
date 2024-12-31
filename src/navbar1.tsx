import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import LoginPageModal from './app/loginmodal/page'; // Import LoginPageModal component
import RegisterPageModal from './app/registermodal/page'; // Import RegisterPageModal component
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleLoginModalToggle = () => {
    setIsLoginModalVisible(!isLoginModalVisible);
  };

  const handleRegisterModalToggle = () => {
    setIsRegisterModalVisible(!isRegisterModalVisible);
  };

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
              <a className={styles.login} onClick={handleLoginModalToggle}>
                <FontAwesomeIcon icon={faSignInAlt} /> เข้าสู่ระบบ
              </a>
            </li>
            <li>
              <a className={styles.register} onClick={handleRegisterModalToggle}>
                <FontAwesomeIcon icon={faUserPlus} /> สมัครสมาชิก
              </a>
            </li>
          </>
        )}
      </ul>
      <LoginPageModal isVisible={isLoginModalVisible} onClose={handleLoginModalToggle} />
      <RegisterPageModal isVisible={isRegisterModalVisible} onClose={handleRegisterModalToggle} />
    </nav>
  );
};

export default Navbar;
