import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Appointment from '@/models/Appointment';


export async function GET() {
    try {
      await connectMongo();
      const appointments = await Appointment.find({}).select('-password');  // ไม่ส่งฟิลด์รหัสผ่านกลับไป
      return NextResponse.json({ appointments }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
    }
  }

  