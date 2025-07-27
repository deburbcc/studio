"use client";

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sharePrescription } from "@/lib/actions";
import { Mail, MessageCircle, Building2, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

function ShareButton({ method, prescriptionId, Icon, children }: any) {
    const [state, formAction] = useFormState(sharePrescription, null);
    const { toast } = useToast();

    useEffect(() => {
        if(state?.message) {
            toast({ title: state.message.includes('Failed') ? 'Error' : 'Success', description: state.message });
        }
    }, [state, toast]);

    return (
        <form action={formAction}>
            <input type="hidden" name="prescriptionId" value={prescriptionId} />
            <input type="hidden" name="method" value={method} />
            <Button type="submit" variant="outline" className="w-full justify-start gap-3">
                <Icon className="h-5 w-5" />
                <span>{children}</span>
            </Button>
        </form>
    );
}


export default function PrescriptionSubmittedPage({ params }: { params: { id: string }}) {
  // In a real app, we would fetch prescription details here using the ID.
  const prescription = {
    id: params.id,
    patientName: "Jane Smith",
    diagnosis: "Acute Migraine",
    pdfUrl: "/mock-prescription.pdf"
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold tracking-tight">Prescription Submitted</h1>
        <p className="text-muted-foreground">The prescription for {prescription.patientName} has been successfully created.</p>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Prescription #{prescription.id}</CardTitle>
          <CardDescription>
            Diagnosis: {prescription.diagnosis}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <h3 className="font-semibold">Sharing Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ShareButton method="email" prescriptionId={prescription.id} Icon={Mail}>
              Send to Patient via Email
            </ShareButton>
            <ShareButton method="whatsapp" prescriptionId={prescription.id} Icon={MessageCircle}>
              Send to Patient via WhatsApp
            </ShareButton>
            <ShareButton method="reception" prescriptionId={prescription.id} Icon={Building2}>
              Send to Clinic Reception
            </ShareButton>
            <Button asChild className="w-full justify-start gap-3" variant="secondary">
              <Link href={prescription.pdfUrl} target="_blank">
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
       <div className="text-center">
        <Button asChild>
            <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
