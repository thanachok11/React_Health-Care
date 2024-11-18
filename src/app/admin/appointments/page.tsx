"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../appointments/Navbar/page';
import styles from './AdminAppointmentsPage.module.css';
import axios from 'axios';


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

const AdminAppointmentsPage = () => {
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

  const updateStatus = async (_id: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await axios.put(
        `/api/auth/admin/appointment/${_id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // อัปเดตสถานะใน state
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === _id
              ? { ...appointment, status: newStatus }
              : appointment
          )
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return <p className={styles.loading}>กำลังโหลดข้อมูล...</p>;
  }

return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>รายการนัดหมาย</h1>
        {appointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {appointments.map((appointment, index) => (
              <li key={index} className={styles.appointmentItem}>
                <p>วันที่: {new Date(appointment.date).toLocaleDateString('th-TH')}</p>
                <p>เวลา: {appointment.time}</p>
                <p>ชื่อจริง: {appointment.firstName}</p>
                <p>นามสกุล: {appointment.lastName}</p>
                <p>แพทย์: {appointment.doctor}</p>
                <p>เหตุผลการนัดหมาย: {appointment.reason}</p>
                <p>สถานะ: {appointment.status}</p>
                <p>ผู้ใช้ ID: {appointment.userId}</p>
                <div>
                  <button
                    onClick={() => updateStatus(appointment._id, 'ยืนยันการนัดหมาย')}
                    disabled={appointment.status === 'ยืนยันการนัดหมาย'}
                    className={styles.confirm}
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => updateStatus(appointment._id, 'ยกเลิกการนัดหมาย')}
                    disabled={appointment.status === 'ยกเลิกการนัดหมาย'}
                    className={styles.cancel}
                  >
                    ยกเลิก
                  </button>
                </div>
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
