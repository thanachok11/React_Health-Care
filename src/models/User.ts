import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: Date;
  bloodType?: string;
  History_drug_allergy?: string[];
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String }, // เพิ่มฟิลด์เบอร์โทรศัพท์
    address: { type: String }, // เพิ่มฟิลด์ที่อยู่
    dateOfBirth: { type: Date }, // เพิ่มฟิลด์วันเกิด
    bloodType: { type: String, enum: ['A', 'B', 'AB', 'O'] }, // เพิ่มฟิลด์หมู่เลือด
    History_drug_allergy: { type: [String] }, // เพิ่มฟิลด์ประวัติการแพ้ยา (Array)
  },
  {
    timestamps: true, // เพิ่ม timestamp (createdAt, updatedAt)
  }
);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
