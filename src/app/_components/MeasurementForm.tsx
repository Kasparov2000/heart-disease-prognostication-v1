import React, {useState} from 'react';
import {Field, Form, Formik, FormikHelpers, FormikProps, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {DownloadIcon, ReloadIcon} from "@radix-ui/react-icons"
import {Button} from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useMutation, useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import {InferType} from "prop-types";
import {Doc, Id} from '../../../convex/_generated/dataModel';
import PredictionResult from "@/app/_components/PredictionResult";
import Glossary from "@/app/_components/Glossary";
import PatientCard from "@/app/_components/PatientCard";
import {jsPDF} from "jspdf";
import {PatientType} from "@/app/_components/SearchPatientResults";
import {useUser} from "@clerk/nextjs";
import {getPatientRecord} from "../../../convex/records";
import LoadingAnimation from "@/app/_components/Loading";

interface FieldConfig {
    label: string;
    placeholder: string;
    type?: string;
    options?: {
        label: string;
        value: number
    }[];
}

const validationSchema = Yup.object().shape({
    age: Yup.number()
        .typeError('Age must be a number')
        .required('Age is required')
        .min(0, 'Age seems unrealistic. Please check.')
        .max(120, 'Age seems too high. Please check.'),
    sex: Yup.number()
        .typeError('Gender must be a number')
        .required('Gender is required')
        .oneOf([0, 1], 'Invalid gender value'),
    cp: Yup.number()
        .typeError('Chest Pain Type must be a number')
        .required('Chest Pain Type is required')
        .oneOf([0, 1, 2, 3], 'Invalid Chest Pain Type'),
    trtbps: Yup.number()
        .typeError('Resting Blood Pressure must be a number')
        .required('Resting Blood Pressure is required')
        .min(50, 'Resting BP seems too low. Please check.')
        .max(250, 'Resting BP seems too high. Please check.'),
    chol: Yup.number()
        .typeError('Serum Cholesterol must be a number')
        .required('Serum Cholesterol is required')
        .min(100, 'Cholesterol seems too low. Please check.')
        .max(600, 'Cholesterol seems too high. Please check.'),
    fbs: Yup.number()
        .typeError('Fasting Blood Sugar must be a number')
        .required('Fasting Blood Sugar is required')
        .oneOf([0, 1], 'Invalid fasting blood sugar value'),
    restecg: Yup.number()
        .typeError('Resting ECG Results must be a number')
        .required('Resting ECG Results is required')
        .oneOf([0, 1, 2], 'Invalid ECG result'),
    exang: Yup.number()
        .typeError('Exercise-Induced Angina must be a number')
        .required('Exercise-Induced Angina is required')
        .oneOf([0, 1], 'Invalid angina value'),
    oldpeak: Yup.number()
        .typeError('ST Depression Induced by Exercise must be a number')
        .required('ST Depression Induced by Exercise is required')
        .min(0, 'ST Depression value seems too low. Please check.')
        .max(10, 'ST Depression value seems too high. Please check.'),
    slope: Yup.number()
        .typeError('Slope of Peak Exercise ST must be a number')
        .required('Slope of Peak Exercise ST is required')
        .oneOf([0, 1, 2], 'Invalid slope value'),
    ca: Yup.number()
        .typeError('Number of Major Vessels must be a number')
        .required('Number of Major Vessels is required')
        .oneOf([0, 1, 2, 3, 4], 'Invalid number of major vessels'),
    thal: Yup.number()
        .typeError('Thalassemia must be a number')
        .required('Thalassemia is required')
        .oneOf([0, 1, 2, 3], 'Invalid thalassemia result'),
});

const fieldsDetails: Record<string, FieldConfig> = {
    age: {label: 'Age', placeholder: 'Enter Age'},
    sex: {label: 'Gender', placeholder: 'Select Gender', type: 'select', options: [{label: 'Male', value: 1}, {label: 'Female', value: 0}]},
    cp: {label: 'Chest Pain Type', placeholder: 'Enter Chest Pain Type'},
    trtbps: {label: 'Resting Blood Pressure', placeholder: 'Enter Resting Blood Pressure'},
    chol: {label: 'Serum Cholesterol', placeholder: 'Enter Serum Cholesterol'},
    fbs: {label: 'Fasting Blood Sugar', placeholder: 'Enter Fasting Blood Sugar'},
    restecg: {label: 'Resting ECG Results', placeholder: 'Enter Resting ECG Results'},
    exang: {label: 'Exercise-Induced Angina', placeholder: 'Enter Exercise-Induced Angina'},
    oldpeak: {label: 'ST Depression Induced by Exercise', placeholder: 'Enter ST Depression Induced by Exercise'},
    slope: {label: 'Slope of Peak Exercise ST', placeholder: 'Enter Slope of Peak Exercise ST'},
    ca: {label: 'Number of Major Vessels', placeholder: 'Enter Number of Major Vessels'},
    thal: {label: 'Thalassemia', placeholder: 'Enter Thalassemia'},
};
type formTypes = InferType<typeof validationSchema>

const initialValuesTest: formTypes = {
    age: 12,
    sex: 1,
    cp: 1,
    trtbps: 120,
    chol: 200,
    fbs: 1,
    restecg: 1,
    exang: 1,
    oldpeak: 1,
    slope: 1,
    ca: 1,
    thal: 1,
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

    const handleSubmit = async (values: typeof initialValuesTest, actions: FormikHelpers<typeof validationSchema>) => {
        if (isSignedIn && doctor){
            try {
                const {risk: _risk, recordId} = await predict({
                    patientId: patientId as Id<'patients'> ?? undefined,
                    orgId: doctor.orgId ?? undefined,
                    doctorId: doctor._id ?? undefined,
                    age: values.age,
                    sex: values.sex,
                    cp: values.cp,
                    trtbps: values.trtbps,
                    chol: values.chol,
                    fbs: values.fbs,
                    restecg: values.restecg,
                    exang: values.exang,
                    oldpeak: values.oldpeak,
                    slope: values.slope,
                    ca: values.ca,
                    thal: values.thal
                });
                setRisk(_risk)
                setOpen(true)
                setRecordId(recordId)

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
                toast({title: 'Error submitting ', description: errorMessage, variant: 'destructive'})
            }
        }    };

    const handleReset = (formikProps: FormikHelpers<typeof initialValuesTest>) => {
        formikProps.resetForm({values: initialValuesTest});
        setOpen(false)
    };

    return (
        <>
            {risk && recordId ? <PredictionResult recordId={recordId} open={open} setOpen={setOpen} patientId={patientId} risk={risk}/> : null}

            <div className={'w-full flex gap-2 justify-end'}>
                <Glossary/>
            </div>
            <Formik
                initialValues={initialValuesTest}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(formikProps) => (
                    <Form>
                        <div className={'flex flex-row h-full'}>
                            {patientId && patient &&
                                <div className={'w-[20%] h-fit ml-2 pt-3 px-2 rounded-md shadow-accent bg-gradient-to-b from-blue-100 to-red-200'}>
                                    <PatientCard patient={patient}/>
                                </div>
                                }
                                <div className={`w-[${patientId ? 70 : 100}%]`}>
                                    <div className={`flex flex-wrap h-[90%] justify-around items-center overflow-y-scroll`}>
                                        {Object.keys(fieldsDetails).map((fieldName) => (
                                            <div key={fieldName} className="flex flex-wrap gap-1 w-[280px] mx-2 h-[100px] p-3">
                                                <label htmlFor={fieldName} className="text-sm">
                                                    {fieldsDetails[fieldName].label}
                                                </label>
                                                {fieldsDetails[fieldName].type === 'select' ? (
                                                    <Field as="select" name={fieldName}
                                                           className="w-full p-1 bg-white text-xs h-[32px] mt-1">
                                                        {fieldsDetails[fieldName].options?.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                ) : (
                                                    <Field type={"text"} name={fieldName}
                                                           className="w-full p-1 mt-1 placeholder:text-xs"/>
                                                )}
                                                <div className="text-xs text-red-500 w-full h-[18px]">
                                                    <ErrorMessage name={fieldName}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full flex py-3 items-center justify-center">
                                        <Button className={'mr-3'} type="submit" disabled={(formikProps.isSubmitting || !(isSignedIn && doctor) )}>
                                            {formikProps.isSubmitting ?
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
                                                <Button type="button" variant="destructive">
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
                                                    <AlertDialogAction onClick={() => handleReset(formikProps)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>

                        </div>
                    </Form>
                )}
            </Formik>

        </>
    );
}

export default MeasurementForm;