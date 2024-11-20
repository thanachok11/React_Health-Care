import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await connectMongo();

    // รับข้อมูลจาก request body
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      bloodType,
      History_drug_allergy,
    } = await request.json();

    // ตรวจสอบว่ามี email หรือ username อยู่ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
      }
    }

    // สร้างผู้ใช้ใหม่
    const newUser = new User({
      email,
      password,
      username,
      firstName,
      lastName,
      phoneNumber, // เบอร์โทรศัพท์
      address, // ที่อยู่
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, // วันเกิด
      bloodType, // หมู่เลือด
      History_drug_allergy, // ประวัติการแพ้ยา
    });

    // บันทึกผู้ใช้ลงในฐานข้อมูล
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: 'Registration failed', error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
