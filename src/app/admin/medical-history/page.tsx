"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MedicalHistoryPage.module.css';

interface MedicalHistory {
  _id: string;
  visitDate: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
}

const MedicalHistoryPage = () => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // ดึงข้อมูลประวัติการรักษาจาก API
  const fetchMedicalHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // ถ้าไม่มี token ให้ไปที่หน้า login
      return;
    }

    try {
      const res = await fetch('/api/auth/medical-history', {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token เพื่อยืนยันตัวตน
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch medical history');
      }

      const data = await res.json();
      setMedicalHistory(data.medicalHistory); // เก็บข้อมูลใน state
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลประวัติการรักษาได้');
    } finally {
      setLoading(false); // หยุดโหลดเมื่อดึงข้อมูลเสร็จสิ้น
    }
  };

  useEffect(() => {
    fetchMedicalHistory(); // ดึงข้อมูลเมื่อ component mount
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1>ประวัติการรักษาของคุณ</h1>
      {error && <p className={styles.error}>{error}</p>}
      {medicalHistory.length > 0 ? (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>วันที่เข้ารับการรักษา</th>
              <th>แพทย์ผู้รักษา</th>
              <th>วินิจฉัย</th>
              <th>การรักษา</th>
              <th>ยาที่ได้รับ</th>
            </tr>
          </thead>
          <tbody>
            {medicalHistory.map((history) => (
              <tr key={history._id}>
                <td>{new Date(history.visitDate).toLocaleDateString('th-TH')}</td>
                <td>{history.doctor}</td>
                <td>{history.diagnosis}</td>
                <td>{history.treatment}</td>
                <td>{history.prescription}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ไม่มีประวัติการรักษา</p>
      )}
    </div>
  );
};

export default MedicalHistoryPage;
