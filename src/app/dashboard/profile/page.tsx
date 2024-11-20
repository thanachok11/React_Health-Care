"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar';
import styles from './ProfilePage.module.css';

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  bloodType?: string;
  History_drug_allergy?: string[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    bloodType: '',
    History_drug_allergy: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await res.json();
      setUser(data.user);
      setForm({
        email: data.user.email,
        username: data.user.username,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phoneNumber: data.user.phoneNumber,
        address: data.user.address,
        dateOfBirth: data.user.dateOfBirth,
        bloodType: data.user.bloodType,
        History_drug_allergy: data.user.History_drug_allergy?.join(', ') || ''
      });
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccessMessage('อัพเดทข้อมูลสำเร็จแล้ว!!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError('ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>โปรไฟล์ของฉัน</h1>

        {/* แสดงข้อความกำลังโหลดเฉพาะเมื่อยังไม่ได้โหลดข้อมูล */}
        {loading && <p className={styles.loading}>กำลังโหลดข้อมูล...</p>}

        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>ชื่อผู้ใช้:</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                required
                disabled // ทำให้ไม่สามารถแก้ไขได้และจะไม่ถูกส่งไปในฟอร์ม
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อจริง:</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>นามสกุล:</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>เบอร์โทรศัพท์:</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ที่อยู่:</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>วันเกิด</label>
              <input
                type="text"
                name="dateOfBirth"
                value={new Date(form.dateOfBirth).toLocaleDateString('th-TH')}
                onChange={handleChange}
                className={styles.input}
                disabled // ทำให้ไม่สามารถแก้ไขได้และจะไม่ถูกส่งไปในฟอร์ม
              />
            </div>
            <div className={styles.inputGroup}>
              <label>กรุ๊ปเลือด:</label>
              <input
                type="text"
                name="bloodType"
                value={form.bloodType}
                onChange={handleChange}
                className={styles.input}
                disabled // ทำให้ไม่สามารถแก้ไขได้และจะไม่ถูกส่งไปในฟอร์ม
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ประวัติแพ้ยา:</label>
              <textarea
                name="History_drug_allergy"
                value={form.History_drug_allergy}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>อัปเดตโปรไฟล์</button>
            {successMessage && <p className={styles.success}>{successMessage}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </form>
        ) : (
          <p>ไม่พบข้อมูลผู้ใช้</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
