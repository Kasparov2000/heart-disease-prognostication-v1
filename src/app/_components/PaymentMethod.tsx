import {Icons} from "./Icons"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, {useState} from "react";
import {addPayment} from "../../../convex/payments";
import {useMutation} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useToast} from "@/components/ui/use-toast";
import {notFound, useRouter, useSearchParams} from "next/navigation";
import {useOrganization} from "@clerk/nextjs";
import {ConvexError} from "convex/values";

const validateCardNumber = (num: string): boolean => {
    const regexPattern = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
    };

    return Object.values(regexPattern).some(regex => regex.test(num));
};


const formSchema = z.object({
    cardName: z.string().min(1, "Name is required"),
    paymentMethod: z.enum(['card'], {
        required_error: "You need to select a payment type."
    }),
    cardNumber: z.string().min(13).max(19)
        .refine(num => validateCardNumber(num), {
            message: "Invalid card number",
        }),
    expirationMonth: z.string()
        .transform((str) => parseInt(str, 10))
        .refine((num) => !isNaN(num) && num >= 1 && num <= 12, "Invalid expiration month"),
    expirationYear: z.string()
        .transform((str) => parseInt(str, 10))
        .refine((num) => !isNaN(num) && num >= new Date().getFullYear(), "Invalid expiration year"),
    cvc: z.string().length(3, "CVC must be 3 digits for most cards"),
});

type FormTypes = z.infer<typeof formSchema>;
type _planType = 'basic' | 'standard' | 'premium'

export function PaymentMethod({orgId}: {
    orgId: string
}) {
    const paymentMutation = useMutation(api.payments.addPayment)
    const {toast} = useToast()
    const searchParams = useSearchParams()
    const router = useRouter()
    const planType: _planType | null = searchParams.get('planType') as _planType | null;
    const form = useForm<FormTypes>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: "card",
        }
    });

    if (!planType || !['basic', 'standard', 'premium'].includes(planType)) {
        return notFound();
    }

    const onSubmit = async (values: FormTypes) => {
        try {
            await paymentMutation({
                paymentMethod: values.paymentMethod,
                planType,
                orgId,
                cardDetails: {
                    cardHolderName: values.cardName,
                    cardNumber: values.cardNumber,
                    expirationMonth: values.expirationMonth,
                    expirationYear: values.expirationYear,
                    cvc: values.cvc
                }
            });
            toast({
                title: 'Payment processed',
                description: 'Your payment was processed successfully.',
            });
            return router.push('/dashboard/doctor')
        } catch (error) {
            const errorMessage =
                // Check whether the error is an application error
                error instanceof ConvexError
                    ? // Access data and cast it to the type we expect
                    (error.data as { message: string }).message
                    :
                    "Unexpected error occurred";

            toast({
                title: 'Payment failed',
                description: errorMessage,
                variant: 'destructive'
            });
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>
                            Add a new payment method to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 w-[400px] m-auto">
                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({field}) => (
                                <FormItem>
                                    <RadioGroup {...field} className="grid grid-cols-3 gap-4">
                                        <div>
                                            <RadioGroupItem value="card" id="card" className="peer sr-only"/>
                                            <Label htmlFor="card"
                                                   className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                     strokeWidth="2" className="mb-3 h-6 w-6">
                                                    <rect width="20" height="14" x="2" y="5" rx="2"/>
                                                    <path d="M2 10h20"/>
                                                </svg>
                                                Card
                                            </Label>
                                        </div>
                                        {/* Additional payment method options can be added here */}
                                    </RadioGroup>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cardName"
                            render={({field}) => (
                                <FormItem>
                                    <Label htmlFor="cardName">Name</Label>
                                    <FormControl>
                                        <Input {...field} id="cardName" placeholder="First Last"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({field}) => (
                                <FormItem>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <FormControl>
                                        <Input {...field} id="cardNumber" placeholder="1234 5678 9123 4567"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            {/* Expiry Month */}
                            <FormField
                                control={form.control}
                                name="expirationMonth"
                                render={({field}) => (
                                    <FormItem>
                                        <Label htmlFor="month">Expires (Month)</Label>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}
                                                    defaultValue={field.value?.toString()}>
                                                <SelectTrigger id="month">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({length: 12}, (_, i) => (
                                                        <SelectItem key={i} value={`${i + 1}`}>
                                                            {new Date(0, i).toLocaleString('default', {month: 'long'})}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* Expiry Year */}
                            <FormField
                                control={form.control}
                                name="expirationYear"
                                render={({field}) => (
                                    <FormItem>
                                        <Label htmlFor="year">Expires (Year)</Label>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}
                                                    defaultValue={field.value?.toString()}>
                                                <SelectTrigger id="year">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Array.from({length: 10}, (_, i) => (
                                                        <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                                                            {new Date().getFullYear() + i}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {/* CVC */}
                            <FormField
                                control={form.control}
                                name="cvc"
                                render={({field}) => (
                                    <FormItem>
                                        <Label htmlFor="cvc">CVC</Label>
                                        <FormControl>
                                            <Input id="cvc" placeholder="CVC" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Continue</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>

    )
}
