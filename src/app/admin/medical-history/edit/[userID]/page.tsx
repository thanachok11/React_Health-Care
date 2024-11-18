"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../Navbar/page'; // Import Navbar
import styles from './PatientDetailPage.module.css'; // Import styles

interface PatientDetail {
  name: string;
  age: number;
  gender: string;
  medicalHistory: string; // ประวัติการรักษา
  contactInfo: string;    // ข้อมูลการติดต่อ
}

const PatientDetailPage = () => {
  const { userId } = useParams(); // รับค่า userId จาก URL
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [error, setError] = useState(''); // สถานะสำหรับแสดงข้อผิดพลาด
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลรายละเอียดคนไข้จาก API
  const fetchPatientDetail = async () => {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    if (!token) {
      router.push('/login'); // ถ้าไม่มี token ให้ไปหน้า login
      return;
    }

    try {
      const res = await fetch(`/api/auth/admin/medical-history/PatientDetail/${userId}`, { // ดึงข้อมูลจาก API โดยใช้ userId
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ไปใน headers
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch patient detail');
      }

      const data = await res.json();
      setPatient(data.patient);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลรายละเอียดคนไข้ได้');
    } finally {
      setLoading(false); // หยุดโหลดเมื่อดึงข้อมูลสำเร็จหรือเกิดข้อผิดพลาด
    }
  };

  useEffect(() => {
    fetchPatientDetail(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
  }, [userId]);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>; // แสดงข้อความระหว่างการโหลด
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar /> {/* แสดง Navbar */}
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>รายละเอียดคนไข้</h1>
        {patient ? (
          <div className={styles.patientDetail}>
            <p>ชื่อ: {patient.name}</p>
            <p>อายุ: {patient.age}</p>
            <p>เพศ: {patient.gender}</p>
            <p>ประวัติการรักษา: {patient.medicalHistory}</p>
            <p>ข้อมูลการติดต่อ: {patient.contactInfo}</p>
          </div>
        ) : (
          <p>ไม่พบข้อมูลคนไข้</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default PatientDetailPage;
