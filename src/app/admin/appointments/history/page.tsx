"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar/page';
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
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/admin/appointment/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await res.json();
      const sortedAppointments = data.appointments.sort(
        (a: Appointment, b: Appointment) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลการนัดหมายได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = appointments.filter((appointment) => {
      const fullName = `${appointment.firstName} ${appointment.lastName}`;
      return fullName.toLowerCase().includes(query.toLowerCase());
    });

    setFilteredAppointments(filtered);
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
        <h1 className={styles.title}>ประวัติการนัดหมาย</h1>
        <h2 className={styles.title2}>ค้นหาผู้ป่วย</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="ค้นหาผู้ป่วย (ชื่อ-นามสกุล)"
          className={styles.searchInput}
        />
        {filteredAppointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {filteredAppointments.map((appointment) => {
              let statusClass = '';
              if (appointment.status === 'ยกเลิกการนัดหมาย') {
                statusClass = styles.statusCancelled;
              } else if (appointment.status === 'ยืนยันการนัดหมาย') {
                statusClass = styles.statusConfirmed;}
              return (
                <li key={appointment._id} className={`${styles.appointmentItem} ${statusClass}`}>
                  <p>วันที่: {new Date(appointment.date).toLocaleDateString('th-TH')}</p>
                  <p>เวลา: {appointment.time}</p>
                  <p>ชื่อจริง: {appointment.firstName}</p>
                  <p>นามสกุล: {appointment.lastName}</p>
                  <p>แพทย์: {appointment.doctor}</p>
                  <p>เหตุผลการนัดหมาย: {appointment.reason}</p>
                  <p>สถานะ: {appointment.status}</p>
                  <p>ผู้ใช้ ID: {appointment.userId}</p>
                  <Link href={`/admin/edit/${appointment.userId}`}>
                  <button className={styles.edit}>รายละเอียดคนไข้</button>
                </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>ไม่พบผู้ป่วยที่ตรงกับการค้นหา</p>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default HistoryAppointmentsPage;
