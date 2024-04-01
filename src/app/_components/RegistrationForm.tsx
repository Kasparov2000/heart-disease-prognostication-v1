'use client';

import React, {useState} from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';

import { Input} from '@/components/ui/input';
import {PhoneInput} from "@/app/_components/PhoneInput";
import {api} from "../../../convex/_generated/api";
import {useMutation} from "convex/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {countries} from "../../../lib/countries";
import {toast, useToast} from "@/components/ui/use-toast";
import SuccessModal from "@/app/_components/SuccessModal";
import {useRouter} from "next/navigation";
import RegistrationCompleteDialog from "@/app/_components/RegistrationDialog";

export const hospitalSchema = z.object({
    name: z.string().min(1, 'Hospital name is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(1, 'ZIP/Postal code is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    website: z.string().url().optional(),
    type: z.string().min(1, 'Type of hospital is required'),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    taxId: z.string().optional(),
    doctorName: z.string().min(1, 'Doctor name is required'),
    doctorEmail: z.string().email('Invalid email address for doctor'),
    doctorPhone: z.string().min(1, 'Phone number for doctor is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    licenseNumber: z.string().min(1, 'Medical license number is required'),
});

type hospitalValues = z.infer<typeof hospitalSchema>

const defaultValues = {
    name: "Sunrise Medical Center",
    country: "us",
    city: "Springfield",
    state: "Illinois",
    postalCode: "62701",
    phone: "+1-555-0123",
    email: "tafara.kasparov0@gmail.com",
    website: "https://www.sunrisemedical.org",
    type: "General Hospital",
    registrationNumber: "REG-123456",
    taxId: "TAX-987654321",
    doctorName: "Dr. Jane Smith",
    doctorEmail: "tafara.kasparov0@gmail.com",
    doctorPhone: "+1-555-9876",
    specialization: "Cardiology",
    licenseNumber: "LIC-2024-XYZ",
};


function HospitalRegistrationForm() {
    const form = useForm<z.infer<typeof hospitalSchema>>({
        resolver: zodResolver(hospitalSchema),
        defaultValues
    })

    const [applicationStatus, setApplicationStatus] = useState<boolean>(false)
    const router = useRouter()
    const submitApplication = useMutation(api.applications.createNewApplication)
    const [open, setOpen] = useState<boolean>(false);
    const {toast} = useToast()
    async function onSubmit(values: hospitalValues) {
        try {
            await submitApplication(values)
            form.reset()
            toast({ title: "Application Successful", description: "Please wait for the decision." });
            setOpen(true)

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            toast({ title: "Application Unsuccessful", description: errorMessage, variant: 'destructive' });
        }
    }

    return (
        <>
            {applicationStatus
            ?
            <SuccessModal />
            :
                <FormProvider {...form}>
                    <RegistrationCompleteDialog open={open}/>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2 rounded shadow-md">
                        {/* Doctor Details Section */}
                        <div className="flex rounded-md border-b py-12 border-gray-900/10">
                            <div className={'w-[30%] text-center'}>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Doctor Details</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Enter the professional details of the doctor.</p>
                            </div>

                            <div className="w-[65%] flex flex-col gap-10 p-8 rounded-xl shadow-sm bg-white">
                                {/* Doctor's Name */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="doctorName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Doctor Name</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="doctorEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="doctorPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <PhoneInput  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                {/* Specialization */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="specialization"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Specialization</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Medical License Number */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="licenseNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Medical License Number</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Hospital Details Section */}
                        <div className="flex rounded-md border-b py-12 border-gray-900/10">
                            <div className={'w-[30%] text-center'}>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Hospital Details</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of the hospital.</p>
                            </div>

                            <div className="w-[65%] flex flex-col gap-10 p-8 rounded-xl shadow-sm bg-white">
                                {/* Hospital Name */}
                                <div className="w-3/5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hospital Name</FormLabel>
                                                <FormControl >
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Email */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <PhoneInput  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Address */}

                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder="Select a country" />
                                                        </SelectTrigger>
                                                        <SelectContent sticky={'always'} className={'max-h-[40vh]'}>
                                                            <SelectGroup>
                                                                <SelectLabel>Countries</SelectLabel>
                                                                {countries.map((country) => (
                                                                    <SelectItem
                                                                        key={country.iso_code}
                                                                        value={country.iso_code}
                                                                    >
                                                                        {country.country}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>



                                {/* City, State, ZIP/Postal Code */}
                                <div className={'flex flex-row justify-between'}>
                                    {/* City */}
                                    <div className="City">
                                        <FormField
                                            control={form.control}
                                            name="city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* State / Province */}
                                    <div className="State">
                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State/Province</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {/* ZIP / Postal Code */}
                                    <div className="ZIP">
                                        <FormField
                                            control={form.control}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ZIP/Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Type of Hospital */}
                                <div className="sm:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type of Hospital</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Legal Documentation Section */}
                        <div className="flex rounded-md border-b py-12 border-gray-900/10">
                            <div className={"w-[30%] text-center"}>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Legal Documentation</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Provide legal documents for verification.</p>
                            </div>
                            <div className="w-[65%] flex flex-col gap-10 p-8 rounded-xl shadow-sm bg-white ">
                                {/* Business Registration Number */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="registrationNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Business Registration/License Number</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Tax ID */}
                                <div className="">
                                    <FormField
                                        control={form.control}
                                        name="taxId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tax Identification Number</FormLabel>
                                                <FormControl>
                                                    <Input  {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div className="mt-6 flex items-center w-[65%]  ml-auto pr-20 justify-end gap-x-6">
                            <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">Reset</button>
                            <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                        </div>
                    </form>
                </FormProvider>
            }
        </>
    );
}

export default HospitalRegistrationForm;
