import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getPatientDetails } from '@/lib/api';
import { FilePlus2 } from 'lucide-react';

export default async function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = await getPatientDetails(params.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-muted-foreground">
            {patient.age} years old, {patient.gender}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href={`/patients/${patient.id}/new-prescription`}>
            <FilePlus2 className="mr-2 h-5 w-5" />
            Start New Prescription
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact Info</h3>
              <p className="text-muted-foreground">{patient.contact}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold">Medical History Summary</h3>
              <p className="text-muted-foreground">{patient.medicalHistory}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Encounters</CardTitle>
            <CardDescription>A log of recent visits and diagnoses.</CardDescription>
          </CardHeader>
          <CardContent>
            {patient.recentEncounters?.length > 0 ? (
              <ul className="space-y-4">
                {patient.recentEncounters.map((encounter: any, index: number) => (
                  <li key={index} className="p-4 bg-secondary rounded-lg">
                    <p className="font-semibold">Date: {new Date(encounter.date).toLocaleDateString()}</p>
                    <p>Diagnosis: {encounter.diagnosis}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recent encounters found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
