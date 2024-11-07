"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './EditHistoryPage.module.css'; // ไฟล์ CSS สำหรับจัดแต่งหน้า

const AddMedicalHistoryPage = ({ params }: { params: { userID: string } }) => {
  const [formData, setFormData] = useState({
    visitDate: '',
    doctor: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันสำหรับการส่งข้อมูล
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/auth/admin/medical-history/userID/${params.userID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('เพิ่มข้อมูลประวัติการรักษาสำเร็จ');
        router.push(`/admin/medical-history/${params.userID}`); // กลับไปที่หน้าประวัติการรักษา
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'ไม่สามารถเพิ่มข้อมูลได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    }
  };

  return (
    <div className={styles.container}>
      <h1>เพิ่มประวัติการรักษา</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>วันที่เข้ารับการรักษา</label>
        <input
          type="date"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          required
        />

        <label>แพทย์ผู้รักษา</label>
        <input
          type="text"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          placeholder="ชื่อแพทย์"
          required
        />

        <label>การวินิจฉัย</label>
        <textarea
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          placeholder="ผลการวินิจฉัย"
          required
        />

        <label>การรักษา</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          placeholder="รายละเอียดการรักษา"
          required
        />

        <label>ยาที่ได้รับ</label>
        <textarea
          name="prescription"
          value={formData.prescription}
          onChange={handleChange}
          placeholder="ยาที่จ่ายให้ผู้ป่วย"
          required
        />

        <button type="submit" className={styles.button}>บันทึกข้อมูล</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default AddMedicalHistoryPage;
