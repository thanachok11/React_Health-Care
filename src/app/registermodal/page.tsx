// RegisterPageModal.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Registermodal.module.css';

const RegisterModal = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false); // สำหรับการยอมรับเงื่อนไข
  const router = useRouter();

  // ฟังก์ชันสำหรับการอัพเดตฟิลด์จากการกรอกข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ฟังก์ชันสำหรับจัดการการยอมรับเงื่อนไข
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setError('คุณต้องยอมรับเงื่อนไขก่อนสมัครสมาชิก');
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว');
        setError('');
        setTimeout(() => {
          router.push('/login');
          onClose(); // Close the modal after successful registration
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'การลงทะเบียนล้มเหลว');
        setSuccessMessage('');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setSuccessMessage('');
    }
  };

  if (!isVisible) return null; // Return null if modal is not visible

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.title}>สมัครสมาชิก</h1>
        <form onSubmit={handleRegister} className={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="ชื่อผู้ใช้"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="อีเมล"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="ชื่อ"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="นามสกุล"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {/* Checkbox สำหรับการยอมรับเงื่อนไข */}
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="acceptTerms" className={styles.checkboxLabel}>
              ฉันยอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว
            </label>
          </div>
          <button type="submit" className={styles.button}>สมัครสมาชิก</button>
          {/* แสดง error ด้านล่างปุ่ม */}
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
        <button onClick={onClose} className={styles.closeButton}>X</button>
      </div>
    </div>
  );
};

export default RegisterModal;
