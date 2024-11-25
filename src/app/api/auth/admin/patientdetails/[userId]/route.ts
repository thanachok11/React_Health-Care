import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import User from '@/models/User';
import Appointment from '@/models/Appointment'; // Import the Appointment model

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    await connectMongo();

    // Fetch the user by userId, excluding password field
    const user = await User.findById(params.userId).select('-password'); 
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Fetch appointments related to the userId
    const appointments = await Appointment.find({ userId: params.userId });

    // If appointments are found, return both user and appointments data
    return NextResponse.json({ user, appointments });

  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user and appointments', error: error.message }, { status: 500 });
  }
}
