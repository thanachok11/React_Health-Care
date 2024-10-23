import mongoose, { Schema, Document } from 'mongoose';

// สร้าง interface สำหรับ Appointment
export interface IAppointment extends Document {
  userId: string;  // อ้างอิงถึงผู้ใช้ที่ทำการนัดหมาย
  date: Date;
  time: string;
  doctor: string;
  status: string;
}

// สร้าง schema สำหรับ Appointment
const AppointmentSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // เชื่อมกับ collection ผู้ใช้
  date: { type: Date, required: true },
  time: { type: String, required: true },
  doctor: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });  // ใช้ timestamps เพื่อเก็บเวลา createdAt และ updatedAt

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
