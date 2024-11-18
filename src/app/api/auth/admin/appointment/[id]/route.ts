// route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;  // ดึงข้อมูล _id จาก params
  try {
    const { status } = await request.json();
    await connectMongo();
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,  // ใช้ id จาก params
      { status },
      { new: true }  // จะส่งกลับข้อมูลหลังจากอัปเดต
    );

    if (!appointment) {
      return NextResponse.json({ success: false, message: 'ไม่พบการนัดหมาย' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'เกิดข้อผิดพลาดในการอัปเดต' });
  }
}
