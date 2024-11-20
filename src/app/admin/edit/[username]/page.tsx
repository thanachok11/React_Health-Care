"use client";

import Navbar from '../../Navbar/page';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditPage.module.css';

const EditPage = ({ params }: { params: { username: string } }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/auth/admin/username/${params.username}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setFormData({
          email: data.user.email,
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName
        });
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/admin/username/${params.username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('บันทึกข้อมูลสำเร็จ');
        router.push('/admin');
      } else {
        throw new Error('Failed to update user');
      }
    } catch (err) {
      setError('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  const handleDelete = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return;
    try {
      const res = await fetch(`/api/auth/admin/username/${params.username}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('ลบข้อมูลผู้ใช้สำเร็จ');
        router.push('/admin');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      setError('ไม่สามารถลบข้อมูลได้');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>รายละเอียดผู้ใช้งาน</h1>
        {loading ? (
          <p className={styles.loading}>กำลังโหลดข้อมูล...</p>
        ) : (
          <>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">อีเมล</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="อีเมล"
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="username">ชื่อผู้ใช้</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="ชื่อผู้ใช้"
                  readOnly
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">ชื่อจริง</label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="ชื่อ"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">นามสกุล</label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="นามสกุล"
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.buttonSave}>บันทึกข้อมูล</button>
              <button type="button" className={styles.buttonDelete} onClick={handleDelete}>ลบข้อมูลผู้ใช้</button>
            </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditPage;
