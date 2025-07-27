import { getSession } from './auth';

const API_URL = "https://68866870f52d34140f6c26f9.mockapi.io/projects/automedic/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getSession();
  const headers = new Headers(options.headers);
  if (session) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  headers.set('Content-Type', 'application/json');

  return fetch(url, { ...options, headers });
}

// Mock data in case the API is not responsive
const mockDashboard = {
  patientsToday: 12,
  prescriptionsToday: 8,
  feesCollected: 1250.00,
};

const mockPatients = [
  { id: '1', name: 'John Doe', age: 45, gender: 'Male', lastVisit: '2023-10-15' },
  { id: '2', name: 'Jane Smith', age: 34, gender: 'Female', lastVisit: '2023-10-12' },
  { id: '3', name: 'Peter Jones', age: 52, gender: 'Male', lastVisit: '2023-09-28' },
];

const mockPatientDetail = {
  id: '1',
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  contact: '555-1234',
  medicalHistory: 'Hypertension, Allergic to Penicillin.',
  recentEncounters: [{ date: '2023-10-15', diagnosis: 'Common Cold' }],
};

const mockDoctor = {
    name: 'Dr. Emily Carter',
    specialization: 'Cardiology',
    clinicInfo: 'Heartbeat Clinic, 123 Health St.',
    defaultFee: 150,
}

// API functions
export async function getDashboardStats(doctorId: string) {
  try {
    const res = await fetchWithAuth(`${API_URL}/dashboard?doctor_id=${doctorId}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockDashboard;
  }
}

export async function getPatients(doctorId: string) {
  try {
    const res = await fetchWithAuth(`${API_URL}/patients?doctor_id=${doctorId}`);
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockPatients;
  }
}

export async function getPatientDetails(patientId: string) {
  try {
    const res = await fetchWithAuth(`${API_URL}/patient/${patientId}`);
    if (!res.ok) throw new Error('Failed to fetch patient details');
    return res.json();
  } catch (error) {
    console.error(error);
    return { ...mockPatientDetail, id: patientId, name: mockPatients.find(p => p.id === patientId)?.name || "Unknown Patient" };
  }
}

export async function getDoctorDetails(doctorId: string) {
    try {
        const res = await fetchWithAuth(`${API_URL}/doctor/${doctorId}`);
        if(!res.ok) throw new Error('Failed to fetch doctor details');
        return res.json();
    } catch(error) {
        console.error(error);
        return mockDoctor;
    }
}

export async function getPrescriptionDetails(prescriptionId: string) {
    try {
        const res = await fetchWithAuth(`${API_URL}/prescription/${prescriptionId}`);
        if (!res.ok) throw new Error('Failed to fetch prescription');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        // Return a sensible mock prescription based on an ID
        return {
            id: prescriptionId,
            patientName: "Jane Smith",
            diagnosis: "Migraine",
            medications: [{ name: "Sumatriptan", dosage: "50mg" }],
            pdfUrl: "/mock-prescription.pdf"
        };
    }
}
