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
    lastName: '',
    sex:'',
    phoneNumber: '', // เบอร์โทรศัพท์
    address: '', // ที่อยู่
    dateOfBirth: '', // วันเกิด
    bloodType: '', // หมู่เลือด
    History_drug_allergy: '', // ประวัติการแพ้ยา (คั่นด้วยเครื่องหมายจุลภาค)
  });
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false); // สำหรับการยอมรับเงื่อนไข
  const router = useRouter();

  // ฟังก์ชันสำหรับการอัพเดตฟิลด์จากการกรอกข้อมูล
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  

  // ฟังก์ชันสำหรับจัดการการยอมรับเงื่อนไข
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!acceptedTerms) {
      setError('คุณต้องยอมรับเงื่อนไขก่อนสมัครสมาชิก');
      setSuccessMessage('');
      return;
    }
  
    const dataToSend = {
      ...formData,
      History_drug_allergy: formData.History_drug_allergy.split(',').map((item) => item.trim()),
    };
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        setSuccessMessage('สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้แล้ว');
        setError('');
        setTimeout(() => {
          router.push('/login');
          onClose();
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
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">เลือกเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="เพศทางเลือก">เพศทางเลือก</option>
          </select>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="เบอร์โทรศัพท์"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="text"
            name="address"
            placeholder="ที่อยู่"
            value={formData.address}
            onChange={handleChange}
            className={styles.input}
          />
          <input
            type="date"
            name="dateOfBirth"
            placeholder="วันเกิด"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={styles.input}
          />
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="">เลือกหมู่เลือด</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
          <input
            type="text"
            name="History_drug_allergy"
            placeholder="ประวัติการแพ้ยา (คั่นด้วย ,)"
            value={formData.History_drug_allergy}
            onChange={handleChange}
            className={styles.input}
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
