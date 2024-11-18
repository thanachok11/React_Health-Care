import mongoose, { Schema, Document } from 'mongoose';

// สร้าง interface สำหรับ Appointment
export interface IAppointment extends Document {
  userId: string;  // อ้างอิงถึงผู้ใช้ที่ทำการนัดหมาย
  date: Date;
  doctor: string;
  time: string;
  reason: string;  // แก้ไขการสะกด
  firstName: string;
  lastName: string;
  status: string;  // สถานะการนัดหมาย (Pending, Confirmed, Cancelled)
}

// สร้าง schema สำหรับ Appointment
const AppointmentSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', // เชื่อมกับ collection ผู้ใช้
      required: true 
    },
    date: { type: Date, required: true },
    doctor: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true }, // แก้ไขการสะกด
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    status: { type: String, required: true}
  },
  { 
    timestamps: true  // ใช้ timestamps เพื่อเก็บเวลา createdAt และ updatedAt 
  }
);

// สร้างและส่งออก model
export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
