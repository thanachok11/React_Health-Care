import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import MedicalHistory from '@/models/MedicalHistory'; // Model สำหรับการรักษา
import User from '@/models/User'; // Model ของผู้ใช้
import jwt, { JwtPayload } from 'jsonwebtoken';

// ฟังก์ชันตรวจสอบว่า token เป็น admin หรือไม่
const verifyAdmin = async (token: string): Promise<boolean> => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  const user = await User.findById(decoded.userId);
  return user?.role === 'admin'; // ตรวจสอบว่า role ของผู้ใช้คือ admin
};

// GET - ดึงข้อมูลการรักษาทั้งหมด (เฉพาะ admin)
export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    if (!(await verifyAdmin(token))) {
      return NextResponse.json({ message: 'Access denied: Admins only' }, { status: 403 });
    }

    await connectMongo(); // เชื่อมต่อ MongoDB

    // ดึงข้อมูลการรักษาทั้งหมด
    const medicalHistories = await MedicalHistory.find();
    return NextResponse.json({ medicalHistories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch medical histories', error: error.message }, { status: 500 });
  }
}

// POST - เพิ่มข้อมูลการรักษาใหม่ (เฉพาะ admin)
export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    if (!(await verifyAdmin(token))) {
      return NextResponse.json({ message: 'Access denied: Admins only' }, { status: 403 });
    }

    const body = await request.json(); // รับข้อมูลจาก body
    await connectMongo(); // เชื่อมต่อ MongoDB

    // เพิ่มข้อมูลการรักษาใหม่
    const newHistory = new MedicalHistory({
      userId: body.userId, // ผู้ใช้ที่ทำการรักษา
      visitDate: body.visitDate,
      doctor: body.doctor,
      diagnosis: body.diagnosis,
      treatment: body.treatment,
      prescription: body.prescription,
    });

    await newHistory.save();
    return NextResponse.json({ medicalHistory: newHistory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add medical history', error: error.message }, { status: 500 });
  }
}
