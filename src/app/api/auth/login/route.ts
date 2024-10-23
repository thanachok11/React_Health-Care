import { NextResponse } from '../../../../../node_modules/next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
      await connectMongo();
      console.log('MongoDB connected');
  
      const { email, password } = await request.json();
      console.log('Received email and password:', { email, password });
  
      // ตรวจสอบว่าผู้ใช้งานมีอยู่ในระบบหรือไม่
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return NextResponse.json({ message: 'User not found' }, { status: 400 });
      }
  
      console.log('User found:', user);
  
      // ตรวจสอบรหัสผ่าน
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
      }
  
      console.log('Password is valid');
  
      // สร้าง JWT token โดยใช้ JWT_SECRET จาก .env.local
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });
      console.log('JWT Token created:', token);
  
      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      console.error('Error during login:', error);
      return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });
    }
  }