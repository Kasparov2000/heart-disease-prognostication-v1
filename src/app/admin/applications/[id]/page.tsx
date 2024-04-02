'use client';

import  {useState} from 'react';
import {useParams, useRouter} from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import {countries} from "../../../../../lib/countries";
import { DownloadIcon } from "@radix-ui/react-icons";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {useOrganizationList} from "@clerk/nextjs";
import {ConvexError} from "convex/values";
import autoTable from "jspdf-autotable";
import {useAction, useMutation, useQuery} from "convex/react";
import {api} from "../../../../../convex/_generated/api";
import {mutationThatApprovesClient} from "../../../../../convex/applications";

interface ApplicationReviewProps {
    formData: {
        name: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        state: string;
        postalCode: string;
        website: string;
        type: string;
        registrationNumber: string;
        taxId: string;
        accreditationDetails: string;
        authorizedContact: string;
        authorizedEmail: string;
        authorizedPhone: string;
        positionTitle: string;
    };
}

function splitCamelCaseAndCapitalize(text: string) {
    return text
        .replace(/([A-Z])/g, ' $1')
        .replace(/(^|\s)\S/g, letter => letter.toUpperCase())
        .trim();
}

const PRIVATE_KEYS = ['_id', '_creationTime']; // List of keys to exclude

function getDisplayValue(value: any, key: string) {
    if (key === 'country') {
        return countries.find(({ iso_code }) => iso_code === value)?.country || value;
    }
    return value;
}

interface ApplicationData {
    [key: string]: any;
}

function downloadPDF(data: ApplicationData) {
    const doc = new jsPDF();
    const hospitalName = data.name || 'Hospital'; // Assuming 'name' is the field for hospital name
    const filename = `${hospitalName.replace(/\s+/g, '_')}-application-details.pdf`;

    doc.text('Applicant Information', 10, 10);
    doc.text('Hospital details and application.', 10, 20);

    const tableData = Object.keys(data)
        .filter(key => !PRIVATE_KEYS.includes(key))
        .map(key => [splitCamelCaseAndCapitalize(key), getDisplayValue(data[key], key)]);

    autoTable(doc, {
        startY: 30,
        head: [['Detail', 'Information']],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 30 }
    });

    doc.save(filename);
}

function InfoItem({ label, value, pristineKey }: { label: string; value: string | undefined | number; pristineKey: string }) {
    if (PRIVATE_KEYS.includes(pristineKey)) return null;

    const displayValue = getDisplayValue(value, pristineKey);

    return (
        <div className="w-full flex flex-row py-4">
            <dt className="text-sm w-1/2 font-medium leading-6 text-gray-900">{label}</dt>
            <dd className="mt-1 w-1/2 text-sm leading-6 text-gray-700">{displayValue}</dd>
        </div>
    );
}

export default function ApplicationReviewComponent() {
    const params = useParams<{ id: Id<'applications'> }>();
    const data: ApplicationData = useQuery(api.applications.getApplicationDetails, { applicationId: params.id ?? '' }) || {};
    const applicationDecision = useMutation(api.applications.applicationDecision);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const {toast} = useToast()
    const { createOrganization } = useOrganizationList()
    const router = useRouter()
    const handleApplicationStatusChange = async (newStatus: string) => {
        try {
            await applicationDecision({ applicationId: data._id, newStatus });
            toast({
                title: "Application accepted",
                description: `${data.name} has been created.`,
            })
            setTimeout(() => router.push('/admin/applications'), 2000)

        } catch (error) {
            const errorMessage =
                // Check whether the error is an application error
                error instanceof ConvexError
                    ? // Access data and cast it to the type we expect
                    (error.data as { message: string }).message
                    :
                    "Unexpected error occurred";
            toast({
                title: "Application declined",
                description: errorMessage,
                variant: 'destructive'
            })
        };
    };

    return (
        <div className={'w-[700px] h-[calc(100vh-3rem)] mx-auto shadow-accent my-2 rounded-md p-4 bg-white bg-transparent'}>
            <div className="px-4 flex flex-row justify-between">
                <div className={'w-4/5'}>
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Hospital details and application.</p>
                </div>
                <Button variant={'outline'} className={'ml-auto mr-2'} onClick={() => downloadPDF(data)}>
                    <span>Download PDF</span>
                    <DownloadIcon className={'ml-2'}/>
                </Button>
            </div>
            <div className="mt-6 border-t h-4/5 overflow-hidden overflow-y-scroll border-gray-100">
                <dl className="divide-y-2 divide-slate-200">
                    {data && Object.keys(data).map((k) => (
                        <InfoItem key={k} pristineKey={k} label={splitCamelCaseAndCapitalize(k)} value={data[k]}/>
                    ))}
                </dl>
            </div>
            {data.status !== 'approved' && <div className={'flex justify-center w-full'}>
                <Button onClick={() => handleApplicationStatusChange('approved')}>
                    {'Approve'}
                </Button>
                <Button className={'ml-2'} variant={'outline'}
                        onClick={() => handleApplicationStatusChange('declined')}>
                    {'Decline'}
                </Button>
            </div>}
        </div>
    );
}
