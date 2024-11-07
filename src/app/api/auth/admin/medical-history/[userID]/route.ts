import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import MedicalHistory, { IMedicalHistory } from '@/models/MedicalHistory';

export async function POST(request: Request, { params }: { params: { userID: string } }) {
  try {
    await connectMongo();

    const { userID } = params;
    
    // รับข้อมูลจาก body
    const { visitDate, doctor, diagnosis, treatment, prescription } = await request.json();

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!visitDate || !doctor || !diagnosis || !treatment || !prescription) {
      return NextResponse.json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    // สร้างข้อมูลประวัติการรักษาใหม่
    const newMedicalHistory: IMedicalHistory = new MedicalHistory({
      userId: userID,
      visitDate,
      doctor,
      diagnosis,
      treatment,
      prescription,
    });

    // บันทึกข้อมูลลงในฐานข้อมูล
    await newMedicalHistory.save();

    return NextResponse.json({ message: 'เพิ่มข้อมูลประวัติการรักษาสำเร็จ', data: newMedicalHistory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'ไม่สามารถเพิ่มข้อมูลได้', error: error.message }, { status: 500 });
  }
}
