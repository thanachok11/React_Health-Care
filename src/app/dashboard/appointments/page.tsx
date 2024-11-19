"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar';
import styles from './AppointmentsPage.module.css';

interface Appointment {
  _id: string;
  date: string;
  time: string;
  doctor: string;
  reason: string;
  firstName: string;
  lastName: string;
  status: string;
}

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch appointments
  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/appointments', {
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

      setAppointments(sortedAppointments);
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

  return (
    <div>
      <div className={styles.container}>
        <Navbar />
      </div>
      <h1 className={styles.title}>ข้อมูลการนัดหมาย</h1>
      <button
        className={styles.addButton}
        onClick={() => router.push('/dashboard/add')} // Navigate to Add Appointment page
      >
        เพิ่มการนัดหมาย
      </button>
      <div className={styles.contentContainer}>
        {error && <div className={styles.error}>{error}</div>}
        {appointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {appointments.map((appointment) => {
              let statusClass = '';
              if (appointment.status === 'ยกเลิกการนัดหมาย') {
                statusClass = styles.statusCancelled;
              } else if (appointment.status === 'ยืนยันการนัดหมาย') {
                statusClass = styles.statusConfirmed;
              } else if (appointment.status === 'รอการยืนยันจากแพทย์') {
                statusClass = styles.statusPending;
              }
  
              return (
                <li key={appointment._id} className={styles.appointmentItem}>
                  <p>วันที่: {new Date(appointment.date).toLocaleDateString('th-TH')}</p>
                  <p>เวลา: {appointment.time}</p>
                  <p>ชื่อจริง: {appointment.firstName}</p>
                  <p>นามสกุล: {appointment.lastName}</p>
                  <p>แพทย์: {appointment.doctor}</p>
                  <p>เหตุผลการนัดหมาย: {appointment.reason}</p>
                  <p className={statusClass}>สถานะ: {appointment.status}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>ไม่มีการนัดหมายในขณะนี้</p>
        )}
      </div>
    </div>
  );
}  
export default AppointmentPage;
