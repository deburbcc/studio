"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createPrescription } from "@/lib/actions";

const prescriptionSchema = z.object({
  symptoms: z.string().min(1, "Symptoms are required."),
  diagnosis: z.string().min(1, "Diagnosis is required."),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Medication name is required."),
      drugCode: z.string().optional(),
      dosage: z.string().min(1, "Dosage is required."),
      duration: z.string().min(1, "Duration is required."),
      dosageForm: z.string().optional(),
    })
  ).min(1, "At least one medication is required."),
  investigations: z.object({
    observation: z.string().optional(),
    comments: z.string().optional(),
  }).optional(),
  clinicalProcedures: z.object({
    procedureName: z.string().optional(),
    referringDoctor: z.string().optional(),
    date: z.string().optional(),
  }).optional(),
  rehabilitation: z.object({
    therapyType: z.string().optional(),
    numberOfSessions: z.coerce.number().optional(),
  }).optional(),
  reviewDetails: z.object({
    nextVisitDate: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export default function NewPrescriptionPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      symptoms: "",
      diagnosis: "",
      medications: [{ name: "", dosage: "", duration: "" }],
      reviewDetails: { notes: "" },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  async function onSubmit(values: z.infer<typeof prescriptionSchema>) {
    try {
      await createPrescription(params.id, values);
      toast({ title: "Success", description: "Prescription created successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create prescription.",
      });
    }
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">New Prescription</h1>
        <p className="text-muted-foreground">Fill out the form to create a new prescription.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader><CardTitle>Clinical Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="symptoms" render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Fever, headache, cough..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="diagnosis" render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosis</FormLabel>
                  <FormControl><Input placeholder="e.g., Viral Infection" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Medications</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", drugCode: "", dosage: "", duration: "", dosageForm: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                <div key={field.id} className="p-4 space-y-4 border rounded-lg relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <FormField control={form.control} name={`medications.${index}.name`} render={({ field }) => (
                            <FormItem className="lg:col-span-2">
                                <FormLabel>Medication Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Paracetamol" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name={`medications.${index}.dosage`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dosage</FormLabel>
                                <FormControl><Input placeholder="e.g., 500mg" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name={`medications.${index}.duration`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl><Input placeholder="e.g., 5 days" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name={`medications.${index}.dosageForm`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Form</FormLabel>
                                <FormControl><Input placeholder="e.g., Tablet" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-7 w-7 bg-background" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
                ))}
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Investigations</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="investigations.observation" render={({ field }) => (
                        <FormItem><FormLabel>Observation</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="investigations.comments" render={({ field }) => (
                        <FormItem><FormLabel>Comments</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                    )} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Review Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="reviewDetails.nextVisitDate" render={({ field }) => (
                        <FormItem><FormLabel>Next Visit Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="reviewDetails.notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes for Review</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                    )} />
                </CardContent>
            </Card>
          </div>

          <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit Prescription"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
