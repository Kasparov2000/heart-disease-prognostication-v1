'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';

import { Input} from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import {PhoneInput} from "@/app/_components/PhoneInput";
import CountryInput from "@/app/_components/CountryInput";

const hospitalSchema = z.object({
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
    accreditationDetails: z.string().optional(),
    authorizedContact: z.string().min(1, 'Authorized contact is required'),
    authorizedEmail: z.string().email('Invalid email address'),
    authorizedPhone: z.string().min(1, 'Phone number is required'),
    positionTitle: z.string().min(1, 'Position/Title is required'),
});

function HospitalRegistrationForm() {
    const form = useForm<z.infer<typeof hospitalSchema>>({
        resolver: zodResolver(hospitalSchema),
    })

    function onSubmit(values: z.infer<typeof hospitalSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2 rounded shadow-md">
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
                                            <CountryInput  {...field} />
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

                        {/* Accreditation Details */}
                        <div className="">
                            <FormField
                                control={form.control}
                                name="accreditationDetails"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accreditation/Certification Details</FormLabel>
                                        <FormControl>
                                            <Textarea  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Authorized Personnel Details */}
                <div className=" flex flex-wrap border-b border-gray-900/10 pb-12">
                    <div className={'w-[30%] text-center'}>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Authorized Personnel Details</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Contact details of authorized personnel.</p>
                    </div>

                    <div className="w-[65%] flex flex-col gap-10 p-8 rounded-xl shadow-sm bg-white">
                        {/* Contact Name */}
                        <div className="">
                            <FormField
                                control={form.control}
                                name="authorizedContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Authorized Personnel Name</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Authorized Email */}
                        <div className="">
                            <FormField
                                control={form.control}
                                name="authorizedEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Authorized Personnel Email</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Authorized Phone Number */}
                        <div className="">
                            <FormField
                                control={form.control}
                                name="authorizedPhone"
                                render={({ field }) => (
                                    <FormItem className={''}>
                                        <FormLabel>Authorized Personnel Phone Number</FormLabel>
                                        <FormControl>
                                            <PhoneInput placeholder="Enter a phone number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Position Title */}
                        <div className="">
                            <FormField
                                control={form.control}
                                name="positionTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position/Title</FormLabel>
                                        <FormControl>
                                            <Input  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="mt-6 flex items-center w-[65%]  ml-auto pr-20 justify-end gap-x-6">
                        <button type="reset" className="text-sm font-semibold leading-6 text-gray-900">Reset</button>
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default HospitalRegistrationForm;
