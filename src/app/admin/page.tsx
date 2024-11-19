"use client";
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Navbar from './Navbar/page';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './AdminPage.module.css'; // Import CSS module

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [appointmentCount, setAppointmentCount] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null); // State สำหรับข้อมูลกราฟผู้ใช้
  const [appointmentData, setAppointmentData] = useState<any>(null); // State สำหรับข้อมูลกราฟการนัดหมาย

  // ดึงข้อมูลจาก API ที่เราเพิ่งสร้างขึ้น
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/auth/admin/home');
        const data = await response.json();

        if (data.success) {
          setUserCount(data.data.userCount);
          setAppointmentCount(data.data.appointmentCount);

          // ตั้งค่าข้อมูลกราฟ
          setUserData({
            labels: data.data.months,
            datasets: [
              {
                label: 'จำนวนผู้ใช้',
                data: data.data.userCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });

          setAppointmentData({
            labels: data.data.months,
            datasets: [
              {
                label: 'จำนวนการนัดหมาย',
                data: data.data.appointmentCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error('ไม่สามารถดึงข้อมูลได้');
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาด:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.Navbar}>
      <Navbar />
    <div className={styles.container}>
      <h1 className={styles.title}>แดชบอร์ด </h1>
      <h2 className={styles.title2}> ข้อมูลสถิติ</h2>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <strong>จำนวนผู้ใช้</strong> 
          {userCount !== null ? userCount : 'กำลังโหลด...'} คน
        </div>
        <div className={styles.statItem}>
          <strong>จำนวนการนัดหมาย</strong>
          {appointmentCount !== null ? appointmentCount : 'กำลังโหลด...'} รายการ
        </div>
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>กราฟจำนวนผู้ใช้แยกตามเดือน</h3>
        {userData ? (
          <Bar data={userData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `${tooltipItem.raw} ผู้ใช้`;
                  },
                },
              },
            },
          }} />
        ) : (
          <div className={styles.loader}>กำลังโหลดกราฟ...</div>
        )}
      </div>

      <div className={styles.graphContainer}>
        <h3 className={styles.graphTitle}>กราฟจำนวนการนัดหมายแยกตามเดือน</h3>
        {appointmentData ? (
          <Bar data={appointmentData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `${tooltipItem.raw} การนัดหมาย`;
                  },
                },
              },
            },
          }} />
        ) : (
          <div className={styles.loader}>กำลังโหลดกราฟ...</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
