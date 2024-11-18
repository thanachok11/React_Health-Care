import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Appointment from '@/models/Appointment';  // โมเดล Appointment

// ฟังก์ชันสำหรับดึงข้อมูลประวัติการนัดหมาย (GET) โดยกรองสถานะ "สำเร็จแล้ว" หรือ "ยกเลิก"
export async function GET(request: Request) {
  try {
    await connectMongo();

    // ดึงข้อมูลที่มีสถานะ "สำเร็จแล้ว" หรือ "ยกเลิก"
    const appointments = await Appointment.find({
      status: { $in: ["สำเร็จแล้ว", "ยกเลิก"] }
    });

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: 'ไม่พบข้อมูลการนัดหมายที่ตรงกับเงื่อนไข' }, { status: 404 });
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json({ message: 'ไม่สามารถดึงข้อมูลการนัดหมายได้', error: error.message }, { status: 500 });
  }
}
