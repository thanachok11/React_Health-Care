import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import User from '@/models/User'; // Model ของผู้ใช้
import Appointment from '@/models/Appointment'; // Model ของการนัดหมาย
import jwt from 'jsonwebtoken'; // ใช้สำหรับตรวจสอบ JWT token

// ฟังก์ชันสำหรับตรวจสอบ JWT token
const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

// GET - ดึงข้อมูลผู้ใช้และการนัดหมาย
export async function GET(request: Request) {
  try {
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      // ดึงข้อมูลผู้ใช้
      const user = await User.findById(decoded.userId);
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      // ดึงข้อมูลการนัดหมายของผู้ใช้
      const appointments = await Appointment.find({ userId: decoded.userId });

      return NextResponse.json({ user, appointments }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user and appointments', error }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const user = await User.findById(decoded.userId); // ดึงข้อมูลผู้ใช้จาก userId ที่ได้รับจาก token
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      // ดึงข้อมูลจาก request body
      const { date, time, doctor, reason } = await request.json();

      if (!date || !time || !doctor || !reason) {
        console.log(date,time)
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      // สร้างการนัดหมายใหม่
      const newAppointment = new Appointment({
        userId: decoded.userId,
        date,
        time,
        doctor,
        reason,
        status: 'รอการยืนยันจากแพทย์', // ตั้งค่าเริ่มต้นเป็น 'pending'
        firstName: user.firstName,  // เพิ่มชื่อ
        lastName: user.lastName,    // เพิ่มนามสกุล
      });

      await newAppointment.save(); // บันทึกการนัดหมายใหม่

      // รวมชื่อเต็มของผู้ใช้
      const fullName = `${user.firstName} ${user.lastName}`;

      // ส่งกลับข้อมูลการนัดหมายพร้อมชื่อเต็มของผู้ใช้
      return NextResponse.json(
        
        { message: 'Appointment added successfully', appointment: newAppointment, fullName },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to add appointment', error }, { status: 500 });
  }
}


// DELETE - ลบการนัดหมายของผู้ใช้ที่เข้าสู่ระบบ
export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token
    const body = await request.json(); // รับข้อมูลการนัดหมายที่ต้องการลบ
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      const appointment = await Appointment.findOneAndDelete({
        _id: body.appointmentId,
        userId: decoded.userId, // ลบการนัดหมายที่เป็นของผู้ใช้นั้น
      });

      if (!appointment) {
        return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Appointment deleted' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete appointment', error }, { status: 500 });
  }
}