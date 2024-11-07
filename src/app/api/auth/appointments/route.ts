import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import Appointment from '@/models/Appointment'; // Model สำหรับการนัดหมาย
import jwt, { JwtPayload } from 'jsonwebtoken';

// ฟังก์ชันสำหรับตรวจสอบ JWT token
const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

// GET - ดึงการนัดหมายของผู้ใช้ที่เข้าสู่ระบบ
export async function GET(request: Request) {
  try {
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      // ดึงการนัดหมายของผู้ใช้ที่เข้าสู่ระบบ
      const appointments = await Appointment.find({ userId: decoded.userId }).select('date time doctor status');

      return NextResponse.json({ appointments }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch appointments', error }, { status: 500 });
  }
}

// POST - สร้างการนัดหมายใหม่สำหรับผู้ใช้ที่เข้าสู่ระบบ
export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token
    const body = await request.json(); // รับข้อมูลการนัดหมายจาก request body
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    if (typeof decoded !== 'string' && 'userId' in decoded ) {
      // สร้างการนัดหมายใหม่พร้อมสถานะ
      const newAppointment = new Appointment({
        userId: decoded.userId, // เชื่อมการนัดหมายกับผู้ใช้ที่เข้าสู่ระบบ
        date: body.date,
        time: body.time,
        doctor: body.doctor,
        status: body.status || 'รอการยืนยันจากแพทย์', // ตั้งสถานะเริ่มต้นเป็น 'pending' หากไม่ระบุ
      });
      

      await newAppointment.save();

      return NextResponse.json({ appointment: newAppointment }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create appointment', error }, { status: 500 });
  }
}

// PUT - อัปเดตการนัดหมายของผู้ใช้ที่เข้าสู่ระบบ
export async function PUT(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token); // ถอดรหัส JWT token
    const body = await request.json(); // รับข้อมูลการนัดหมายจาก request body
    await connectMongo(); // เชื่อมต่อกับ MongoDB

    if (typeof decoded !== 'string' && 'userId' in decoded) {
      // อัปเดตการนัดหมายรวมถึงสถานะ
      const updatedAppointment = await Appointment.findOneAndUpdate(
        { _id: body.appointmentId, userId: decoded.userId }, // ตรวจสอบให้แน่ใจว่าเป็นการนัดหมายของผู้ใช้คนนั้น
        { date: body.date, time: body.time, doctor: body.doctor, status: body.status || 'pending' },
        { new: true }
      );

      if (!updatedAppointment) {
        return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
      }

      return NextResponse.json({ appointment: updatedAppointment }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update appointment', error }, { status: 500 });
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
