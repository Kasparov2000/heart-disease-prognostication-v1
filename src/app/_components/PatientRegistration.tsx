"use client";

import React from 'react';
import { Form, Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import {ReloadIcon} from "@radix-ui/react-icons";

interface PatientRegistrationFormValues {
    name: string;
    dob: Date;
    gender: 'male' | 'female';
    email: string;
    phone: string;
    address: string;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    dob: Yup.date().required('Date of Birth is required'),
    gender: Yup.string().required('Gender is required').oneOf(['male', 'female'], 'Invalid gender value'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
});

const initialValues: PatientRegistrationFormValues = {
    name: '',
    dob: new Date(),
    gender: 'male',
    email: '',
    phone: '',
    address: '',
};

function PatientRegistrationForm() {
    const handleSubmit = (values: PatientRegistrationFormValues, actions: any) => {
        setTimeout(() => {
            console.log(values);
            actions.setSubmitting(false);
        }, 500);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(formikProps) => (
                <Form>
                    <div className="flex flex-col justify-around items-center">
                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="name" className="text-sm">Name</label>
                            <Field type="text" name="name" className="w-full p-1 mt-1 placeholder:text-xs" />
                            <ErrorMessage name="name" component="div" className="text-xs text-red-500" />
                        </div>

                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="dob" className="text-sm">Date of Birth</label>
                            <Field type="date" name="dob" className="w-full p-1 mt-1 placeholder:text-xs" />
                            <ErrorMessage name="dob" component="div" className="text-xs text-red-500" />
                        </div>

                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="gender" className="text-sm">Gender</label>
                            <Field as="select" name="gender" className="w-full p-1 bg-white text-xs h-[24px] mt-1">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-xs text-red-500" />
                        </div>

                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="email" className="text-sm">Email</label>
                            <Field type="email" name="email" className="w-full p-1 mt-1 placeholder:text-xs" />
                            <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
                        </div>

                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="phone" className="text-sm">Phone</label>
                            <Field type="text" name="phone" className="w-full p-1 mt-1 placeholder:text-xs" />
                            <ErrorMessage name="phone" component="div" className="text-xs text-red-500" />
                        </div>

                        <div className="flex flex-wrap gap-1 w-[300px] mx-2 h-[80px] p-2">
                            <label htmlFor="address" className="text-sm">Address</label>
                            <Field type="text" name="address" className="w-full p-1 mt-1 placeholder:text-xs" />
                            <ErrorMessage name="address" component="div" className="text-xs text-red-500" />
                        </div>
                        <div className="w-[300px] flex py-3 items-center justify-around">
                            <Button type="submit" disabled={formikProps.isSubmitting}>
                                {formikProps.isSubmitting ?
                                    <><ReloadIcon className="mr-2 h-4 w-4 animate-spin" />Please wait</> :
                                    <>Submit</>
                                }
                            </Button>
                            <Button type="reset" variant="destructive" onClick={formikProps.handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>


                </Form>
            )}
        </Formik>
    );
}

export default PatientRegistrationForm;
