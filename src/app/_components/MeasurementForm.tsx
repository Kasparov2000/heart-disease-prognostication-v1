import React, {useState} from 'react';
import {ReloadIcon} from "@radix-ui/react-icons"
import {Button} from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useToast} from "@/components/ui/use-toast";
import {Id} from '../../../convex/_generated/dataModel';
import PredictionResult from "@/app/_components/PredictionResult";
import Glossary from "@/app/_components/Glossary";
import PatientCard, {calculateAge} from "@/app/_components/PatientCard";
import {useUser} from "@clerk/nextjs";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {z} from "zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const formSchema = z.object({
    age: z.string()
        .refine(value => !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 120,
            {message: 'Age should be between 0 and 120.'}),
    cp: z.string()
        .refine(value => ['0', '1', '2', '3'].includes(value),
            {message: 'Invalid Chest Pain Type. Valid options: 0, 1, 2, 3.'}),
    sex: z.string()
        .refine(value => ['0', '1'].includes(value),
            {message: 'Invalid Sex. Select Male or Female'}),
    trtbps: z.string()
        .refine(value => !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 90 && parseInt(value, 10) <= 200,
            {message: 'Resting BP should be between 90 and 200.'}),
    chol: z.string()
        .refine(value => !isNaN(parseInt(value, 10)) && parseInt(value, 10) >= 100 && parseInt(value, 10) <= 500,
            {message: 'Cholesterol level should be between 100 and 500.'}),
    fbs: z.string()
        .refine(value => ['0', '1'].includes(value),
            {message: 'Invalid fasting blood sugar option. Valid options: 0 or 1.'}),
    restecg: z.string()
        .refine(value => ['0', '1', '2'].includes(value),
            {message: 'Invalid ECG result. Valid options: 0, 1, 2.'}),
    exang: z.string()
        .refine(value => ['0', '1'].includes(value),
            {message: 'Invalid exercise-induced angina option. Valid options: 0 or 1.'}),
    oldpeak: z.string()
        .refine(value => !isNaN(parseFloat(value)) && parseFloat(value) >= 0,
            {message: 'Invalid ST Depression value. Should be a non-negative number.'}),
    slope: z.string()
        .refine(value => ['0', '1', '2'].includes(value),
            {message: 'Invalid slope value. Valid options: 0, 1, 2.'}),
    ca: z.string()
        .refine(value => !isNaN(parseInt(value, 10)) && ['0', '1', '2', '3', '4'].includes(value),
            {message: 'Invalid number of major vessels. Valid options: 0, 1, 2, 3, 4.'}),
    thal: z.string()
        .refine(value => ['0', '1', '2', '3'].includes(value),
            {message: 'Invalid thalassemia result. Valid options: 0, 1, 2, 3.'}),
});

const defaultValues = {
    age: '',
    cp: '',
    sex: '',
    trtbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
};


function MeasurementForm({patientId}: {
    patientId?: Id<'patients'>
}) {
    const [open, setOpen] = useState<boolean>(false)
    const [risk, setRisk] = useState<number | null>(0)
    const [recordId, setRecordId] = useState<Id<'records'> | null>(null)
    const patient = useQuery(api.patients.getPatient, {patientId: patientId ?? undefined})
    const {user, isSignedIn,} = useUser()
    const doctor = useQuery(api.doctors.getDoctor, {userId: user?.id ?? undefined})
    const predict = useMutation(api.records.createRecord)
    const {toast} = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: patient ? {
            ...defaultValues,
            sex: patient.sex.toString(),
            age: calculateAge(patient.dob).toString()
        } : defaultValues
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSignedIn && doctor) {
            try {

                const parsedValues = {
                    age: parseInt(values.age, 10),
                    cp: parseInt(values.cp, 10),
                    sex: parseInt(values.sex, 10),
                    trtbps: parseInt(values.trtbps, 10),
                    chol: parseInt(values.chol, 10),
                    fbs: parseInt(values.fbs, 10),
                    restecg: parseInt(values.restecg, 10),
                    exang: parseInt(values.exang, 10),
                    oldpeak: parseInt(values.oldpeak, 10),
                    slope: parseInt(values.slope, 10),
                    ca: parseInt(values.ca, 10),
                    thal: parseInt(values.thal, 10),
                }

                const { risk: _risk, recordId } = await predict({
                    patientId: patientId as Id<'patients'> ?? undefined,
                    orgId: doctor.orgId ?? undefined,
                    doctorId: doctor._id ?? undefined,
                    ...parsedValues,
                });
                setRisk(_risk);
                setOpen(true);
                setRecordId(recordId);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                toast({ title: 'Error submitting ', description: errorMessage, variant: 'destructive' });
            }
        }
    }

    return (
        <>
            {risk && recordId ?
                <PredictionResult recordId={recordId} open={open} setOpen={setOpen} patientId={patientId}
                                  risk={risk}/> : null}

            <div className={'w-full flex gap-2 justify-end'}>
                <Glossary/>
            </div>

            <div className={'flex'}>
                {patientId && patient &&
                    <div
                        className={'max-w-[280px] h-fit ml-2 pt-3 px-2 rounded-md shadow-accent bg-gradient-to-b from-blue-100 to-red-200'}>
                        <PatientCard patient={patient}/>
                    </div>
                }
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-[980px] [&>*]:w-[200px] [&>*:first-child]:hidden [&>*:last-child]:w-[980px]  p-3 flex flex-wrap gap-5">
                        <div className={'w-[300px] h-[72px]'}></div>
                        {
                            !patient
                                ?
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>age</FormLabel>
                                            <FormControl>
                                                <Input placeholder="age" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}

                                />
                                :
                                null
                        }

                        <FormField
                            control={form.control}
                            name="cp"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>cp</FormLabel>
                                    <FormControl>
                                        <Input placeholder="cp" {...field} required/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="trtbps"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>trtbps</FormLabel>
                                    <FormControl>
                                        <Input placeholder="trtbps" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chol"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>chol</FormLabel>
                                    <FormControl>
                                        <Input placeholder="chol" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fbs"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>fbs</FormLabel>
                                    <FormControl>
                                        <Input placeholder="fbs" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="restecg"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>restecg</FormLabel>
                                    <FormControl>
                                        <Input placeholder="restecg" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="exang"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>exang</FormLabel>
                                    <FormControl>
                                        <Input placeholder="exang" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="oldpeak"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>oldpeak</FormLabel>
                                    <FormControl>
                                        <Input placeholder="oldpeak" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slope"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>slope</FormLabel>
                                    <FormControl>
                                        <Input placeholder="slope" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ca"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>ca</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ca" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="thal"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>thal</FormLabel>
                                    <FormControl>
                                        <Input placeholder="thal" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        {
                            !patient
                                ?
                                <FormField
                                    control={form.control}
                                    name="sex"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>sex</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select sex"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Male</SelectItem>
                                                    <SelectItem value="0">Female</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                :
                                null
                        }
                        <div className="w-full flex py-3 items-center justify-center">
                            <Button className={'mr-3'} type="submit"
                                    disabled={(form.formState.isSubmitting || !(isSignedIn && doctor))}>
                                {form.formState.isSubmitting ?
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                        Please wait
                                    </>
                                    :
                                    <>Submit</>
                                }
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="reset" variant="destructive">
                                        Reset
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot delete the recordings.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => form.reset()}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </Form>
            </div>

        </>
    );
}

export default MeasurementForm;