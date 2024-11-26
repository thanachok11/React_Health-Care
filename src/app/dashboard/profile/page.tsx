"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar/page';
import styles from './ProfilePage1.module.css';

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  sex: string;
  img: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  bloodType: string;
  History_drug_allergy: string[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditClick = () => {
    router.push('./edit-profile');
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.title}>โปรไฟล์ของฉัน</h1>
      <div className={styles.contentContainer}>
        {loading && <p className={styles.loading}>กำลังโหลดข้อมูล...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {user ? (
          <div className={styles.profileWrapper}>
            {/* รูปโปรไฟล์ */}
            <section className={styles.profileImageSection}>
              <img src={user.img} alt="User Image" className={styles.profileImage} />
            </section>

            {/* ข้อมูลโปรไฟล์ */}
            <section className={styles.profileInfoSection}>
              <div className={styles.inputGroup}>
                <label>ชื่อผู้ใช้:</label>
                <p>{user.username}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>ชื่อจริง:</label>
                <p>{user.firstName}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>นามสกุล:</label>
                <p>{user.lastName}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>เพศ:</label>
                <p>{user.sex}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>เบอร์โทรศัพท์:</label>
                <p>{user.phoneNumber}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>ที่อยู่:</label>
                <p>{user.address}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>วันเกิด:</label>
                <p>{new Date(user.dateOfBirth).toLocaleDateString('th-TH')}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>กรุ๊ปเลือด:</label>
                <p>{user.bloodType}</p>
              </div>
              <div className={styles.inputGroup}>
                <label>ประวัติแพ้ยา:</label>
                <p>{user.History_drug_allergy.join(', ') || 'ไม่มีข้อมูล'}</p>
              </div>
            </section>

            {/* ปุ่มแก้ไข */}
            <section className={styles.actionSection}>
              <button onClick={handleEditClick}>แก้ไขข้อมูล</button>
            </section>
          </div>
        ) : (
          <p className={styles.noData}>ไม่พบข้อมูลผู้ใช้</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
