// ตัวอย่าง API สำหรับดึงข้อมูลกิจกรรมล่าสุด
import { NextResponse } from 'next/server';

// ข้อมูลกิจกรรมตัวอย่าง
const activities = [
  { id: 1, activity: 'เข้ารับการตรวจสุขภาพ', date: '2024-09-20', description: 'การตรวจสุขภาพทั่วไปที่คลินิก' },
  { id: 2, activity: 'นัดหมายการตรวจร่างกาย', date: '2024-08-18', description: 'นัดหมายกับแพทย์เพื่อทำการตรวจสุขภาพ' },
];

export async function GET() {
  try {
    // ส่งข้อมูลกิจกรรมล่าสุดกลับไป
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch activities' }, { status: 500 });
  }
}
