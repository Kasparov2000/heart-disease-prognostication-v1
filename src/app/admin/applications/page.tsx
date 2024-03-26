'use client';

import React from 'react';
import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";


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
        // Insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // Capitalize the first character of each word
        .replace(/(^|\s)\S/g, function(letter) { return letter.toUpperCase(); })
        .trim();
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3  sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{value}</dd>
        </div>
    );
}

export default function ApplicationReviewComponent() {

    const data = useQuery(api.applications.getApplications) ?? []

    return (
        <div>
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Applicant Information</h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>
            </div>
            <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y-2 divide-gray-100">
                    {data.length > 0 && Object.keys(data[0]).map((k) => (
                        <InfoItem key={k} label={splitCamelCaseAndCapitalize(k)} value={data[0][k]}/>
                    ))}
                </dl>
            </div>
        </div>
    );
}
