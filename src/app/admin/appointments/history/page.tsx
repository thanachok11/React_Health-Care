"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../appointments/Navbar/page';
import styles from './HistoryAppointmentsPage.module.css';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  reason: string;
  doctor: string;
  status: string;
  userId: string;
}

const HistoryAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/admin/appointment', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await res.json();
        // เรียงลำดับวันที่จากล่าสุดไปหาวันเก่าสุด
        const sortedAppointments = data.appointments.sort(
            (a: Appointment, b: Appointment) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      setAppointments(data.appointments);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลการนัดหมายได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return <p className={styles.loading}>กำลังโหลดข้อมูล...</p>;
  }

  // กรองเฉพาะสถานะ "Confirmed" และ "Cancelled"
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'ยืนยันการนัดหมาย' || appointment.status === 'ยกเลิกการนัดหมาย'
  );

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>ประวัติการนัดหมาย</h1>
        {filteredAppointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {filteredAppointments.map((appointment, index) => (
              <li key={index} className={styles.appointmentItem}>
                <p>วันที่: {new Date(appointment.date).toLocaleDateString('th-TH')}</p>
                <p>เวลา: {appointment.time}</p>
                <p>ชื่อจริง: {appointment.firstName}</p>
                <p>นามสกุล: {appointment.lastName}</p>
                <p>แพทย์: {appointment.doctor}</p>
                <p>เหตุผลการนัดหมาย: {appointment.reason}</p>
                <p>สถานะ: {appointment.status}</p>
                <p>ผู้ใช้ ID: {appointment.userId}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีการนัดหมายที่ยืนยันหรือยกเลิก</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default HistoryAppointmentsPage;
