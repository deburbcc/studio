"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const API_URL = "https://68866870f52d34140f6c26f9.mockapi.io/projects/automedic/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = cookies().get('auth_token')?.value;
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, { ...options, headers });
}

// Auth Actions
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // In a real app, this would be a POST request. MockAPI GET is used for simplicity.
    const res = await fetch(`${API_URL}/login`);
    if (!res.ok) throw new Error("Login failed. Please check your credentials.");
    const users = await res.json();
    
    // MockAPI doesn't support POST, so we'll find the user.
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return { message: "Invalid email or password" };
    }
    
    const { token, doctorId } = user;

    cookies().set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    cookies().set("doctor_id", doctorId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });

  } catch (error: any) {
    console.error(error);
    return { message: error.message || "An unexpected error occurred." };
  }

  redirect("/");
}

export async function logout() {
  cookies().delete("auth_token");
  cookies().delete("doctor_id");
  redirect("/login");
}


// Settings Action
export async function updateDoctorSettings(prevState: any, formData: FormData) {
  const doctorId = cookies().get('doctor_id')?.value;
  if (!doctorId) return { message: 'Authentication Error' };

  const schema = z.object({
    name: z.string().min(1),
    specialization: z.string().min(1),
    clinicInfo: z.string().min(1),
    defaultFee: z.coerce.number().min(0),
  });
  
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if(!parsed.success) {
    return { message: 'Invalid data' };
  }

  try {
    const res = await fetchWithAuth(`${API_URL}/doctor/update`, {
      method: 'POST',
      body: JSON.stringify({ ...parsed.data, doctorId }),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return { message: 'Settings updated successfully' };
  } catch (error: any) {
    return { message: error.message || 'An error occurred' };
  }
}

// Prescription Actions
export async function createPrescription(patientId: string, data: any) {
  const doctorId = cookies().get('doctor_id')?.value;
  if (!doctorId) {
    throw new Error('Unauthorized');
  }

  try {
    const res = await fetchWithAuth(`${API_URL}/prescription`, {
      method: 'POST',
      body: JSON.stringify({ ...data, patientId, doctorId }),
    });

    if (!res.ok) {
      throw new Error('Failed to create prescription.');
    }
    const result = await res.json();
    redirect(`/prescriptions/${result.id}/submitted`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sharePrescription(prevState: any, formData: FormData) {
    const prescriptionId = formData.get('prescriptionId');
    const method = formData.get('method');

    try {
        const res = await fetchWithAuth(`${API_URL}/send-prescription`, {
            method: 'POST',
            body: JSON.stringify({ prescriptionId, method })
        });
        if (!res.ok) throw new Error(`Failed to send via ${method}`);
        return { message: `Prescription sent successfully via ${method}!` };
    } catch(error: any) {
        return { message: error.message || 'An error occurred' };
    }
}
