import React, {useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "@radix-ui/react-icons";
import {DialogDescription} from "@radix-ui/themes";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import countries from "../../../lib/countries";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/components/ui/use-toast";
import {z} from "zod";
import {useMutation} from "convex/react";
import {api} from "../../../convex/_generated/api";


const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone number is required')
        .regex(/^(\+\d{1,3})?,?\s?\d{8,13}$/, 'Invalid phone number format'),
    dob: z.string(),
    idNumber: z.string().min(1, 'ID number is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required')
        .regex(/^[a-zA-Z\s-]+$/, 'Invalid city name'),
    state: z.string().min(1, 'State/Province is required')
        .regex(/^[a-zA-Z\s-]+$/, 'Invalid state name'),
    zipCode: z.string().min(1, 'ZIP/Postal code is required'),
    profilePicture: z.any()
});


type FormValues = z.infer<typeof formSchema>;
export type Patient = z.infer<typeof formSchema>;


function AddPatient() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            dob: '',
            idNumber: '',
            profilePicture: '',
            country: '',
            city: '',
            state: '',
            zipCode: '',
        }
    });

    const createPatient = useMutation(api.patients.CreatePatient);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    async function onSubmit(formData: z.infer<typeof formSchema>) {
        try {
            const fileInput = document.getElementById('profilePicId') as HTMLInputElement | null;
            const file = fileInput?.files?.[0] ?? null;

            if (!file) {
                throw new Error("Profile picture is missing");
            }

            formData.profilePicture = file;
            const { profilePicture, ...patientData } = formData;
            const postUrl = await generateUploadUrl();

            const uploadResult = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": profilePicture.type },
                body: profilePicture,
            });

            if (!uploadResult.ok) {
                throw new Error(uploadResult.statusText);
            }

            const { storageId } = await uploadResult.json();
            if (!storageId) {
                throw new Error("Failed to retrieve storage ID after upload");
            }

            const patientSubmissionData = { profilePicId: storageId, ...patientData };
            const msg = await createPatient(patientSubmissionData);
            form.reset()
            toast({ title: "Patient created", description: "Now you can make predictions" });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            console.log({ errorMessage });
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: errorMessage,
            });
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon className={'mr-2'}/>
                    Add Patient
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Add a Patient</DialogTitle>
                    <DialogDescription>
                        Add a new patient here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email Address" type={"email"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder={'Phone Number'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ID Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profilePicture"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile</FormLabel>
                                    <FormControl>
                                        <div className={'mt-2 flex flex-wrap gap-2 justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10'}>
                                            <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
                                            </svg>
                                            <Input id="profilePicId" {...field}  type="file" />
                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className={'w-full'}>
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
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
                                    </FormItem>
                                )}
                            />
                        </div>


                        {/* City, State, ZIP/Postal Code */}
                        <div className={'flex flex-row gap-2 justify-between'}>
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
                                    name="zipCode"
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
                        <DialogFooter>
                            <Button type="reset" onClick={() => form.reset()}>Reset</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default AddPatient;