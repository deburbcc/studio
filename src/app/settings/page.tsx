"use client";

import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { getDoctorDetails } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateDoctorSettings } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";

type Doctor = {
  name: string;
  specialization: string;
  clinicInfo: string;
  defaultFee: number;
};

export default function SettingsPage() {
  const [state, formAction] = useFormState(updateDoctorSettings, null);
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    async function loadDoctorData() {
      // getSession is server-side, so we need a client-side way to get the doctorId or fetch data
      // For this example, we'll assume the API endpoint infers the doctor from the auth token
      const session = await getSession();
      if(session) {
        const data = await getDoctorDetails(session.doctorId);
        setDoctor(data);
      }
    }
    loadDoctorData();
  }, []);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message.includes('Failed') ? 'Error' : 'Success',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  if (!doctor) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <Skeleton className="h-12 w-32 mt-4" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and clinic information.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
          <CardDescription>Update your personal and professional details here.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={doctor.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" name="specialization" defaultValue={doctor.specialization} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicInfo">Clinic Info</Label>
              <Input id="clinicInfo" name="clinicInfo" defaultValue={doctor.clinicInfo} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultFee">Default Consultation Fee ($)</Label>
              <Input id="defaultFee" name="defaultFee" type="number" defaultValue={doctor.defaultFee} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
