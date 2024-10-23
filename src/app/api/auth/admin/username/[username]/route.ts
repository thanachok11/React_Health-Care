import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    await connectMongo();
    const user = await User.findOne({ username: params.username }).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { username: string } }) {
  try {
    const { email, firstName, lastName } = await request.json();
    await connectMongo();

    const updatedUser = await User.findOneAndUpdate(
      { username: params.username },
      { email, firstName, lastName },
      { new: true }
    ).select('-password');

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
// ลบผู้ใช้ (DELETE)
export async function DELETE(request: Request, { params }: { params: { username: string } }) {
    try {
      await connectMongo(); // เชื่อมต่อ MongoDB
  
      // ค้นหาผู้ใช้ตาม username และลบออก
      const deletedUser = await User.findOneAndDelete({ username: params.username });
  
      if (!deletedUser) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
      return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
    }
  }
