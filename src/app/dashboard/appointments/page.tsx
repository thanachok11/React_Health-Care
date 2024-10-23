"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/navbar'; // Import Navbar
import styles from './AppointmentsPage.module.css'; // Import styles

interface Appointment {
  _id: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [error, setError] = useState(''); // สถานะสำหรับแสดงข้อผิดพลาด
  const [showForm, setShowForm] = useState(false); // สถานะสำหรับแสดงฟอร์มการเพิ่มนัดหมาย
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', doctor: '', status: '' }); // เก็บค่าการนัดหมายใหม่
  const router = useRouter();

  // ฟังก์ชันดึงข้อมูลการนัดหมายจาก API
  const fetchAppointments = async () => {
    const token = localStorage.getItem('token'); // ดึง token จาก localStorage
    if (!token) {
      router.push('/login'); // ถ้าไม่มี token ให้ไปหน้า login
      return;
    }

    try {
      const res = await fetch('/api/auth/appointments', {
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

  // ฟังก์ชันเพิ่มการนัดหมายใหม่
  const addAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAppointment), // ส่งข้อมูลการนัดหมายใหม่
      });

      if (!res.ok) {
        throw new Error('Failed to add appointment');
      }

      const addedAppointment = await res.json();
      setAppointments([...appointments, addedAppointment.appointment]); // อัปเดต state
      setNewAppointment({ date: '', time: '', doctor: '', status: '' }); // รีเซ็ตฟอร์ม
      setShowForm(false); // ปิดฟอร์มหลังเพิ่มการนัดหมาย
    } catch (err) {
      setError('ไม่สามารถเพิ่มการนัดหมายได้');
    }
  };

  // ฟังก์ชันลบการนัดหมาย
  const deleteAppointment = async (appointmentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/auth/appointments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId }), // ส่ง appointmentId ที่ต้องการลบ
      });

      if (!res.ok) {
        throw new Error('Failed to delete appointment');
      }

      setAppointments(appointments.filter(app => app._id !== appointmentId)); // ลบการนัดหมายออกจาก state
    } catch (err) {
      setError('ไม่สามารถลบการนัดหมายได้');
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
        <h1 className={styles.title}>การนัดหมายของคุณ</h1>
        {appointments.length > 0 ? (
          <ul className={styles.appointmentList}>
            {appointments.map((appointment, index) => (
              <li key={index} className={styles.appointmentItem}>
                <p>วันที่: {appointment.date}</p>
                <p>เวลา: {appointment.time}</p>
                <p>แพทย์: {appointment.doctor}</p>
                <p>สถานะ: {appointment.status}</p>
                <button onClick={() => deleteAppointment(appointment._id)} className={styles.deleteButton}>ลบ</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีการนัดหมาย</p>
        )}
        {error && <p className={styles.error}>{error}</p>}

        {/* ปุ่มเพิ่มการนัดหมาย */}
        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          {showForm ? 'ยกเลิก' : 'เพิ่มการนัดหมาย'}
        </button>

        {/* ฟอร์มเพิ่มการนัดหมาย */}
        {showForm && (
          <form onSubmit={addAppointment} className={styles.appointmentForm}>
            <div>
              <label>วันที่:</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label>เวลา:</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                required
              />
            </div>
            <div>
              <label>แพทย์:</label>
              <input
                type="text"
                value={newAppointment.doctor}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                required
              />
            </div>
            <div>
              <label>สถานะ:</label>
              <input
                type="text"
                value={newAppointment.status}
                onChange={(e) => setNewAppointment({ ...newAppointment, status: e.target.value })}
                required
              />
            </div>
            <button type="submit">เพิ่มการนัดหมาย</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
