"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // นำเข้า CSS ของ react-calendar
import styles from "./AddAppointmentsPage.module.css";

const AddAppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>(""); // เก็บเวลา
  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    reason: "",
    firstName: "",
    lastName: "",
    status: "รอการยืนยันจากแพทย์",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAppointment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  
    if (!selectedDate || !time) {
      setError("กรุณาเลือกวันที่และเวลา");
      return;
    }
  
    try {
      // รวมวันที่และเวลา
      const appointmentDate = new Date(selectedDate);
      const [hours, minutes] = time.split(":");
      appointmentDate.setHours(Number(hours), Number(minutes), 0, 0); // ตั้งเวลา
  
      // แปลงเป็นเวลาท้องถิ่นของประเทศไทย
      const localDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(appointmentDate);
  
      const localTime = appointmentDate.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Bangkok",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
  
      const res = await fetch("/api/auth/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newAppointment,
          date: localDate, // วันที่แบบไทย
          time: localTime, // เวลาแบบไทย
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to add appointment");
      }
  
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/appointments");
      }, 3000);
    } catch (err) {
      setError("ไม่สามารถเพิ่มการนัดหมายได้");
    }
  };
  

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>เพิ่มการนัดหมาย</h1>
      <div className={styles.contentContainer}>
        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.successPopup}>
            <span className={styles.successIcon}>✔</span>
            
            <p>บันทึกข้อมูลสำเร็จ!</p>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addAppointment();
          }}
          className={styles.form}
        >
          <div>
            <label>แพทย์:</label>
            <input
              type="text"
              name="doctor"
              value={newAppointment.doctor}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>วันที่:</label>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
          <div>
            <label>เวลา:</label>
            <input
              type="time"
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>สาเหตุการนัดหมาย:</label>
            <textarea
              name="reason"
              value={newAppointment.reason}
              onChange={handleInputChange}
              required
            />
          </div>
          <a href="/dashboard/appointments/" className="back">
            กลับไปยังหน้ารายการการนัดหมาย
          </a>
          <button className={styles.submit} type="submit">บันทึกการนัดหมาย</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentPage;
