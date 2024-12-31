"use client";
import Link from '../../../../../node_modules/next/link';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

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
      <Link href="/admin" className={styles.link}>
        <div className={styles.logo}>Balance Care</div>
      </Link>
      <ul className={styles.navLinks}>
        {userEmail ? (
          <>
            <li>
              <Link href="/admin/appointments" className={`${styles.link} ${styles.specialLink}`}>
                <span className={styles.icon}>📅 </span>
                รายการนัดหมาย
              </Link>
            </li>
            <li>
              <Link href="/admin/appointments/history" className={`${styles.link} ${styles.specialLink}`}>
                <span className={styles.icon}>📝 </span>
                ประวัติการนัดหมาย
              </Link>
            </li>
            <li>
              <span className={styles.userEmail}>สวัสดีคุณ {userEmail}</span>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                ออกจากระบบ
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
