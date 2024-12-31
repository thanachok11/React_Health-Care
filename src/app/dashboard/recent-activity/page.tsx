"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/navbar1';  // Import Navbar
import styles from './RecentActivityPage.module.css';  // Import CSS สำหรับหน้า Recent Activity Page

interface Activity {
  id: number;
  activity: string;
  date: string;
  description: string;
}

const RecentActivityPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลกิจกรรมล่าสุดจาก API
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/auth/recent-activity');  // API สำหรับดึงข้อมูลกิจกรรมล่าสุด
        if (!res.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await res.json();
        setActivities(data.activities);  // เก็บข้อมูลกิจกรรมล่าสุดใน state
        setLoading(false);
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลกิจกรรมล่าสุดได้');
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>กิจกรรมล่าสุดของคุณ</h1>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : activities.length > 0 ? (
          <ul className={styles.activityList}>
            {activities.map((activity) => (
              <li key={activity.id} className={styles.activityItem}>
                <h2>{activity.activity}</h2>
                <p>วันที่: {activity.date}</p>
                <p>รายละเอียด: {activity.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>ไม่มีกิจกรรมล่าสุด</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivityPage;
