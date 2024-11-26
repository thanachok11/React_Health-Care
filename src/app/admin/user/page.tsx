"use client";
import Link from '../../../../node_modules/next/link';// Import Link จาก Next.js
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

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>จัดการผู้ใช้งาน</h1>
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
                  <button className={styles.editButton}>รายละเอียดผู้ใช้งาน</button>
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
