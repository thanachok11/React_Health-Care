import { NextResponse } from '../../../../../node_modules/next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import User from '@/models/User'; // Model ของผู้ใช้
import jwt from 'jsonwebtoken'; // ใช้สำหรับตรวจสอบ JWT token

// ฟังก์ชันสำหรับตรวจสอบ JWT token
const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

// GET - ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
export async function GET(request: Request) {
  try {
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token

    // ตรวจสอบว่า decoded เป็น JwtPayload หรือไม่
    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const user = await User.findById(decoded.userId); // ดึงข้อมูลผู้ใช้จาก userId ใน token

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user', error }, { status: 500 });
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้ที่เข้าสู่ระบบ
export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token
    const body = await request.json(); // ดึงข้อมูลจาก request body
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    // ตรวจสอบว่า decoded เป็น JwtPayload หรือไม่
    if (typeof decoded !== 'string' && 'userId' in decoded) {
      // อัปเดตผู้ใช้ที่เข้าสู่ระบบโดยใช้ userId จาก token
      const updatedUser = await User.findByIdAndUpdate(decoded.userId, {
        email: body.email,
        username: body.username,
        firstName: body.firstName,
        lastName: body.lastName,
        updatedAt: new Date() // อัปเดตเวลาที่มีการแก้ไขล่าสุด
      }, { new: true });

      if (!updatedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user', error }, { status: 500 });
  }
}

// DELETE - ลบข้อมูลผู้ใช้ที่เข้าสู่ระบบ
export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token
    await connectMongo(); // เชื่อมต่อกับ MongoDB
    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const user = await User.findById(decoded.userId); // ดึงข้อมูลผู้ใช้จาก userId ใน token
    
    // ลบผู้ใช้ที่เข้าสู่ระบบโดยใช้ userId จาก token
    await User.findByIdAndDelete(decoded.userId);
    }
    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error }, { status: 500 });
  }
}
