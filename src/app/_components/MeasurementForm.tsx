import React from 'react';
import { Field, Form, Formik, FormikHelpers, FormikProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface FieldConfig {
    label: string;
    placeholder: string;
    type?: string;
    options?: { label: string; value: number }[];
}

const validationSchema = Yup.object().shape({
    age: Yup.number().typeError('Age must be a number').required('Age is required').min(0, 'Age seems unrealistic. Please check.'),
    sex: Yup.number().typeError('Gender must be a number').required('Gender is required').oneOf([0, 1], 'Invalid gender value'),
    cp: Yup.number().typeError('Chest Pain Type must be a number').required('Chest Pain Type is required').oneOf([0, 1, 2, 3], 'Invalid Chest Pain Type'),
    trtbps: Yup.number().typeError('Resting Blood Pressure must be a number').required('Resting Blood Pressure is required').min(50, 'Resting BP seems too low. Please check.').max(250, 'Resting BP seems too high. Please check.'),
    chol: Yup.number().typeError('Serum Cholesterol must be a number').required('Serum Cholesterol is required').min(100, 'Cholesterol seems too low. Please check.').max(600, 'Cholesterol seems too high. Please check.'),
    fbs: Yup.number().typeError('Fasting Blood Sugar must be a number').required('Fasting Blood Sugar is required').oneOf([0, 1], 'Invalid fasting blood sugar value'),
    restecg: Yup.number().typeError('Resting ECG Results must be a number').required('Resting ECG Results is required').oneOf([0, 1, 2], 'Invalid ECG result'),
    thalach: Yup.number().typeError('Max Heart Rate Achieved must be a number').required('Max Heart Rate Achieved is required').min(50, 'Heart rate seems too low. Please check.').max(250, 'Heart rate seems too high. Please check.'),
    exang: Yup.number().typeError('Exercise-Induced Angina must be a number').required('Exercise-Induced Angina is required').oneOf([0, 1], 'Invalid angina value'),
    oldpeak: Yup.number().typeError('ST Depression Induced by Exercise must be a number').required('ST Depression Induced by Exercise is required'),
    slope: Yup.number().typeError('Slope of Peak Exercise ST must be a number').required('Slope of Peak Exercise ST is required').oneOf([0, 1, 2], 'Invalid slope value'),
    ca: Yup.number().typeError('Number of Major Vessels must be a number').required('Number of Major Vessels is required').oneOf([0, 1, 2, 3], 'Invalid number of major vessels'),
    thal: Yup.number().typeError('Thalassemia must be a number').required('Thalassemia is required').oneOf([0, 1, 2], 'Invalid thalassemia result'),
});

const fieldsDetails: Record<string, FieldConfig> = {
    age: { label: 'Age', placeholder: 'Enter Age' },
    sex: { label: 'Gender', placeholder: 'Select Gender', type: 'select', options: [{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }] },
    cp: { label: 'Chest Pain Type', placeholder: 'Enter Chest Pain Type' },
    trtbps: { label: 'Resting Blood Pressure', placeholder: 'Enter Resting Blood Pressure' },
    chol: { label: 'Serum Cholesterol', placeholder: 'Enter Serum Cholesterol' },
    fbs: { label: 'Fasting Blood Sugar', placeholder: 'Enter Fasting Blood Sugar' },
    restecg: { label: 'Resting ECG Results', placeholder: 'Enter Resting ECG Results' },
    thalach: { label: 'Max Heart Rate Achieved', placeholder: 'Enter Max Heart Rate Achieved' },
    exang: { label: 'Exercise-Induced Angina', placeholder: 'Enter Exercise-Induced Angina' },
    oldpeak: { label: 'ST Depression Induced by Exercise', placeholder: 'Enter ST Depression Induced by Exercise' },
    slope: { label: 'Slope of Peak Exercise ST', placeholder: 'Enter Slope of Peak Exercise ST' },
    ca: { label: 'Number of Major Vessels', placeholder: 'Enter Number of Major Vessels' },
    thal: { label: 'Thalassemia', placeholder: 'Enter Thalassemia' },
};

const initialValuesTest: Record<string, null> = {
    age: null,
    sex: null,
    cp: null,
    trtbps: null,
    chol: null,
    fbs: null,
    restecg: null,
    thalach: null,
    exang: null,
    oldpeak: null,
    slope: null,
    ca: null,
    thal: null,
};

function Input() {
    return (
        <input/>
    )
}

function MeasurementForm() {
    const handleSubmit = setTimeout((values: typeof initialValuesTest, actions: FormikHelpers<typeof initialValuesTest>) => {

    }, 5000);

    const handleReset = (formikProps: FormikHelpers<typeof initialValuesTest>) => {
        formikProps.resetForm({ values: initialValuesTest });
    };

    return (
        <Formik
            initialValues={initialValuesTest}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formikProps) => (
                <Form>
                    <div className="flex flex-wrap h-[90%] justify-around items-center overflow-y-scroll">
                        {Object.keys(fieldsDetails).map((fieldName) => (
                            <div key={fieldName} className="flex flex-wrap gap-1 w-[280px] mx-2 h-[100px] p-3">
                                <label htmlFor={fieldName} className="text-sm">
                                    {fieldsDetails[fieldName].label}
                                </label>
                                {fieldsDetails[fieldName].type === 'select' ? (
                                    <Field as="select" name={fieldName} className="w-full p-1 bg-white text-xs h-[32px] mt-1">
                                        {fieldsDetails[fieldName].options?.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Field>
                                ) : (
                                    <Field type={"text"} name={fieldName} className="w-full p-1 mt-1 placeholder:text-xs" />
                                )}
                                <div className="text-xs text-red-500 w-full h-[18px]">
                                    <ErrorMessage name={fieldName} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex py-3 items-center justify-center">
                        <Button className={'mr-3'} type="submit" disabled={formikProps.isSubmitting}>
                            {formikProps.isSubmitting ?
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
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
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default MeasurementForm;