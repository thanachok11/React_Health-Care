// LoginPageModal.js
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Loginmodal.module.css';

const LoginPageModal = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  if (!isVisible) return null; // Return null if the modal should not be displayed

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccessMessage('เข้าสู่ระบบสำเร็จ!');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        setTimeout(() => {
          if (email === 'admin@gmail.com') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'เข้าสู่ระบบล้มเหลว');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button onClick={onClose} className={styles.closeButton}>X</button>
        <form onSubmit={handleLogin} className={styles.form}>
          <h1 className={styles.title}>เข้าสู่ระบบ</h1>
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className={styles.label} htmlFor="rememberMe">จดจำฉัน</label>
          </div>
          <button type="submit" className={styles.button}>เข้าสู่ระบบ</button>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPageModal;
