"use client";

import Navbar from '@/navbar';  // Import the Navbar component
import styles from './HomePage.module.css'; // Import the CSS module for styling

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Navbar /> {/* Include the Navbar */}
      <div className={styles.hero}>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Balance Care</h1>
          <h2 className={styles.subtitle}>การดูแลสุขภาพอย่างสมดุล เพื่อชีวิตที่ดีกว่า</h2>
          <p className={styles.description}>
            เราพร้อมให้การดูแลสุขภาพของคุณด้วยทีมผู้เชี่ยวชาญด้านการแพทย์และการดูแลเฉพาะทาง
            สมัครสมาชิกหรือเข้าสู่ระบบเพื่อเริ่มต้นเส้นทางการดูแลสุขภาพของคุณวันนี้
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.signupButton}>สมัครสมาชิก</button>
            <button className={styles.loginButton}>เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
