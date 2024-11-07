import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    await connectMongo();

    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded !== 'string' && 'userId' in decoded) {
      // Fetch only confirmed appointments
      const appointments = await Appointment.find({ status: 'confirmed' });
      return NextResponse.json({ appointments }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch confirmed appointments', error }, { status: 500 });
  }
}
