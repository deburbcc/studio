import { cookies } from 'next/headers';

export async function getSession() {
  const token = cookies().get('auth_token')?.value;
  const doctorId = cookies().get('doctor_id')?.value;

  if (!token || !doctorId) {
    return null;
  }

  return { token, doctorId };
}
