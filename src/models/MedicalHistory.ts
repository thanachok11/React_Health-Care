import mongoose, { Schema, Document } from 'mongoose';

// สร้าง interface สำหรับ Medical History
export interface IMedicalHistory extends Document {
  userId: string;  // อ้างอิงถึงผู้ใช้ที่บันทึกประวัติ
  visitDate: Date;  // วันที่เข้ารับการรักษา
  doctor: string;  // ชื่อแพทย์ผู้รักษา
  diagnosis: string;  // การวินิจฉัย
  treatment: string;  // การรักษาที่ได้รับ
  prescription: string;  // ยาที่ได้รับ
}

// สร้าง schema สำหรับ Medical History
const MedicalHistorySchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // เชื่อมกับ collection ผู้ใช้
  visitDate: { type: Date, required: true },
  doctor: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  prescription: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.MedicalHistory || mongoose.model<IMedicalHistory>('MedicalHistories', MedicalHistorySchema);
