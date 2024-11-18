"use client";
import Link from '../../../../node_modules/next/link'; // Import Link จาก Next.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar/page'; // Import Navbar
import styles from './MedicalHistoryPage.module.css'; // Import styles

interface Appointment {
  _id: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  userId: string;
}

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [error, setError] = useState(''); // สถานะสำหรับแสดงข้อผิดพลาด
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลการนัดหมายของทุกผู้ใช้จาก API
  const fetchAppointments = async () => {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    if (!token) {
      router.push('/login'); // ถ้าไม่มี token ให้ไปหน้า login
      return;
    }

    try {
      const res = await fetch('/api/auth/admin/medical-history', { // API ของ Admin
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ไปใน headers
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await res.json();
      setAppointments(data.appointments);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลการนัดหมายได้');
    } finally {
      setLoading(false); // หยุดโหลดเมื่อดึงข้อมูลสำเร็จหรือเกิดข้อผิดพลาด
    }
  };

  useEffect(() => {
    fetchAppointments(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>; // แสดงข้อความระหว่างการโหลด
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar /> {/* แสดง Navbar */}
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>ประวัติการรักษา (Admin)</h1>
        {appointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {appointments.map((appointment, index) => (
              <li key={index} className={styles.appointmentItem}>
                <p>วันที่: {appointment.date}</p>
                <p>เวลา: {appointment.time}</p>
                <p>แพทย์: {appointment.doctor}</p>
                <p>สถานะ: {appointment.status}</p>
                <Link href={`/admin/medical-history/edit/${appointment.userId}`}>
                <button className={styles.edit}>รายละเอียดคนไข้</button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีการนัดหมาย</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
