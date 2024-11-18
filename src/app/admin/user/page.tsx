"use client";
import Link from 'next/link'; // Import Link จาก Next.js
import { useState, useEffect } from 'react';
import Navbar from '../Navbar/page'; // Import Navbar
import styles from './UserPage.module.css'; // Import CSS สำหรับหน้า Admin Page

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false); // สำหรับเปิด/ปิดฟอร์มเพิ่มผู้ใช้งาน

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมดจาก API
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/auth/admin');  // URL API สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data.users);  // เก็บข้อมูลผู้ใช้ใน state
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ฟังก์ชันจัดการฟิลด์การกรอกข้อมูลผู้ใช้ใหม่
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันเพิ่มผู้ใช้ใหม่
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (res.ok) {
        const data = await res.json();
        setUsers([...users, data.user]);  // เพิ่มผู้ใช้ใหม่ใน state
        setNewUser({ email: '', username: '', firstName: '', lastName: '', password: '' });
        setShowForm(false); // ปิดฟอร์มหลังเพิ่มผู้ใช้งานสำเร็จ
      } else {
        setError('ไม่สามารถเพิ่มผู้ใช้ได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>จัดการผู้ใช้งาน</h1>
        <div className={styles.actions}>
          <button 
            className={styles.addButton}
            onClick={() => setShowForm(!showForm)}  // Toggle ฟอร์ม
          >
            {showForm ? "ปิดฟอร์ม" : "เพิ่มผู้ใช้งาน"}
          </button>
        </div>
        
        {showForm && (
          <form onSubmit={handleAddUser} className={styles.form}>
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={newUser.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="ชื่อผู้ใช้"
              value={newUser.username}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="firstName"
              placeholder="ชื่อ"
              value={newUser.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="นามสกุล"
              value={newUser.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={newUser.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.submitButton}>บันทึก</button>
          </form>
        )}

        {loading ? (
           <p className={styles.loading}>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <div className={styles.userGrid}>
            {users.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <h3>{user.username}</h3>
                <p>อีเมล: {user.email}</p>
                <p>ชื่อ: {user.firstName} {user.lastName}</p>
                <Link href={`/admin/edit/${user.username}`}>
                  <button className={styles.editButton}>แก้ไขข้อมูลผู้ใช้</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
