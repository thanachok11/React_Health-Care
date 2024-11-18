import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User'; // สมมติว่าคุณมี Model สำหรับผู้ใช้ด้วย

// การจัดการคำขอ GET สำหรับการนับจำนวนผู้ใช้และการนัดหมาย
export async function GET(req: Request) {
  try {
    await connectMongo();

    // นับจำนวนผู้ใช้ทั้งหมด
    const userCount = await User.countDocuments();

    // นับจำนวนการนัดหมายทั้งหมด
    const appointmentCount = await Appointment.countDocuments();

    // ดึงจำนวนการนัดหมายตามเดือน
    const appointmentCountByMonth = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: '$date' }, // กลุ่มข้อมูลตามเดือน
          count: { $sum: 1 }, // นับจำนวนการนัดหมายในแต่ละเดือน
        },
      },
      {
        $sort: { _id: 1 }, // เรียงลำดับจากเดือนแรกไปเดือนสุดท้าย
      },
    ]);

    // ดึงจำนวนผู้ใช้ตามเดือน (สมมติว่ามีการบันทึกวันที่สมัครของผู้ใช้)
    const userCountByMonth = await User.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' }, // กลุ่มข้อมูลตามเดือนที่สมัคร
          count: { $sum: 1 }, // นับจำนวนผู้ใช้ที่สมัครในแต่ละเดือน
        },
      },
      {
        $sort: { _id: 1 }, // เรียงลำดับจากเดือนแรกไปเดือนสุดท้าย
      },
    ]);

    // สร้างรูปแบบข้อมูลที่ต้องการส่งกลับ
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    // แปลงข้อมูลจากการนับให้เป็นรูปแบบที่เราต้องการ (ใช้เดือนและจำนวน)
    const appointmentCounts = appointmentCountByMonth.map(item => item.count);
    const userCounts = userCountByMonth.map(item => item.count);
    const appointmentMonths = appointmentCountByMonth.map(item => months[item._id - 1]);
    const userMonths = userCountByMonth.map(item => months[item._id - 1]);

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      data: {
        userCount,
        appointmentCount,
        months: appointmentMonths,
        userCounts,
        appointmentCounts,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
    });
  }
}
