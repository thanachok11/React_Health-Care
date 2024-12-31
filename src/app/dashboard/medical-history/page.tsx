"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/navbar1';  // Import Navbar
import styles from './HistoryPage.module.css';  // Import CSS สำหรับหน้า History Page

interface HistoryItem {
  id: number;
  date: string;
  description: string;
  doctor: string;
  status: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ดึงข้อมูลประวัติจาก API
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/auth/history');  // API สำหรับดึงข้อมูลประวัติ
        if (!res.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await res.json();
        setHistory(data.history);  // เก็บข้อมูลประวัติที่ดึงมาใน state
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลประวัติได้');
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>ประวัติการรักษาของคุณ</h1>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : history.length > 0 ? (
          <ul className={styles.historyList}>
            {history.map((item) => (
              <li key={item.id} className={styles.historyItem}>
                <h2>วันที่: {item.date}</h2>
                <p>แพทย์: {item.doctor}</p>
                <p>รายละเอียด: {item.description}</p>
                <p>สถานะ: {item.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีประวัติการรักษาที่ผ่านมา</p>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
