import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET Method
export async function GET() {
  try {
    await connectMongo();
    const users = await User.find({}).select('-password');  // ไม่ส่งฟิลด์รหัสผ่านกลับไป
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST Method
export async function POST(request: Request) {
  try {
    await connectMongo();
    const { email, username, firstName, lastName, password } = await request.json();

    // ตรวจสอบว่าผู้ใช้นี้มีอยู่ในระบบแล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // เพิ่มผู้ใช้ใหม่
    const newUser = new User({
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword
    });

    await newUser.save();

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add user' }, { status: 500 });
  }
}

// PUT Method - อัปเดตข้อมูลผู้ใช้
export async function PUT(request: Request) {
  try {
    await connectMongo();

    // รับข้อมูลจาก body
    const { id, email, username, firstName, lastName, password } = await request.json();

    // ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // ค้นหาผู้ใช้ตาม id
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ตรวจสอบว่าแต่ละฟิลด์มีข้อมูลหรือไม่ แล้วอัปเดตฟิลด์นั้นๆ
    if (email) user.email = email;
    if (username) user.username = username;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // ถ้ามีการส่งรหัสผ่านใหม่มาให้แฮชรหัสผ่านใหม่
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // บันทึกข้อมูลที่อัปเดตลงในฐานข้อมูล
    await user.save();

    return NextResponse.json({ message: 'User updated successfully', user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user', error: error.message }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  try {
    await connectMongo();

    // รับ id จาก body
    const { id } = await request.json();

    // ตรวจสอบว่า id มีอยู่หรือไม่
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้ที่ต้องการลบมีอยู่จริงหรือไม่
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ลบผู้ใช้
    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);  // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
  }
}




