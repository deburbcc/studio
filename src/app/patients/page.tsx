import { getPatients } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PatientList } from "./PatientList";

export default async function PatientsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const initialPatients = await getPatients(session.doctorId);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <p className="text-muted-foreground">Search and manage your patients.</p>
      </div>
      <PatientList initialPatients={initialPatients} />
    </div>
  );
}
