"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/page";
import styles from "./EditProfilePage.module.css";

interface User {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  sex: string;
  img: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  bloodType: string;
  History_drug_allergy: string[];
}

const EditProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/auth/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Failed to update user data");
      }
      setSuccessMessage('บันทึกข้อมูลสำเร็จ');
        setError('');
        setTimeout(() => {
          setSuccessMessage('');
          router.push('../../dashboard/profile');
        }, 2000);
    } catch (err) {
      setError("ไม่สามารถแก้ไขข้อมูลได้");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <h1 className={styles.title}>แก้ไขข้อมูลโปรไฟล์</h1>
      <div className={styles.contentContainer}> 
        {loading && <p className={styles.loading}>กำลังโหลดข้อมูล...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {user && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>ชื่อผู้ใช้:</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ชื่อจริง:</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>นามสกุล:</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>เพศ:</label>
              <input
                type="text"
                name="sex"
                value={user.sex}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>เบอร์โทรศัพท์:</label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ที่อยู่:</label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>วันเกิด</label>
              <input
                type="text"
                name="dateOfBirth"
                value={new Date(user.dateOfBirth).toLocaleDateString("th-TH")}
                onChange={handleInputChange}
                className={styles.input}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <label>กรุ๊ปเลือด:</label>
              <input
                type="text"
                name="bloodType"
                value={user.bloodType}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className={styles.inputGroup}>
              <label>ประวัติแพ้ยา:</label>
              <input
                type="text"
                name="History_drug_allergy"
                value={user.History_drug_allergy.join(", ")}
                onChange={(e) =>
                  setUser({
                    ...user,
                    History_drug_allergy: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
              />
            </div>
            <button type="submit" className={styles.saveButton}>
              บันทึกข้อมูล
            </button>
            {successMessage && <p className={styles.success}>{successMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
