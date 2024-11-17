"use client";

import Navbar from '../../Navbar/page'; // Import Navbar
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditPage.module.css';  // Import CSS สำหรับหน้า EditPage

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
    // ดึงข้อมูลผู้ใช้ตาม username ที่ต้องการแก้ไขจาก API
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

  // ฟังก์ชันสำหรับจัดการการกรอกข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไขข้อมูลผู้ใช้
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
        router.push('/admin');  // กลับไปที่หน้า AdminPage
      } else {
        throw new Error('Failed to update user');
      }
    } catch (err) {
      setError('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  // ฟังก์ชันสำหรับลบข้อมูลผู้ใช้
  const handleDelete = async () => {
    const confirmDelete = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/auth/admin/username/${params.username}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('ลบข้อมูลผู้ใช้สำเร็จ');
        router.push('/admin');  // กลับไปที่หน้า AdminPage
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (err) {
      setError('ไม่สามารถลบข้อมูลได้');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.title}>แก้ไขข้อมูลผู้ใช้</h1>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <form onSubmit={handleSave} className={styles.form}>
          <p>อีเมล</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="อีเมล"
            required
          />
          <p>ชื่อผู้ใช้</p>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="ชื่อผู้ใช้"
            required
            readOnly  // ไม่อนุญาตให้แก้ไข username
          />
          <p>ชื่อจริง</p>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="ชื่อ"
            required
          />
          <p>นามสกุล</p>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="นามสกุล"
            required
          />
          <button type="submit" className={styles.button}>บันทึกข้อมูล</button>
          <button type="button" className={styles.buttonDelete} onClick={handleDelete}>ลบข้อมูลผู้ใช้</button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default EditPage;
