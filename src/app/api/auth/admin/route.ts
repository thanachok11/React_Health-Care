import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

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
