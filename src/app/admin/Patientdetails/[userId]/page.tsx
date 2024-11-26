"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../appointments/Navbar/page';
import styles from './DetailPage.module.css';

const UserDetailPage = ({ params }: { params: { userId: string } }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    sex:'',
    phoneNumber: '', // เบอร์โทรศัพท์
    address: '', // ที่อยู่
    dateOfBirth: '', // วันเกิด
    bloodType: '', // หมู่เลือด
    History_drug_allergy: '' // ประวัติการแพ้ยา (คั่นด้วยเครื่องหมายจุลภาค)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/auth/admin/patientdetails/${params.userId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setFormData({
          email: data.user.email,
          username: data.user.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          sex: data.user.sex,
          phoneNumber: data.user.phoneNumber,
          address: data.user.address,
          dateOfBirth: data.user.dateOfBirth,
          bloodType: data.user.bloodType,
          History_drug_allergy: data.user.History_drug_allergy
        });
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.userId]);

  // Function to calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    
    // Adjust if birthday has not occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Check if params.userId exists before rendering
  if (!params.userId) {
    return <p>กำลังโหลดข้อมูล...</p>; // Show loading message if userId is not yet available
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>รายละเอียดคนไข้</h1>
        {loading && <p className={styles.loading}>กำลังโหลดข้อมูล...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {formData && (
          <div className={styles.userDetails}>
            <p>ชื่อ: {formData.firstName} {formData.lastName}</p>
            <p>อีเมล: {formData.email}</p>
            <p>ชื่อผู้ใช้: {formData.username}</p>
            <p>เบอร์โทรศัพท์: {formData.phoneNumber}</p>
            <p>เพศ: {formData.sex}</p>
            <p>ที่อยู่: {formData.address}</p>
            <p>วันเกิด: {new Date(formData.dateOfBirth).toLocaleDateString('th-TH')}</p>
            <p>หมู่เลือด: {formData.bloodType}</p>
            <p>อายุ: {calculateAge(formData.dateOfBirth)} ปี</p>
            <p>ประวัติการแพ้ยา: {formData.History_drug_allergy}</p>
            {/* You may want to remove or hide the password field for security reasons */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;
