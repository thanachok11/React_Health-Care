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
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: ''
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
        lastName: data.user.lastName
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {
          router.push('/dashboard');
        }
      }, 2000);
    } catch (err) {
      setError('ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.formContainer}>
        <h1 className={styles.title}>โปรไฟล์ของฉัน</h1>
        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>First Name:</label>
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
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={styles.input}
                required
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
