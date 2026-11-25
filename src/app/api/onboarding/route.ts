import { NextRequest } from 'next/server';
import { POST as profilePost } from '@/app/api/profile/route';

export async function POST(req: NextRequest) {
  return profilePost(req);
}
