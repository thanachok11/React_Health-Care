import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ใช้ฟังก์ชัน connectMongo ที่เชื่อมต่อ MongoDB
import MedicalHistory from '@/models/MedicalHistory'; // model สำหรับ collection medicalhistories

// ฟังก์ชันสำหรับดึงข้อมูลคนไข้ตาม userId
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // เชื่อมต่อกับฐานข้อมูล
    await connectMongo();

    // ค้นหาข้อมูลจาก collection "medicalhistories" โดยใช้ userId
    const patient = await MedicalHistory.findOne({ _id:params.userId });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ patient }); // ส่งข้อมูลคนไข้ในรูปแบบ JSON
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch patient details' }, { status: 500 });
  }
}
