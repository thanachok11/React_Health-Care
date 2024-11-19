"use client";

import { useState } from 'react';
import Navbar from '@/navbar';
import LoginPageModal from './loginmodal/page'; // Import LoginPageModal component
import styles from './HomePage.module.css';

const HomePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <div className={styles.container}>
      <Navbar />
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
            <button className={styles.loginButton} onClick={handleModalToggle}>
              เริ่มต้นการทำงาน
            </button>
          </div>
        </div>
      </div>
      <LoginPageModal isVisible={isModalVisible} onClose={handleModalToggle} />
    </div>
  );
};

export default HomePage;
