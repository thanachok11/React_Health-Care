"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar';  // Import the Navbar component
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // สถานะของ "จดจำฉัน"
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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
        // บันทึก token และ email ลงใน localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        setTimeout(() => {
        // ตรวจสอบว่า email เป็น admin หรือไม่
        if (email === 'admin@gmail.com') {  // เปลี่ยนอีเมลเป็นของ admin
          router.push('/admin');  // Redirect ไปยังหน้า admin page
        } else {
          router.push('/dashboard');  // Redirect ไปยังหน้า dashboard ปกติ
        }}, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'เข้าสู่ระบบล้มเหลว');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />  {/* Navbar อยู่ด้านบนสุด */}
      <div className={styles.container}>
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
              onChange={() => setRememberMe(!rememberMe)} // สลับสถานะของ rememberMe
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

export default LoginPage;
